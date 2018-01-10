const influencerRequired = (req, res, next) => {
  console.log('ENSURE AUTH:', req.isAuthenticated());
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  next();
}

module.exports = influencerRequired;
