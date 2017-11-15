const InstagramStrategy = require('passport-instagram').Strategy;
const instagramAuth = require('./keys.js');
const Influencer = require('../db/Influencer.js');

module.exports = (passport) => {
  passport.use(new InstagramStrategy( instagramAuth,
    function (accessToken, refreshToken, profile, done) {
      Influencer.findOrCreate({ 
        id: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));
};
