const Influencer = require('./Influencer.js');
const bodyParser = require('body-parser');
const app = require('../server.js');

// Controller methods

exports.createOne = (req, res) => {
  console.log('what is body?', req.body);
  let newInfluencer = new Influencer({
    id: req.body.id,
    username: req.body.username,
    full_name: req.body.full_name,
    bio: req.body.bio,
    website: req.body.website,
    data: req.body.data
  });
  newInfluencer.save((err, data) => {
    console.log('ON CREATEONE, ADDING:', data);
    if (err) {
      throw err;
    }
    res.send('We created one!');
  });
};

exports.retrieve = (req, res) => {
  Influencer.find((err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
};

exports.retrieveOne = (req, res) => {
  Influencer.find({username: req.body.data.username}, (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
};

exports.updateOne = (req, res) => {
  Influencer.update({username: req.body.data.username}, (err, data) => {
    if (err) {
      throw err;
    }
    res.send('Influencer is updated:', data);
  });
};

exports.delete = (req, res) => {
  Influencer.remove({}, (err, data) => {
    if (err) {
      throw err;
    }
    res.send('DELETED Collection!');
  });
};

exports.deleteOne = (req, res) => {
  Influencer.remove(req.body.data.number, (err, data) => {
    if (err) {
      throw err;
    }
    res.send('Deleted Influencer!');
  })
};
