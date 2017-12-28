const callbackAddress = (process.env.HOST? `${process.env.HOST}/auth/instagram/callback` : undefined) || 'http://localhost:3000/auth/instagram/callback';
const INSTAGRAM_CLIENT_ID = process.env.Instagram_client_id;
const INSTAGRAM_CLIENT_SECRET = process.env.Instagram_client_secret;
console.log('WHAT ARE YOU?', callbackAddress);
module.exports = {
  clientID: INSTAGRAM_CLIENT_ID,
  clientSecret: INSTAGRAM_CLIENT_SECRET,
  callbackURL: callbackAddress,
};
