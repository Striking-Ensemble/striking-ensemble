const router = require('express').Router();
const influencerController = require('./influencerController.js');
const bodyParser = require('body-parser');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// router.use((req, res, next) => {
//   console.log('URL Check: ', req.body.url)
// })

// Route handlers for each of the controllers

router.get('/', (req, res) => res.send('Influencers Page!'));

router.get('/influencers', (req, res) => {
  console.log('CHECKING GET INFLUENCER');
  influencerController.retrieve(req, res);
});

router.post('/influencer', (req, res) => {
  console.log('CHECKING POST ADDING INFLUENCER');
  influencerController.createOne(req, res)
});

router.post('/influencer/username', (req, res) => { 
  console.log('CHECKING POST ONE INFLUENCER');
  influencerController.retrieveOne(req, res)
});

router.put('/influencer/username', (req, res) => { 
  console.log('CHECKING PUT, UPDATE ONE INFLUENCER');
  influencerController.updateOne(req, res)
});

router.delete('/influencer/username', (req, res) => { 
  console.log('CHECKING DELETE ONE INFLUENCER');
  influencerController.deleteOne(req, res)
});

router.delete('/influencer', (req, res) => { 
  console.log('CHECKING DELETE INFLUENCER COLLECTION');
  influencerController.delete(req, res)
});

module.exports = router;
