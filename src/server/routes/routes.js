const reqRoutes = require('express').Router();
const bodyParser = require('body-parser');
const influencerController = require('../db/influencerController.js');

// middleware that is specific to this router
reqRoutes.use(function timeLog(req, res, next) {
  console.log('Time in Routes file: ', Date.now());
  next();
});

// Public route handlers
reqRoutes.get('/:username', (req, res) => {
  console.log('Influencer\'s Page!');
  influencerController.retrieveOne(req, res);
});

module.exports = reqRoutes;
