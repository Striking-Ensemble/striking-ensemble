const InstagramStrategy = require('passport-instagram').Strategy;
const instagramAuth = require('./keys.js');
const Influencer = require('../db/Influencer.js');

module.exports = (passport) => {
  passport.use(new InstagramStrategy( instagramAuth,
    function (accessToken, refreshToken, profile, done) {
      console.log('WHAT AM I GIVEN?', profile);
      Influencer.findOne({
          id: profile.id 
        }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            user = new Influencer({
              id: profile.id,
              username: profile.username,
              full_name: profile.full_name,
              bio: profile.bio,
              website: profile.website
            });
            user.save((err) => {
              if (err) {
                console.log(err);
              }
              return done(err, user);
            });
          } else {
            return done(err, user);
          }
      });
    }
  ));
};
 