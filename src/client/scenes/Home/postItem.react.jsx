import React, { Component } from 'react';
import RetailForm from './retailForm.react';

export default class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      retailLinks: [] //[{ id: 1234, url: 'https://www.forever21.com/us/shop/Catalog/Product/21men/mens-new-arrivals/2000211808' }, { id: 12356, url: 'https://www.forever21.com/us/shop/Catalog/Product/21men/mens-new-arrivals/2000249599' }, { id: 1111, url: 'http://us.asos.com/pullbear/pullbear-sweater-with-shawl-neck-in-gray-marl/prd/9172440?clr=chinefon&SearchQuery=&cid=6993&gridcolumn=3&gridrow=5&gridsize=3&pge=1&pgesize=72&totalstyles=877' }, { id: 2222, url: 'fake sample' }] // must accept array of obj with id and url as properties
    }

    this.removeRetailLink = this.removeRetailLink.bind(this);
    this.editRetailLink = this.editRetailLink.bind(this);
    this.addInputBox = this.addInputBox.bind(this);
  }

  componentDidMount() {
    this.props.currentPost.retailLinks === null ? (
      this.setState({ retailLinks: [{ id: `link_${Date.now()}`, url: '' }] }))
      :
      this.setState({ retailLinks: this.props.currentPost.retailLinks })
  }

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
    this.setState({ retailLinks: [...this.state.retailLinks, {id: `link_${Date.now()}`, url: '' }] }, () => console.log('ADDING NEW BOX', this.state.retailLinks));
  }

  render() {
    console.log('HERE WE ARE NOW FOR PROPS*************', this.props);
    // location.state is being set in postListItem component on Link
    if (this.props.currentPost.video_low) {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs-12">
            <iframe src={this.props.currentPost.video_low.url} className="embed-responsive-item" style={{ height: '536px' }} seamless>
            </iframe>
            <p>{this.props.currentPost.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-12">
            <RetailForm
              instaId={this.props.currentPost.instaId}
              retailLinks={this.state.retailLinks}
              editRetailLink={this.editRetailLink}
              removeRetailLink={this.removeRetailLink}
              addInputBox={this.addInputBox}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs-12">
            <img src={this.props.currentPost.image_norm.url} className="img-responsive" />
            <p>{this.props.currentPost.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-12">
            <RetailForm
              instaId={this.props.currentPost.instaId}
              retailLinks={this.state.retailLinks}
              editRetailLink={this.editRetailLink}
              removeRetailLink={this.removeRetailLink}
              addInputBox={this.addInputBox}
            />
          </div>
        </div>
      )
    }
  }
};
