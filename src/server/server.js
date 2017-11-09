const express = require('express');
// extracts the entire body portion of incoming req to be used as req.body
const bodyParser = require('body-parser');
const path = require('path');
// missing db import on purpose to check for consistency
const Influencer = require('./db/Influencer.js');
const influencerRouter = require('./db/influencerRouter.js');

// Create the Express application
const app = express();

 // modify express to take url that contain any format/type of file
app.use(bodyParser.urlencoded({ extended: false }));
// parses the text as JSON and set to req.body
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/public/')));

app.get('/', (req, res) => {
  Influencer.find((err, influencer) => {
    if (err) {
      throw err;
    }
    console.log('Influencer list!');
    res.send(influencer);
  });
});

module.exports = app;
