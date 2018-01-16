import React, { Component } from 'react';
import LoadingSpinner from '../../components/loadingSpinner.react';

export default class ConsumerPostItem extends Component {
  constructor(props) {
    super(props);

    this.renderRetailList = this.renderRetailList.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // change in url will not trigger re-render for this component lifecycle
    // then, we set the postLog at parent to the currentPost here
    // through removeCurrentPost fn
    if (this.props.location !== nextProps.location) {
      let tempPost = this.props.currentPost;
      tempPost.pathname = this.props.location.pathname;
      this.props.removeCurrentPost(tempPost);
      return false;
    }
  }

  handleAddButton(product, affiliate) {
    this.props.addToLocalCart(product, affiliate);
  }

  handleBackButton() {
    this.props.removeCurrentPost(this.props.currentPost);
    this.props.history.goBack();
  }

  renderRetailList() {
    if (this.props.currentPost.retailLinks) {
      return (
        <ul>
          {this.props.currentPost.retailLinks.map((item, index) => {
            return (
              <div key={`boxAt${item.id}`} className="row">
                <li key={item.id} className="col-md-11 col-sm-10 col-xs-10"><p className="ellipses">{item.url}</p></li>
                <button key={`buttonKeyAt${item.id}`} className="col-md-1 col-sm-1 col-xs-1 btn btn-default btn-xs" onClick={this.handleAddButton.bind(this, item.url, item.affiliateLink)}>
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
            <button className="col-lg-offset-2 col-md-offset-1 btn btn-default" onClick={this.handleBackButton}>Back</button>
          </div>
          <br />
          <div className="row">
            <div id="post-item" className="col-lg-4 col-lg-offset-2 col-md-6 col-md-offset-1 col-sm-8 col-xs=12">
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
            <button className="col-lg-offset-2 col-md-offset-1 btn btn-default" onClick={this.handleBackButton}>Back</button>
          </div>
          <br />
          <div className="row">
            <div id="post-item" className="col-lg-4 col-lg-offset-2 col-md-6 col-md-offset-1 col-sm-8 col-xs=12">
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
