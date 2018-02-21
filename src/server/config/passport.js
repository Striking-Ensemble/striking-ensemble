const InstagramStrategy = require('passport-instagram').Strategy;
const instagramAuth = require('./keys');
const Influencer = require('../db/Influencer');

module.exports = (passport) => {
  passport.use(new InstagramStrategy( instagramAuth,
    function (accessToken, refreshToken, profile, done) {
      // will be used under req.authInfo
      // only accessible up until passport finishes auth
      let info = {
        accessToken: accessToken
      }

      Influencer.findOne({
        _id: profile.id 
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          let data = profile._json.data;
          user = new Influencer({
            _id: data.id,
            username: data.username,
            profile_picture: data.profile_picture,
            full_name: data.full_name,
            bio: data.bio,
            website: data.website,
            is_business: data.is_business,
            affiliateCode: `SEI-${data.username}-${data.id.slice(-4)}`
          }, { bufferCommands: false });
          info.newUser = true;
          user.save((err) => {
            if (err) {
              console.log(err);
            }
            return done(err, user, info);
          });
        } else {
          info.newUser = false;
          return done(err, user, info);
        }
      });
    }
  ));
};
 