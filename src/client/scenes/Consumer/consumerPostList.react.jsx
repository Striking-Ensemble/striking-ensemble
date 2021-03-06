import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ConsumerPostList extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    // preventDefault is not used here where it would undermine
    // how Link component works, so onClick must be set on Link
    // rather than the element tag itself like <img />
    console.log('what event?', this.props);
    this.props.addCurrentPost(this.props);
  }

  render() {
    return (
      <div className="col-lg-3 col-md-4 col-sm-4 col-xs-4 post-list">
        <Link to={`/${this.props.username}/p/${this.props.instaId}`} onClick={this.handleClick}>
          <img src={this.props.image_thumb.url} className="img-responsive" />
        </Link>
      </div>
    )
  }
};
