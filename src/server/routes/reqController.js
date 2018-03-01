const config = require('../config/keys');
const stripe = require('stripe')(config.stripe.secretKey);
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const querystring = require('querystring');
const request = require('request');
const Promise = require('bluebird');
const passport = require('passport');
const Media = require('../db/media');
const mediaController = require('../db/mediaController');
const Influencer = require('../db/Influencer');
const integrations = require('./integrations');
const twoTapApiURL = 'https://checkout.twotap.com/prepare_checkout';
const instaApiURL = 'https://api.instagram.com/v1/users/self/media/recent';
const jwtClient = require('../config/googleAuth').jwtClient;
const google = require('googleapis').google;

// Controller methods for TwoTap
/**
 * POST /purchase_confirm_callback
 *
 * Callback to confirm the purchase before Two Tap finalizes it.
 */
exports.purchaseConfirmController = (req, res) => {
  integrations.purchaseConfirmCallback(req, res);
};

exports.purchaseStatusController = (req, res) => {
  integrations.purchaseStatus(req, res);
}

// ======================================================================= //

// ====================== Controller methods for Stripe =================== //

// Redirect to Stripe to set up payments.
exports.setupPayment = (req, res) => {
    // Generate a random string as state to protect from CSRF and place it in the session.
  req.session.state = Math.random().toString(36).slice(2);
  // Prepare the mandatory Stripe parameters.
  let parameters = {
    client_id: config.stripe.clientId,
    state: req.session.state
  };
  // Optionally, Stripe Connect accepts `first_name`, `last_name`, `email`,
  // and `phone` in the query parameters for them to be autofilled.
  // parameters = Object.assign(parameters, {
  //   'stripe_user[business_type]': req.user.type || 'individual',
  //   'stripe_user[first_name]': req.user.firstName || undefined,
  //   'stripe_user[last_name]': req.user.lastName || undefined,
  //   'stripe_user[email]': req.user.email,
  //   'stripe_user[business_name]': req.user.businessName || undefined,
  // });

  // Redirect to Stripe to start the Connect onboarding.
  res.redirect(config.stripe.authorizeUri + '?' + querystring.stringify(parameters));
}

/**
 * GET /billing/stripe/token
 *
 * Connect the new Stripe account to the platform account.
 */
exports.getStripeToken = (req, res) => {
  // Check the state we got back equals the one we generated before proceeding.
  if (req.session.state != req.query.state) {
    res.redirect(303, '/login');
  }
  // Post the authorization code to Stripe to complete the authorization flow.
  request.post(config.stripe.tokenUri, {
    form: {
      grant_type: 'authorization_code',
      client_id: config.stripe.clientId,
      client_secret: config.stripe.secretKey,
      code: req.query.code
    },
    json: true
  }, (err, response, body) => {
    if (err || body.error) {
      console.log('The Stripe onboarding process has not succeeded.');
    } else {
      // Update the user model and store the Stripe account ID in the datastore.
      // This Stripe account ID will be used to pay out to the influencer.
      let query = { username: req.user.username };
      Influencer.update(query, { stripeAccountId: body.stripe_user_id }).exec();
      req.user.stripeAccountId = body.stripe_user_id;
      req.user.save();
      // Redirect to the final stage.
      res.redirect('/billing');
    }
  });
};

/**
 * GET /billing/stripe/transfers
 *
 * Redirect to Stripe to view transfers and edit payment details.
 */
exports.getStripeTransfers = async (req, res) => {
  const influencer = req.user;
  // Make sure the logged-in influencer had completed the Stripe onboarding.
  if (!influencer.stripeAccountId) {
    console.log('stripe on-boarding?', influencer.stripeAccountId);
    return res.redirect(303, '/login');
  }
  try {
    // Generate a unique login link for the associated Stripe account.
    const loginLink = await stripe.accounts.createLoginLink(influencer.stripeAccountId);
    // Retrieve the URL from the response and redirect the user to Stripe.
    return res.redirect(loginLink.url);
  } catch (err) {
    console.log('Failed to create a Stripe login link.');
    return res.redirect('/login');
  }
};

/**
 * POST /billing/stripe/payout
 *
 * Generate an instant payout with Stripe for the available balance.
 */
