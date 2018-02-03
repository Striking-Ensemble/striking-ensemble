'use strict';
let hostUri; 
if (process.env.HOST) {
  hostUri = process.env.HOST
} else {
  hostUri = process.env.host
}

module.exports = {
  secret: 'sessionSecret',
  // Configuration for Instagram Passport
  clientID: process.env.Instagram_client_id,
  clientSecret: process.env.Instagram_client_secret,
  callbackURL: `${hostUri}/auth/instagram/callback`,
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
