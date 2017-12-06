const router = require('express').Router();
const influencerController = require('./influencerController');
const bodyParser = require('body-parser');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time in Influencer Router: ', Date.now());
  next();
});

// Route handlers for each of the controllers
router.get('/influencers', influencerController.retrieve);

router.post('/influencer', influencerController.createOne);

router.get('/influencer/:username', influencerController.retrieveOne);

router.put('/influencer/:username', influencerController.updateOne);

router.delete('/influencer/:username', influencerController.deleteOne);

router.delete('/influencers', influencerController.delete);

module.exports = router;