exports.payout = async (req, res) => {
  const influencer = req.user;
  try {
    // Fetch the account balance for find available funds.
    const balance = await stripe.balance.retrieve({ stripe_account: influencer.stripeAccountId });
    // This instance only uses USD so we'll just use the first available balance.
    // Note: There are as many balances as currencies used in your application.
    const { amount, currency } = balance.available[0];
    // Create the instant payout.
    const payout = await stripe.payouts.create({
      method: 'instant',
      amount: amount,
      currency: currency,
      statement_descriptor: config.appName
    }, {
        stripe_account: influencer.stripeAccountId
      });
  } catch (err) {
    console.log(err);
  }
  // Redirect to the pilot dashboard.
  res.redirect('/billing');
};

/**
 * POST /billing/stripe/deactivate
 *
 * This endpoint is used for revoking access of an app to an account.
 */
exports.deactivate = (req, res) => {
  const influencer = req.user;

  request.post({
    url: 'https://connect.stripe.com/oauth/deauthorize',
    headers: {
      Authorization: `Bearer ${config.stripe.secretKey}`
    },
    form: {
      client_id: config.stripe.clientId,
      stripe_user_id: influencer.stripeAccountId
    }
  }, (err, response, body) => {
    if (err || body.error) {
      console.log('The Stripe deauthorize process has not succeeded.', err || body.error);
    } else {
      let query = { username: req.user.username };
      Influencer.update(query, { $unset: { stripeAccountId: 1 } }).exec();
      req.user.stripeAccountId = '';
      console.log('Deactivated Acct:', body);
      res.send(req.user);
    }
  })
};

// ======================================================================== //

// Controller methods for Instagram

