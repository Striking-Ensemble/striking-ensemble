import React, { Component } from 'react';

export default class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: []
    }
  }

  // for retail links associated with the post
  // renderPostItem () {
  //   return this.state.links
  // }
  
  render() {
    console.log('HERE WE ARE NOW *************', this.props);
    // location.state is being set in postListItem component on Link
    if (this.props.location.state.video_low) {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs=8">
            <iframe src={this.props.location.state.video_low.url} className="embed-responsive-item" style={{height: '536px'}} seamless>
            </iframe>
            <p>{this.props.location.state.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4">
            <p>bunch of retail links/img</p>
            <p>bunch of retail links/img</p>
            <p>bunch of retail links/img</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs=8">
            <img src={this.props.location.state.image_norm} className="img-responsive" />
            <p>{this.props.location.state.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4">
            <p>bunch of retail links/img</p>
            <p>bunch of retail links/img</p>
            <p>bunch of retail links/img</p>
          </div>
        </div>
      )
    }
  }
};
