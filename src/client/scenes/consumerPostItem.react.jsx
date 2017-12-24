import React, { Component } from 'react';
import LoadingSpinner from '../components/loadingSpinner.react';

export default class consumerPostItem extends Component {
  constructor(props) {
    super(props);

    this.renderRetailList = this.renderRetailList.bind(this);
  }

  handleAddButton(item) {
    this.props.addToLocalCart(item);
  }

  renderRetailList() {
    return (
      <ul>
        {this.props.currentPost.retailLinks.map((item, index) => {
          return (
            <div key={`boxAt${item.id}`}>
              <li key={item.id}>{item.url}</li><button key={`buttonKeyAt${item.id}`} onClick={this.handleAddButton.bind(this, item.url)}>Add to cart</button>
            </div>
          )
        })}
      </ul>
    )
  }

  render() {
    console.log('PROPS ME:', this.props);
    if (this.props.currentPost.video_low) {
      return (
        <div className="container">
          <div className="row">
            <button className="btn btn-default" onClick={this.props.removeCurrentPost}>Back</button>
          </div>
          <br />
          <div id="post-item" className="col-md-8 col-sm-8 col-xs=8">
            <iframe src={this.props.currentPost.video_low.url} className="embed-responsive-item" style={{ height: '536px' }} seamless>
            </iframe>
            <p>{this.props.currentPost.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4">
            {this.renderRetailList()}
          </div>
        </div>
      )
    } else {
      return (
        <div className="container">
          <div className="row">
            <button className="btn btn-default" onClick={this.props.removeCurrentPost}>Back</button>
          </div>
          <br />
          <div id="post-item" className="col-md-8 col-sm-8 col-xs=8">
            <img src={this.props.currentPost.image_norm.url} className="img-responsive" />
            <p>{this.props.currentPost.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4">
            {this.renderRetailList()}
          </div>
        </div>
      )
    }

  }
};
