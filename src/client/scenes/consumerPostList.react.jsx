import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ConsumerPostList extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    console.log('what event?', this.props);
    this.props.addCurrentPost(this.props);
    this.props.history.push(`/${this.props.username}/post/${this.props.instaId}`);
  }

  render() {
    return (
      <div className="col-lg-3 col-md-4 col-sm-4 col-xs-4 post-list">
        <Link to={{
          pathname: `/${this.props.username}/post/${this.props.instaId}`,
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
