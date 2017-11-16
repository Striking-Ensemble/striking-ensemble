const bodyParser = require('body-parser');
const request = require('request');

// Controller methods for TwoTap

exports.checkout = (req, res) => {
  let checkoutRequest = req.body;
  checkoutRequest.products = JSON.parse(req.body.products);
  checkoutRequest.confirm = JSON.parse(req.body.confirm);
  console.log('CONTENTS OF checkReq', checkoutRequest);
  
  request.post('https://checkout.twotap.com/prepare_checkout', { checkout_request: checkoutRequest }, (err, res, body) => {
    if (err) {
      throw err;
    }
    console.log('FROM TT', body);
  });
};