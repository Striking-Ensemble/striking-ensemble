// =============== Purchase Controller ================ //

const express = require('express');

exports.integration = (req, res) => {
  const publicToken = process.env.TwoTap_public_token;
  const cutomsCSSURL = req.query.custome_css_url || 'http://localhost:2500/stylesheets/integration_twotap.css';
  const smsConfirmURL = 'http://localhost:3000/purchase_confirm_callback';

  // need to work on client-side rendering
  // res.render('integration', {
  //   publicToken: publicToken,
  //   customCSSURL: customCSSURL,
  //   smsConfirmURL: smsConfirmURL
  // });
};

exports.purchaseConfirmCallback = (req, res) => {
  let apiURL = 'https://api.twotap.com';
  let purchaseId = req.body.purchase_id;
  let testMode = req.body.test_mode;
  const privateToken = req.app.settings.private_token;

  let callPath = '/v1.0/purchase/confirm?private_token=' + privateToken;

  let queryObj = {
    json: {
      "purchase_id": purchaseId,
      "test_mode": "fake_confirm"
    }
  }


  request.post(apiURL + callPath, queryObj, function (error, response, body) {
    res.json(JSON.parse(body));
  });
};
