'use strict';
let hostUri; 
if (process.env.HOST) {
  console.log('HOST:', process.env.HOST);
  hostUri = process.env.HOST
} else {
  console.log('small host:', process.env.HOST);
  hostUri = process.env.host
}
console.log(`${hostUri}/auth/instagram/callback`),

module.exports = {
  secret: 'sessionSecret',
  // Configuration for Instagram Passport
  clientID: process.env.Instagram_client_id,
  clientSecret: process.env.Instagram_client_secret,
  callbackURL: 'https://sleepy-citadel-40559.herokuapp.com/auth/instagram/callback',
  // Configuration for Stripe.
  // API Keys: https://dashboard.stripe.com/account/apikeys
  // Connect Settings: https://dashboard.stripe.com/account/applications/settings
  stripe: {
    secretKey: process.env.Stripe_secretKey,
    publishableKey: process.env.Stripe_publishableKey,
    clientId: process.env.Stripe_clientId,
    authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
    tokenUri: 'https://connect.stripe.com/oauth/token'
  },
  twoTap: {
    publicToken: process.env.TwoTap_public_token,
    privateToken: process.env.TwoTap_private_token
  }
};
