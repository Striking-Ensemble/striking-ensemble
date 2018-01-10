'use strict';

module.exports = {
  secret: 'sessionSecret',
  // Configuration for Instagram Passport
  clientID: process.env.Instagram_client_id,
  clientSecret: process.env.Instagram_client_secret,
  callbackURL: (process.env.HOST ? `${process.env.HOST}/auth/instagram/callback` : undefined) || 'http://localhost:3000/auth/instagram/callback',
  // Configuration for Stripe.
  // API Keys: https://dashboard.stripe.com/account/apikeys
  // Connect Settings: https://dashboard.stripe.com/account/applications/settings
  stripe: {
    secretKey: process.env.Stripe_secretKey,
    publishableKey: process.env.Stripe_publishableKey,
    clientId: 'YOUR_STRIPE_CLIENT_ID',
    authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
    tokenUri: 'https://connect.stripe.com/oauth/token'
  },
  twoTap: {
    publicToken: process.env.TwoTap_public_token,
    privateToken: process.env.TwoTap_private_token
  }
};
