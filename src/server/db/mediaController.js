const Influencer = require('./Influencer');
const Media = require('./media');
const bodyParser = require('body-parser');
// media methods to db

exports.saveMedia = (req, res) => {
  console.log('SAVE A BUNCH OF MEDIA FOR NEW INFLUENCER', req.user);
  let postsArr = [];
  let mediaArray = req.body.data.map(obj => {
    postsArr.push(obj.id);
    if (obj.type == 'video') {
      return {
        _id: obj.id,
        _creator: req.user.id,
        username: obj.user.username, 
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
        username: obj.user.username,
        caption: obj.caption,
        created_time: obj.created_time,
        images: obj.images,
        link: obj.link,
        tags: obj.tags,
        post_type: obj.type
      }
    }
  });
  let promise = Media.insertMany(mediaArray);
  promise
    .then(response => {
      console.log('insertMany RESULT:', response)
      let user = { _id: req.user._id }
      Influencer
        .update(user, {media: postsArr}, (err, response) => {
          if (err) {
            console.log('ERROR DURING SAVE MEDIA IN Controller:', err)
          }
          console.log('IN MEDIA SAVE:', response);
        })
      })
      .catch(err => console.log('ERROR IN SAVING MEDIA!', err));
};

exports.updateMedia = async (req, res) => {
  console.log('UPDATING from MEDIA Controller', req.user);

  await req.body.data.forEach(obj => {
    let query = { _id: obj.id, _creator: req.user._id };
    let post = {
      _creator: req.user._id,
      username: obj.user.username,
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
      .update(query, { $set: post }, { upsert: true, new: true })
      .then(response => {
        let user = { _id: req.user._id }
        Influencer
          .findOneAndUpdate(user, (err, response) => {
            if (err) {
              console.log('ERROR IN MEDIA UPDATE CONTROLLER:', err);
            }
            response.media.addToSet(obj.id);
            response
              .save()
              .then(influencer => {
                console.log('UPDATED INFLUENCER:', influencer.media)
              })
              .catch(err => console.log(err))
          })
        console.log('updated!', response);
      })
      .catch(err => console.log('ERROR IN UPDATING POST!', err));
  });
  
  res.json('User media updated!');
};

exports.updateRetailLinks = async (req, res) => {
  console.log('in UPDATE RETAIL LINK #96');
  // find individual post through req.params given
  let query = { _id: req.params.id };
  await Media.update(query, { $set: { retailLinks: req.body } }, { new: true }, (err, response) => {
    if (err) {
      console.log('ERR in updateRetailLinks', err)
    }
    console.log('UPDATED LINKS!', response);
  })
  res.json('LIST SAVED!');
};

exports.getInfluencerMedia = (req, res) => {
  let query = { username: req.params.username }

  Media.find(query, (err, response) => {
    if (err) {
      console.log('IN getInfluencerMedia #116', err);
    }
    res.send(response);
  })
}
