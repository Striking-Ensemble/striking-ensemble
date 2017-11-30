import React from 'react';

const PostListItem = (props) => {
  console.log('GIVE ME THESE', props);

  return (
    <div className="col-md-4 col-sm-4 col-xs-4">
      <img src={props.image_thumb.url} style={{width: '150px', height: '150px'}} />
      <p>{props.caption}</p>
    </div>
  )
}

export default PostListItem;