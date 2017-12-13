const Influencer = require('./Influencer');
const Media = require('./media');
const bodyParser = require('body-parser');
// media methods to db

exports.saveMedia = (req, res) => {
  console.log('SAVE A BUNCH OF MEDIA TO INFLUENCER');
  let mediaData = req.body.data.map(obj => {
    if (obj.type == 'video') {
      return {
        instaId: obj.id,
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
        instaId: obj.id,
        caption: obj.caption,
        created_time: obj.created_time,
        images: obj.images,
        link: obj.link,
        tags: obj.tags,
        post_type: obj.type
      }
    }
  });
  console.log('I NEED TO CHECK', mediaData);
  let newMedia = new Media({
    _creator: req.user.id,
    data: mediaData
  });

  newMedia.save((err, data) => {
    // console.log('ON SAVEMEDIA', data);
    if (err) {
      throw err;
    }
    res.send('MEDIA SAVED');
  });
};

exports.updateMedia = (req, res) => {
  console.log('UPDATING MEDIA CONTENTS');
  let query = { _id: req.user.id };
  Influencer.find(query, (err, data) => {
    if (err) {
      throw err;
    }
    // should populate the influencer media with its media
    Media.populate(data, {path: 'media'}, (err, influencer) => {
      influencer.forEach(user => console.log('inside each looping for update', user));
    })
    // update by existence of _id
    // do i even need to populate? or just handle everything with _creator media matches
  })
}

