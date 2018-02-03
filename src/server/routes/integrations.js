// =============== Purchase Controller ================ //

const express = require('express');
const request = require('request');

exports.integration = (req, res) => {
  console.log('Integration Controller:', process.env.twoTap_public_token);
  const publicToken = process.env.twoTap_public_token;
  const customCSSURL = req.query.custome_css_url || `${req.app.get('own_url')}/:username/public/assets/css/integration_twotap.css`;
  const smsConfirmURL = 'http://localhost:3000/purchase_confirm_callback';

  res.send({
    publicToken: publicToken,
    customCSSURL: customCSSURL,
    smsConfirmURL: smsConfirmURL
  })
};

exports.purchaseConfirmCallback = (req, res) => {
  console.log('THIS GOT USED, purchase confirm', req.body);
  let apiURL = req.app.settings.twoTap_apiUrl;
  let testMode = req.body.test_mode || 'fake_confirm';
  let purchaseId = req.body.purchase_id;
  let uniqueToken = req.body.unique_token;
  let sites = req.body.sites;
  const privateToken = req.app.settings.twoTap_private_token;

  let callPath = '/v1.0/purchase/confirm?private_token=' + privateToken;
  request.post(apiURL + callPath, {
    form: {
      purchase_id: purchaseId,
      test_mode: testMode
    },
    json: true
  }, (err, response, body) => {
    if (err) {
      console.log('ERROR Detected on purchaseConfirm', err);
    }
    /*
     * Users should have received a confirmed SMS message
     * and expected body format from this call is...
     * {
     *   "purchase_id": "50f414b9e6a4869bf6000010",
     *   "message": "still_processing",
     *   "description": "Still processing."
     * }
    */
    res.send(body);
  });
};

exports.purchaseUpdatedCallback = (req, res) => {
  console.log('Requesting UPDATES from 2Tap:', req.body);
  let purchaseId = req.body.purchase_id;
  res.send(req.body);
};

exports.purchaseStatus = (req, res) => {
  console.log('CHECK STATUS OF PURCHASE');
  let apiURL = req.app.settings.twoTap_apiUrl;
  let purchaseId = req.body.purchase_id;
  let test_mode = req.body.test_mode;

  let callPath = '/v1.0/purchase/status?public_token=' + req.app.settings.twoTap_public_token;

  request.get(apiURL + callPath + '&purchase_id' + purchaseId + '&test_mode' + test_mode, (err, response, body) => {
    if (err) {
      console.log('Error in purchase status', err);
    }
    console.log('in purchase status!', body);
    res.send(body);
  });

};
