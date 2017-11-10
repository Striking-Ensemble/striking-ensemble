const Influencer = require('./Influencer.js');
const bodyParser = require('body-parser');
const app = require('../server.js');

// Controller methods

exports.createOne = (req, res) => {
  Influencer.save((err, data) => {
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
  Influencer.find(req.body.data.username, (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
};

exports.updateOne = (req, res) => {
  Influencer.update(req.body.data.username, (err, data) => {
    if (err) {
      throw err;
    }
    res.send('Influencer is updated:', data);
  });
};

exports.delete = (req, res) => {
  Influencer.remove((err, data) => {
    if (err) {
      throw err;
    }
    res.send('DELETED!:', data);
  });
};

exports.deleteOne = (req, res) => {
  Influencer.remove(req.body.data.number, (err, data) => {
    if (err) {
      throw err;
    }
    res.send('Deleted!:', data);
  })
};
