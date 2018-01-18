const influencerRequired = (req, res, next) => {
  console.log('ENSURE AUTH:', req.isAuthenticated());
  if (!req.isAuthenticated()) {
    return res.redirect(401, '/login');
  }
  next();
}

module.exports = influencerRequired;
