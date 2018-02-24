import React, { Component } from 'react';
import RetailForm from './retailForm.react';

export default class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      retailLinks: [] // must accept array of obj with id, url, affiliateLink as keys
    }

    this.removeRetailLink = this.removeRetailLink.bind(this);
    this.editRetailLink = this.editRetailLink.bind(this);
    this.addInputBox = this.addInputBox.bind(this);
  }

  componentDidMount() {
    this.props.currentPost.retailLinks === null ? (
      this.setState({ retailLinks: [{ id: `link_${Date.now()}`, url: '', affiliateLink: '' }] }))
      :
      this.setState({ retailLinks: this.props.currentPost.retailLinks })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.props.removeCurrentPost();
    }
  }

  // Quick setting up of url links
  // not necessarily saved in the DB yet
  editRetailLink(links) {
    this.setState({ retailLinks: links }, () => console.log('Retail so far...', this.state.retailLinks));
  }

  removeRetailLink(index) {
    console.log('REMOVING @ index', index);
    let retailArr = this.state.retailLinks.slice();
    retailArr.splice(index, 1);
    this.setState({ retailLinks: retailArr }, () => console.log('Current Retail State:', this.state.retailLinks))
  }

  addInputBox() {
    this.setState({ retailLinks: [...this.state.retailLinks, {id: `link_${Date.now()}`, url: '', affiliateLink: '' }] }, () => console.log('ADDING NEW BOX', this.state.retailLinks));
  }

  render() {
    console.log('HERE WE ARE NOW FOR PROPS*************', this.props);
    if (this.props.currentPost.video_low) {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs-12">
            <iframe src={this.props.currentPost.video_low.url} className="embed-responsive-item" style={{ height: '536px' }} seamless>
            </iframe>
            <p>{this.props.currentPost.caption.text}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-12">
            <RetailForm
              user={this.props.user}
              instaId={this.props.currentPost.instaId}
              retailLinks={this.state.retailLinks}
              editRetailLink={this.editRetailLink}
              removeRetailLink={this.removeRetailLink}
              addInputBox={this.addInputBox}
              {...this.props}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs-12">
            <img src={this.props.currentPost.image_norm.url} className="img-responsive" />
            <p>{this.props.currentPost.caption.text}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-12">
            <RetailForm
              user={this.props.user}
              instaId={this.props.currentPost.instaId}
              retailLinks={this.state.retailLinks}
              editRetailLink={this.editRetailLink}
              removeRetailLink={this.removeRetailLink}
              addInputBox={this.addInputBox}
              {...this.props}
            />
          </div>
        </div>
      )
    }
  }
};
