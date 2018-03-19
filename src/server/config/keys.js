'use strict';
let hostUri; 
if (process.env.NODE_ENV !== 'production') {
  hostUri = 'http://localhost:3000/auth/instagram/callback';
} else {
  hostUri = 'https://sleepy-citadel-40559.herokuapp.com/auth/instagram/callback';
}

console.log('SANITY CHECK:', process.env.GoogleService_privateKey);

module.exports = {
  secret: 'sessionSecret',
  // Configuration for Instagram Passport
  instagram: {
    clientID: process.env.Instagram_client_id,
    clientSecret: process.env.Instagram_client_secret,
    callbackURL: hostUri
  },
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
  },
  googleService: {
    client_email: process.env.GoogleService_clientEmail,
    private_key: process.env.GoogleService_privateKey
  }
};
