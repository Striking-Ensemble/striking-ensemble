import React from 'react';
import PostItem from './postItem.react';
import { Link } from 'react-router-dom';

const PostListItem = (props) => {
  console.log('GIVE ME THESE', props);

  function handleClick(e) {
    e.preventDefault();
    console.log('CLICKED!');
    return <PostItem 
      key={props.id}
      caption={props.caption}
      image_norm={props.image_norm}
    />
  }

  return (
    <div className="col-lg-3 col-md-4 col-sm-4 col-xs-4">
      <Link to={{
        pathname: `/account/post/${props.id}`,
        state: {
          key: props.id,
          caption: props.caption,
          image_norm: props.image_norm.url
        }
      }}>
        <img src={props.image_thumb.url} className="img-responsive" />
      </Link>
    </div>
  )
}

export default PostListItem;