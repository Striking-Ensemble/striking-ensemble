const InstagramStrategy = require('passport-instagram').Strategy;
const instagramAuth = require('./keys').instagram;
const Influencer = require('../db/Influencer');

module.exports = (passport) => {
  // serialized to the session
  passport.serializeUser((user, done) => {
    console.log('serializeUser by obj id:', user._id);
    done(null, user._id);
  });
  // deserialize by finding the user by ID
  // when subsequent requests are made.
  passport.deserializeUser((id, done) => {
    console.log('DESERIALIZE, should be obj id:', id);
    Influencer.findById(id, (err, user) => {
      // (!err) ? done(null, user) : done(err, null);
      done(err, user);
    })
  });

  passport.use(new InstagramStrategy( instagramAuth,
    function (accessToken, refreshToken, profile, done) {
      // will be used under req.authInfo
      // only accessible up until passport finishes auth
      let info = {};

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
            affiliateLink: `https://strikingensemble.com/${data.username}`,
            accessToken: accessToken
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
 