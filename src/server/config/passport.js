const InstagramStrategy = require('passport-instagram').Strategy;
const instagramAuth = require('./keys');
const Influencer = require('../db/Influencer');

module.exports = (passport) => {

  // serialize and deserialize
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  
  passport.use(new InstagramStrategy( instagramAuth,
    function (accessToken, refreshToken, profile, done) {
      console.log('accessToken:', accessToken);
      console.log('WHAT AM I GIVEN INSIDE PASSPORT?', profile);
      Influencer.findOne({
          id: profile.id 
        }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            let data = profile._json.data;
            user = new Influencer({
              id: data.id,
              username: data.username,
              profile_picture: data.profile_picture,
              full_name: data.full_name,
              bio: data.bio,
              website: data.website,
              is_business: data.is_business
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
 