/**
 * POST /account/media => due to the need of updating posts on our own db
 *
 * Get media from insta for logged in users & send to client
**/
exports.getMedia = (req, res) => {
  if (!req.app.settings.authInfo) {
    console.log('Missing authInfo... please log in 1st');
    res.redirect(303, '/login');
  }
  // set options to insta api path for request use
  let options = {
    url: instaApiURL + '/?access_token=' + req.app.settings.authInfo.accessToken
  };
  if (req.params.count) {
    // set options.url with post count returned to also receive pagination url
    options.url = options.url + '&count=' + req.params.count;
  }
  if (req.params.max_id) {
    // request for next page
    options.url = options.url + '&max_id=' + req.params.max_id;
  }

  request.get(options, (err, response, body) => {
    if (err) {
      throw err;
    }
    let parsedBody = JSON.parse(body);
    if (req.app.settings.authInfo.newUser) {
      console.log('NEW USER DETECTED IN SAVING MEDIA');
      // create an array of posts from insta query results to save in db
      let mediaArr = parsedBody.data.map(obj => {
        let tempImages = obj.images;
        for (let key in obj.images) {
          // remove the signatures on url images
          tempImages[key].url = obj.images[key].url.replace(/vp.*\/.{32}\/.{8}\//, '');
        }

        let tempVideos = obj.type == 'video' ? obj.videos : null;
        if (tempVideos) {
          for (let prop in obj.videos) {
            // remove the signatures on url videos
            tempVideos[prop].url = obj.videos[prop].url.replace(/vp.*\/.{32}\/.{8}\//, '');
          }
        }

        return {
          _id: obj.id,
          _creator: req.user.id,
          username: req.user.username,
          caption: obj.caption,
          created_time: obj.created_time,
          images: tempImages,
          link: obj.link,
          tags: obj.tags,
          post_type: obj.type,
          videos: tempVideos
        }
      });

      Media.insertMany(mediaArr)
        .then((response) => console.log('INSERTED MANY #228'))
        .catch(err => console.log('ERROR IN INSERTING MEDIA #229!', err));
      req.app.settings.authInfo.newUser = false;
      res.send(mediaArr);
    } else {
      // do returning user logic
      console.log('USER EXISTS in getMedia. Now saving in a special way...');
      let newMediaList = [];
      let oldMediaList = [];
      // add post to media list after mediaCount fn resolves the queries
      function mediaCount(arr) {
        return arr.reduce((promise, item) =>
          promise.then(() => Media.count({ _id: item.id })
            .then((count) => {
              console.log('CAN I EVEN SEE??', count);
              // if item does not exists in Media db
              if (count <= 0) {
                let tempItem = item;
                let tempImages = item.images;
                for (let key in item.images) {
                  // remove the signatures on url images
                  tempImages[key].url = item.images[key].url.replace(/vp.*\/.{32}\/.{8}\//, '');
                }

                let tempVideos = item.type == 'video' ? item.videos : null;
                if (tempVideos) {
                  for (let prop in item.videos) {
                    // remove the signatures on url videos
                    tempVideos[prop].url = item.videos[prop].url.replace(/vp.*\/.{32}\/.{8}\//, '');
                  }
                }
                tempItem.images = tempImages;
                tempItem.videos = tempVideos;
                newMediaList.push(tempItem);
              } else {
                oldMediaList.push(item);
              }
            })), Promise.resolve())
      }
      mediaCount(parsedBody.data).then(() => {
        if (newMediaList.length == 0) {
          Media.find({ _creator: req.user._id }, (err, response) => {
            if (err) {
              console.log('IN MEDIA COUNT #78', err);
            }
            console.log('NO NEW MEDIA TO ADD FOR USER... sending oldies');
            res.send(response);
          })
        } else {
          let arrToSend = [...newMediaList, ...oldMediaList];
          Media
            .insertMany(newMediaList)
            .then(response => console.log('GOT THEM UPDATED!'))
            .catch(err => console.log('ERR in reqController #89', err));
          res.send(arrToSend);
        }
      })
    }
  });
};

exports.getInstaPost = (req, res) => {
  console.log('GRAB 1 INSTA', req.params);
  Media.find({_id: req.params.id}, (err, response) => {
    if (err) {
      console.log('Error in getInstaPost', err)
    }
    res.send(response)
  })
};

// submit media to specified influencer in db
exports.submitMedia = (req, res) => {
  console.log('USER CONTENTS IN reqController by submitMedia', req.user);
  // if user is new, use saveMedia controller
  if (req.app.settings.authInfo.newUser) {
    mediaController.saveMedia(req, res);
  } else {
    // if user already exists, use updateMedia controller
    mediaController.updateMedia(req, res);
  }
};

exports.submitLinks = (req, res) => {
  console.log('can i hazz user?', req.user);
  // find db user
  mediaController.updateRetailLinks(req, res);
};

exports.getInfluencerPosts = (req, res) => {
  console.log('GET INFLUENCER POSTS controller');
  mediaController.getInfluencerMedia(req, res);
};

// Let the front-end handle the rendering
exports.getFrontEnd = (req, res) => {
  console.log('get Front End route');
  req.app.use(express.static(path.join(__dirname, '../../../public')));
  res.end();
};

/**
 * GET /:username/media-products
 *
 * Get media that has retailLinks only
 */
exports.getMediaProducts = (req, res) => {
  let query = { 
    username: req.params.username,
    retailLinks: { $exists: true }
  };
  Media.find(query, (err, response) => {
    if (err) {
      console.log('Error in getMediaProducts controller:', err);
    }
    res.send(response);
  });
};

exports.getPostCatalog = (req, res) => {
  // TwoTap logic here for saving product catalogs to catalogs Schema
};

/**
 * GET /reports/analytics
 *
 * Get Google Analytics Reports
 */

exports.getReports = (req, res) => {
  console.log('getting REPORTS with BODY:', req.body);
  const VIEW_ID = 'ga:168623324';
  jwtClient.authorize((err, tokens) => {
    if (err) {
      console.log('ERROR IN jwtClient auth', err);
      return;
    }
    let analytics = google.analytics('v3');
    analytics.data.ga.get({
      'auth': jwtClient,
      'ids': VIEW_ID,
      'dimensions': "ga:productBrand,ga:productName",
      'metrics': "ga:itemQuantity,ga:itemRevenue,ga:calcMetric_Commisions",
      'filters': `ga:productCouponCode=@${req.body.affiliateLink}`,
      "start-date": "30daysAgo",
      "end-date": "yesterday"
    }, (err, response) => {
      if (err) {
        console.log('ERROR in get analytics', err);
        return;
      }
      res.send(response.data);
    })
  });
};
