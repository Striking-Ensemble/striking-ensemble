const google = require('googleapis').google;
const googleService = require('./keys').googleService;
const key = require('../../../Striking-Ensemble-bf76456e2e17');

exports.jwtClient = new google.auth.JWT(
  googleService.client_email, 
  null, 
  googleService.private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'], 
  null
);
