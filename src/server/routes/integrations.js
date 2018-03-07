// =============== Purchase Controller ================ //

const express = require('express');
const request = require('request');

exports.integration = (req, res) => {
  console.log('Integration Controller:', process.env.twoTap_public_token);
  const publicToken = process.env.twoTap_public_token;
  const customCSSURL = req.query.custome_css_url || `${req.app.get('own_url')}/:username/assets/css/integration_twotap.css`;
  const smsConfirmURL = 'http://localhost:3000/purchase_confirm_callback';

  res.send({
    publicToken: publicToken,
    customCSSURL: customCSSURL,
    smsConfirmURL: smsConfirmURL
  })
};

exports.purchaseConfirmCallback = (req, res) => {
  console.log('THIS GOT USED, purchase confirm', req.body);
  /*
  THIS GOT USED, purchase confirm {
    purchase_id: '5a792b00eeba220316d9a275',
    cart_id: '5a792abc30ca6b3e49dda567',
    user_id: '5a42ea62f9d9a878c694da30',
    created_at: '2018-02-06T04:11:44.856Z',
    total_prices:
      {
        sales_tax: '$13.77',
        shipping_price: '$5.00',
        final_price: '$158.77'
      },
    destination: 'domestic',
    test_mode: 'fake_confirm',
    notes: null,
    used_profiles: { shipping: '926b3tsc', payment: '4ys77wry' },
    unique_token: '5643578',
    pending_confirm: true,
    sites:
      {
        '539ec15bce04fa4c5100002d':
          {
            info: {keys:"url, name, logo(url pics)"},
            prices: [Object],
            details: [Object],
            failed_to_add_to_cart: null,
            order_id: null, *"String. After 'confirm' finished this could contain the site's order id."
            products: {keys: "product_id": {info}, "url", "required_fields", "status"},
            status: 'done'
          }
      },
    session_finishes_at: 1517890704916,
    message: 'done'
  }
  */
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
  /*
    Same as incoming /purchase/confirm but with final_message field
    and order_id under sites field may be provided...
    order_id: 'fake_confirm_order_id'
    {
      final_message: 'Hi! We\'ve confirmed your order:
        \n\nPerry Ellis total $158.77 vs our initial estimate of $153.30 (shipping $5.00 vs estimated $0.00).
        \n* products: Solid Texture Lapel Jacket.\n* delivery estimate: Standard Shipping (4-8 business days).
        \n* store order number: fake_confirm_order_id.
        \n\nTotal $158.77.' 
    }
  */
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
