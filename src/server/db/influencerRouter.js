const influencerRouter = require('express').Router();
const influencerController = require('./influencerController.js');

// middleware that is specific to this router
influencerRouter.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// Route handlers for each of the controllers

influencerRouter.get('/', (req, res) => res.send('Influencers Page!'));

influencerRouter.get('/api/influencer', (req, res) => {
  console.log('CHECKING GET INFLUENCER');
  influencerController.retrieve(req, res);
});

influencerRouter.post('/api/influencer', (req, res) => {
  console.log('CHECKING POST ADDING INFLUENCER');
  influencerController.createOne(req, res)
});

influencerRouter.get('/api/influencer/:username', (req, res) => { 
  console.log('CHECKING GET ONE INFLUENCER');
  influencerController.retrieveOne(req, res)
});

influencerRouter.put('/api/influencer/:username', (req, res) => { 
  console.log('CHECKING PUT, UPDATE ONE INFLUENCER');
  influencerController.updateOne(req, res)
});

influencerRouter.delete('/api/influencer/:username', (req, res) => { 
  console.log('CHECKING DELETE ONE INFLUENCER');
  influencerController.deleteOne(req, res)
});

influencerRouter.delete('/api/influencer', (req, res) => { 
  console.log('CHECKING DELETE INFLUENCER COLLECTION');
  influencerController.delete(req, res)
});

module.exports = influencerRouter;
