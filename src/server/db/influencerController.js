const Influencer = require('./Influencer.js');
const bodyParser = require('body-parser');

// Controller methods for DB

exports.createOne = (req, res) => {
  console.log('CHECKING POST ADDING INFLUENCER');
  console.log('what is in req body?', req.body);
  let mediaData = JSON.parse(req.body.data);
  let newInfluencer = new Influencer({
    id: req.body.id,
    username: req.body.username,
    full_name: req.body.full_name,
    bio: req.body.bio,
    website: req.body.website,
    is_business: req.body.is_business,
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
  console.log('CHECKING GET INFLUENCER');
  Influencer.find((err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
};

exports.retrieveOne = (req, res) => {
  console.log('CHECKING GET ONE INFLUENCER:', req.params.username);
  let query = { username: req.params.username };
  Influencer.find(query, (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
};

exports.updateOne = (req, res) => {
  console.log('CHECKING PUT, UPDATE ONE INFLUENCER:', req.params.username);
  let query = { username: req.params.username };
  Influencer.update(query, {$set: req.body}, {upsert: true}, (err, data) => {
    if (err) {
      throw err;
    }
    console.log('Update result in controller:', data);
    console.log('Influencer is updated:', query.username);
    res.send(query.username + ' is updated!');
  });
};

exports.delete = (req, res) => {
  console.log('CHECKING DELETE INFLUENCER COLLECTION');
  Influencer.remove({}, (err, data) => {
    if (err) {
      throw err;
    }
    res.send('DELETED Collection!');
  });
};

exports.deleteOne = (req, res) => {
  console.log('CHECKING DELETE ONE INFLUENCER:', req.params.username);
  let query = { username: req.params.username };
  Influencer.remove(query, (err, data) => {
    if (err) {
      throw err;
    }
    res.send('Deleted ' + query.username + '!');
  })
};
