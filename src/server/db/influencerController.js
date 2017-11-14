const Influencer = require('./Influencer.js');
const bodyParser = require('body-parser');

// Controller methods for DB

exports.createOne = (req, res) => {
  console.log('what is in req body?', req.body);
  let mediaData = JSON.parse(req.body.data);
  let newInfluencer = new Influencer({
    id: req.body.id,
    username: req.body.username,
    full_name: req.body.full_name,
    bio: req.body.bio,
    website: req.body.website,
    data: mediaData.map((obj) => obj)
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
  let query = { username: req.params.username };
  Influencer.find(query, (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
};

exports.updateOne = (req, res) => {
  let query = { username: req.params.username };
  Influencer.find(query, (err, data) => {
    if (err) {
      throw err;
    }
    Influencer.update(query, { data: req.body.data }, {upsert: true});
    console.log('Influencer is updated:', query.username);
    res.send(data);
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
  let query = { username: req.params.username };
  Influencer.remove(query, (err, data) => {
    if (err) {
      throw err;
    }
    res.send('Deleted Influencer!');
  })
};
