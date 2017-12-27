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
    if (this.props.currentPost.retailLinks) {
      return (
        <ul>
          {this.props.currentPost.retailLinks.map((item, index) => {
            return (
              <div key={`boxAt${item.id}`} className="row">
                <li key={item.id} className="col-md-8 col-sm-8 col-xs-8"><p className="ellipses">{item.url}</p></li>
                <button key={`buttonKeyAt${item.id}`} className="col-md-4 col-sm-4 col-xs-2 btn btn-default btn-xs" onClick={this.handleAddButton.bind(this, item.url)}>
                  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                </button>
              </div>
            )
          })}
        </ul>
      )
    }
  }

  render() {
    console.log('PROPS ME:', this.props);
    if (this.props.currentPost.video_low) {
      return (
        <div className="container-fluid">
          <div className="row">
            <button className="btn btn-default" onClick={this.props.removeCurrentPost}>Back</button>
          </div>
          <br />
          <div className="row">
            <div id="post-item" className="col-lg-8 col-md-8 col-sm-8 col-xs=12">
              <iframe src={this.props.currentPost.video_low.url} className="embed-responsive-item" style={{ height: '536px' }} seamless>
              </iframe>
              <p>{this.props.currentPost.caption}</p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              {this.renderRetailList()}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container-fluid">
          <div className="row">
            <button className="btn btn-default" onClick={this.props.removeCurrentPost}>Back</button>
          </div>
          <br />
          <div className="row">
            <div id="post-item" className="col-lg-8 col-md-8 col-sm-8 col-xs=12">
              <img src={this.props.currentPost.image_norm.url} className="img-responsive" />
              <p>{this.props.currentPost.caption}</p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              {this.renderRetailList()}
            </div>
          </div>
        </div>
      )
    }

  }
};
