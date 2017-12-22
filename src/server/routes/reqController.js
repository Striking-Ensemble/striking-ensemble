const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
const Promise = require('bluebird');
const passport = require('passport');
const Media = require('../db/media');
const mediaController = require('../db/mediaController');
// Controller methods for TwoTap
const twoTapApiURL = 'https://checkout.twotap.com/prepare_checkout';
const instaApiURL = 'https://api.instagram.com/v1/users/self/media/recent';

exports.prepareCheckout = (req, res) => {
  console.log('READY FOR CHECKOUT');
  let checkoutRequest = req.body;
  checkoutRequest.products = JSON.parse(req.body.products);
  checkoutRequest.confirm = {
    method: 'sms',
    sms_confirm_url: 'http://localhost:3000/purchase_confirm_callback'
  };
  checkoutRequest.public_token = process.env.TwoTap_public_token;
  checkoutRequest.unique_token = (Math.floor(Math.random() * 9999999) + 1).toString();
  console.log('CONTENTS OF checkReq', checkoutRequest);
  
  const callPath = '';

  request.post(apiURL, { checkout_request: checkoutRequest }, (err, res, body) => {
    if (err) {
      throw err;
    }
    console.log('FROM TT', body);
    res.json(JSON.parse(body));
  });
};

// ======================================================================= //

// Controller methods for Instagram

exports.getMedia = (req, res) => {
  let options = {
    url: instaApiURL + '/?access_token=' + req.app.settings.authInfo.accessToken
  };
  request.get(options, (err, response, body) => {
    if (err) {
      throw err;
    }
    let nowBody = JSON.parse(body);
    console.log('GOT IT COACH! in reqController getMedia');
    if (req.app.settings.authInfo.newUser) {
      console.log('NEW USER DETECTED IN SAVING MEDIA');
      let mediaArr = nowBody.data.map(obj => {
        if (obj.type == 'video') {
          console.log('HEAVY CHECKING #54', obj.id);
          return {
            _id: obj.id,
            _creator: req.user.id,
            username: req.user.username,
            caption: obj.caption,
            created_time: obj.created_time,
            images: obj.images,
            link: obj.link,
            tags: obj.tags,
            post_type: obj.type,
            videos: obj.videos
          }
        } else {
          return {
            _id: obj.id,
            _creator: req.user.id,
            username: req.user.username,
            caption: obj.caption,
            created_time: obj.created_time,
            images: obj.images,
            link: obj.link,
            tags: obj.tags,
            post_type: obj.type
          }
        }
      });

      Media
        .insertMany(mediaArr)
        .then((response) => console.log('INSERTED MANY #84'))
        .catch(err => console.log('ERROR IN INSERTING MEDIA #81!', err));

      req.app.settings.authInfo.newUser = false;
      res.send(nowBody.data);
    } else {
      console.log('USER EXISTS in getMedia. Now saving in a special way...');
      let mediaArr = [];
      function mediaCount(arr) {
        return arr.reduce((promise, item) => 
          promise.then(() => Media.count({_id: item.id})
            .then((count) => {
              console.log('CAN I EVEN SEE??', count);
              if (count <= 0) {
                mediaArr.push(item);
              }
            })), Promise.resolve())
      }
      mediaCount(nowBody.data).then(() => {
        if (mediaArr.length == 0) {
          Media.find({_creator: req.user._id}, (err, response) => {
            if (err) {
              console.log('IN MEDIA COUNT #78', err);
            }
            console.log('NO NEW MEDIA TO ADD FOR USER... sending oldies');
            res.send(response);
          })
        } else {
          let arrToSend = [...mediaArr, ...nowBody.data];
          Media
            .insertMany(mediaArr)
            .then(response => console.log('GOT THEM UPDATED!'))
            .catch(err => console.log('ERR in reqController #89', err));
          res.send(arrToSend);
        }
      })
    }
  });
}

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

// Let the front-end handle the rendering
exports.getFrontEnd = (req, res) => {
  console.log('get Front End route');
  res.app.use(express.static(path.join(__dirname, '../../../public')));
  res.end();
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
