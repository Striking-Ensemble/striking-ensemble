const Influencer = require('./Influencer');
const Media = require('./media');
const bodyParser = require('body-parser');
// media methods to db

exports.saveMedia = (req, res) => {
  console.log('SAVE A BUNCH OF MEDIA FOR NEW INFLUENCER', req.user);
  let mediaArray = req.body.data.map(obj => {
    if (obj.type == 'video') {
      return {
        _id: obj.id,
        _creator: req.user.id, 
        caption: obj.caption,
        created_time: obj.created_time,
        images: obj.images,
        link: obj.link,
        tags: obj.tags,
        post_type: obj.type,
        videos: obj.videos
      }
    } else {
      return {
        _id: obj.id,
        _creator: req.user.id,
        caption: obj.caption,
        created_time: obj.created_time,
        images: obj.images,
        link: obj.link,
        tags: obj.tags,
        post_type: obj.type
      }
    }
  });
  
  let promise = Media.create(mediaArray);
  promise
    .then(response => {
      let user = { _id: req.user._id }
      Influencer
        .findById(user)
        .populate({ path: 'media', model: 'Media' })
        .exec((err, user) => {
          if (err) {
            throw err;
          }
          console.log('POPULATED Influencer:', user);
        })
      })
      .catch(err => console.log('ERROR IN SAVING MEDIA!', err));
};

exports.updateMedia = (req, res) => {
  console.log('UPDATING from MEDIA Controller', req.user);
  req.body.data.forEach(obj => {
    let query = { _id: obj.id, _creator: req.user._id };
    let post = {
      _id: obj.id,
      caption: obj.caption,
      created_time: obj.created_time,
      images: obj.images,
      link: obj.link,
      tags: obj.tags,
      post_type: obj.type
    };

    if (obj.type == 'video') {
      post.videos = obj.videos;
    }  
    Media
      .update(query, post, { upsert: true, overwrite: true })
      .then(response => {
        let user = { _id: req.user._id }
        Influencer
          .findById(user)
          .populate({ path: 'media', model: 'Media' })
          .exec((err, user) => {
            if (err) {
              throw err;
            }
            console.log('POPULATED Influencer:', user);
          });
        console.log('updated!', response);
      })
      .catch(err => console.log('ERROR IN UPDATING POST!', err));
  });
};
