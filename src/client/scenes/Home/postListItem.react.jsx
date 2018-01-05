import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import PostItem from './postItem.react';

export default class PostListItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    console.log('CLICKED!');
    console.log('what event?', this.props);
    this.props.addCurrentPost(this.props);
  }

  render () {
    return (
      <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6">
        <Link to={{
          pathname: `/account/post/${this.props.instaId}`,
          state: {
            key: this.props.instaId,
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