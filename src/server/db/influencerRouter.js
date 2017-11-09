const influencerRouter = require('express').Router();
const influencerController = require('./influencerController.js');

// Route handlers for each of the controllers

influencerRouter.route('/').get((req, res) => res.send('Influencers Page!'));

influencerRouter.route('api/influencer').get((req, res) => {
  var temp = influencerController.retrieve(req, res);
  res.send(temp);
});

influencerRouter.route('api/influencer').post((req, res) => influencerController.createOne(req, res));

influencerRouter.route('api/influencer/:username').get((req, res) => influencerController.retrieveOne(req, res));

influencerRouter.route('api/influencer/:username').put((req, res) => influencerController.updateOne(req, res));

influencerRouter.route('api/influencer/:username').delete((req, res) => influencerController.deleteOne(req, res));

influencerRouter.route('api/influencer').delete((req, res) => influencerController.delete(req, res));

module.exports = influencerRouter;
