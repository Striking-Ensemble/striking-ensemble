import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import PostItem from './postItem.react';

export default class PostListItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    // preventDefault is not used here where it would undermine
    // how Link component works, so onClick must be set on Link
    // rather than the element tag itself like <img />
    this.props.addCurrentPost(this.props);
  }

  render () {
    return (
      <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6">
        <Link to={`/account/post/${this.props.instaId}`} onClick={this.handleClick}>
          <img src={this.props.image_thumb.url} className="img-responsive" alt="instagram post" />
        </Link>
      </div>
    )
  }
};
