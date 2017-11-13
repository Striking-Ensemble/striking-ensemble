const router = require('express').Router();
const influencerController = require('./influencerController.js');
const bodyParser = require('body-parser');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time in Influencer Router: ', Date.now());
  next();
});

// Route handlers for each of the controllers

router.get('/influencers', (req, res) => {
  console.log('CHECKING GET INFLUENCER');
  influencerController.retrieve(req, res);
});

router.post('/influencer', (req, res) => {
  console.log('CHECKING POST ADDING INFLUENCER');
  influencerController.createOne(req, res)
});

router.get('/influencer/:username', (req, res) => { 
  console.log('CHECKING GET ONE INFLUENCER:', req.params.username);
  influencerController.retrieveOne(req, res)
});

router.put('/influencer/:username', (req, res) => { 
  console.log('CHECKING PUT, UPDATE ONE INFLUENCER:', req.params.username);
  influencerController.updateOne(req, res)
});

router.delete('/influencer/:username', (req, res) => { 
  console.log('CHECKING DELETE ONE INFLUENCER:', req.params.username);
  influencerController.deleteOne(req, res)
});

router.delete('/influencer', (req, res) => { 
  console.log('CHECKING DELETE INFLUENCER COLLECTION');
  influencerController.delete(req, res)
});

module.exports = router;
