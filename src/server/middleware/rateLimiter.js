const rateLimiter = (req, res, next) => {
  console.log('RATE-LIMITING');
  next();
}

module.exports = rateLimiter;
