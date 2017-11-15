const base_uri = 'http://localhost:';
const PORT = process.env.PORT || 3000;
const callbackAddress = process.env.HOST || `${base_uri + PORT}/auth/instagram/callback`;
const INSTAGRAM_CLIENT_ID = process.env.Instagram_client_id;
const INSTAGRAM_CLIENT_SECRET = process.env.Instagram_client_secret;

module.exports = {
  clientID: INSTAGRAM_CLIENT_ID,
  clientSecret: INSTAGRAM_CLIENT_SECRET,
  callbackURL: callbackAddress,
};
