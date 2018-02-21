import React, { Component } from 'react';
import LoadingSpinner from '../../components/loadingSpinner.react';
import noImg from '../../../../public/assets/images/no-preview';
import noImgThumb from '../../../../public/assets/images/no-image-thumbnail';

export default class ConsumerPostItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProduct: {}
    };

    this.renderRetailList = this.renderRetailList.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleImageModal = this.handleImageModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // we set the postLog at parent to the currentPost here
    // through removeCurrentPost fn
    if (this.props.location !== nextProps.location) {
      let tempPost = this.props.currentPost;
      tempPost.pathname = this.props.location.pathname;
      this.props.removeCurrentPost(tempPost);
      return false;
    }
    // we could use more utility here.
    return false;
  }

  handleAddButton(product, affiliate) {
    console.log('adding product...', product);
    console.log('adding affiliate...', affiliate);
    this.props.addToLocalCart(product, affiliate);
  }

  handleBackButton() {
    this.props.removeCurrentPost(this.props.currentPost);
    this.props.history.goBack();
  }

  handleImageModal(product) {
    this.setState({ currentProduct: product })
  }

  renderRetailList() {
    const imgStyle = {
      width: '100px',
      height: 'auto'
    };

    if (this.props.currentPost.retailLinks) {
      return (
        <ul>
          {this.props.currentPost.retailLinks.map((item, index) => {
            return (
              <div key={`boxAt${item.id}`} className="row list">
                <li key={item.id} className="col-lg-3 col-md-4 col-sm-6 col-xs-4">
                  <img style={imgStyle} src={item.image ? item.image : noImgThumb} onClick={this.handleImageModal.bind(this, item)} alt={item.title} data-toggle="modal" data-target=".product-image-modal-sm" />
                </li>
                <button key={`buttonKeyAt${item.id}`} className="col-md-1 col-sm-1 col-xs-1 btn btn-default btn-xs" onClick={this.handleAddButton.bind(this, item.url, item.affiliateCode)}>
                  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                </button>
              </div>
            )
          })}
        </ul>
      )
    }
  }

  renderProductImage() {
    let { currentProduct } = this.state;
    return (
      <div className="modal-content">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 className="text-center">{currentProduct.title}</h4>
        <h5 className="text-center"><strong>{currentProduct.price ? currentProduct.price : '*Check cart for item price'}</strong></h5>
        <img src={currentProduct.image ? currentProduct.image : noImg} className="img-responsive" alt="image modal" />
      </div>
    )
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
            <div className="modal fade product-image-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
              <div className="modal-dialog modal-sm" role="document">
                {this.renderProductImage()}
              </div>
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
            <div className="modal fade product-image-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
              <div className="modal-dialog modal-sm" role="document">
                {this.renderProductImage()}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
};
