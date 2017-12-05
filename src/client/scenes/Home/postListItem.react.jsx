import React, { Component } from 'react';
import PostItem from './postItem.react';
import { Link } from 'react-router-dom';

export default class PostListItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    console.log('CLICKED!');
    console.log('what event?', this.props);
    this.props.changeCurrentPost(this.props);
  }

  render () {
    // console.log('GIVE ME THESE', this.props);
    // console.log('WHATTABOUT changeCurrentPost', this.props.changeCurrentPost);

    return (
      <div className="col-lg-3 col-md-4 col-sm-4 col-xs-4">
        <Link to={{
          pathname: `/account/post/${this.props.id}`,
          state: {
            key: this.props.id,
            caption: this.props.caption,
            image_norm: this.props.image_norm ? this.props.image_norm.url : null,
            video_low: null || this.props.video_low,
            video_norm: null || this.props.video_norm
          }
        }}>
          <img src={this.props.image_thumb.url} className="img-responsive" onClick={this.handleClick} />
        </Link>
      </div>
    )
  }
};