import axios from 'axios';
import store from 'store';
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import FourOhFour from '../../components/fourOhFour.react';
import Footer from '../../components/footer.react';
import LoadingSpinner from '../../components/loadingSpinner.react';
import ConsumerPostList from './consumerPostList.react';
import ConsumerPostItem from './consumerPostItem.react';
import Modal from 'react-responsive-modal';

export default class Consumer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      showModal: false,
      userIsLoaded: false,
      mediaIsLoaded: false,
      user: {},
      data: [],
      currentPost: {},
      postLog: {},
      localCart: [],
      checkout_request_id: ''
    }

    this.renderUser = this.renderUser.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.renderPostItem = this.renderPostItem.bind(this);
    this.addCurrentPost = this.addCurrentPost.bind(this);
    this.removeCurrentPost = this.removeCurrentPost.bind(this);
    this.currentPostIsEmpty = this.currentPostIsEmpty.bind(this);
    this.addToLocalCart = this.addToLocalCart.bind(this);
    this.buyProducts = this.buyProducts.bind(this);
    this.renderPurchase = this.renderPurchase.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.tTHandleEvents = this.tTHandleEvents.bind(this);
    this.fetchMediaProducts = this.fetchMediaProducts.bind(this);
  }

  componentDidMount() {
    const rootUrl = store.get('URL').root_url;
    const { match } = this.props;
    // fetch influencer profile
    axios.get(`${rootUrl}/user/${match.params.username}`)
      .then(
        res => {
          if (res.data) {
            if(!res.data[0]) {
              this.setState({error: true});
            } else {
              const newObj = res.data[0];
              // update user state
              this.setState({
                userIsLoaded: true,
                user: newObj
              });
              // this.props.history.push(`/${this.state.user.username}`);
            }
          }
        }
      )
      .catch(err => {
        console.log(err);
      });
    if (match.path == '/:username/p/:id') {
      return axios.get(`${rootUrl}/u/${match.params.username}/post/${match.params.id}`)
        .then(res => {
          if (!res.data[0]) {
            this.setState({ error: true });
          } else {
            this.addCurrentPost(res.data[0]);
          }
        })
        .catch(err => {
          console.log('err in fetching post', err);
          this.setState({ error: true });
        })
    }
    if (match.path == '/:username') {
      this.fetchMediaProducts();
    }
    // events for TwoTap cart API
    window.addEventListener('message', this.tTHandleEvents);
  }

  componentWillReceiveProps(nextProps) {
    // this serves as the basis for browser forward
    // which will assign currentPost again based on postLog's pathname
    // and next pathname match
    const { location, match } = nextProps;
    const { username, instaId } = this.state.postLog;
    if (location.pathname === `/${username}/p/${instaId}`) {
      this.setState({ currentPost: this.state.postLog });
    }
    // fetch posts when on '/:username and no media data on state yet to avoid duplicates
    const toFetchData = match.path == '/:username' && this.state.data.length == 0;
    if (toFetchData) {
      this.fetchMediaProducts();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.tTHandleEvents);
  }

  fetchMediaProducts() {
    console.log('FETCHING THUH MEDIA PRODUCTS');
    const rootUrl = store.get('URL').root_url;
    axios.get(`${rootUrl}/${this.props.match.params.username}/media-products`)
      .then(
        res => {
          // console.log('I NEED TO FIND res.data for user MEDIA', res);
          if (res.data) {
            const newArr = res.data.map(post => post);
            // update media state
            this.setState({
              mediaIsLoaded: true,
              data: [...newArr]
            });
          }
        })
      .catch(err => {
        console.log('err in fetching post', err);
        this.setState({ error: true })
      });
  }

  tTHandleEvents(event) {
    let { data } = event;
    if (event.origin != 'https://checkout.twotap.com') return;
    if (data['action'] == 'cart_contents_changed') {
      console.log('things changed...', data);
      let productLinksToUpdate = [];
      // listening for product_removed event since its cart_contents prop 
      // returns updated list, the same as listening for cart_loaded
      if (data.cart_event == 'product_removed') {
        for (let key in data.cart_contents) {
          let siteId = data.cart_contents[key];
          for (let deepKey in siteId) {
            let productId = siteId[deepKey];
            productLinksToUpdate.push({url: productId.url, affiliate_link: productId.affiliate_link})
          }
        }
        this.setState({ localCart: productLinksToUpdate });
      }
      // order is completed, update Influencer's db to track purchases
      if (data.cart_event == 'cart_finalized') {
        let revenueSoFar = 0;
        productLinksToUpdate.push({ ...data.cart_contents, cart_id: data.cart_id, purchase_id: data.purchase_id })
        // axios.post('/update-influencer-purchase-tracker', productLinksToUpdate);
        console.log('stuff to update for influencer\'s db:', productLinksToUpdate);

        // iterate through the cart_contents field
        for (let storeId in data.cart_contents) {
          // set storeList to a store
          let storeList = data.cart_contents[storeId]
          // iterate the fields of a store
          for (let itemId in storeList) {
            // set productFields to a product from a store we are in
            let productFields = storeList[itemId];
            let dollarLess = productFields.price.slice(1);
            let adjustedPrice;
            // check ******** FIX THIS. this assumes that we are checking an array
            // but we are not!! we are checking an obj that has 1 field which has
            // a value of an array
            // this array is what we want to check for length
            let productContainerKey = Object.keys(productFields.required_field_values)[0];
            let productDetails = productFields.required_field_values[productContainerKey];
            let discount;
            // check if the arr has more than 1 product details
            if (productDetails.length > 1) {
              // fit arr : []
              let productDetailsKeyArr = Object.keys(productDetails);
              for (let i = 0; i < productDetailsKeyArr.length - 1; i++) {
                let currentProductInfo = productDetails[productDetailsKeyArr[i]];
                if (currentProductInfo.extra_info) {
                  discount = currentProductInfo.extra_info.match(/\d/g);
                  discount.length > 0 ?
                  adjustedPrice = dollarLess * ((100 - discount.join('')) / 100) : 
                  adjustedPrice = dollarLess
                } else {
                  adjustedPrice = dollarLess;
                }
              }
            } else {
              if (productDetails[0].extra_info) {
                discount = productDetails[0].extra_info.match(/\d/g);
                  discount.length > 0 ? 
                  adjustedPrice = dollarLess * ((100 - discount.join('')) / 100) : 
                  adjustedPrice = dollarLess
              } else {
                adjustedPrice = dollarLess;
              }
            }

            revenueSoFar += parseFloat(adjustedPrice) * parseFloat(productFields.fields_input.quantity);
            let gaQuery = {
              id: itemId,
              name: productFields.title,
              brand: productFields.brand,
              price: adjustedPrice,
              quantity: productFields.fields_input.quantity,
              coupon: productFields.affiliate_link
            };
            console.log('HELP ME OUT:', gaQuery)
            ReactGA.plugin.execute('ec', 'addProduct', gaQuery);
          }
        }
        ReactGA.plugin.execute('ec', 'setAction', 'purchase', {
          id: data.purchase_id,
          affiliation: 'TwoTap Cart API',
          revenue: revenueSoFar
        });

        ReactGA.pageview(this.props.location.pathname + '/checkout/success');

        console.log('revenue so far...', revenueSoFar);
        this.setState({ localCart: [] });
      }
    }
    // does not show cart contents
    if (data['action'] == 'cart_finalized') {
      console.log('things finalized...', data);
      
    }
    if (data['action'] == 'place_order_button_pressed') {
      console.log('things ordered...', data);
    }
    if (data['action'] == 'close_pressed') {
      $('.modal.in').modal('hide');
      this.setState({ showModal: false });
    }
  }

  addCurrentPost(post) {
    console.log('WE ARE ADDING CURRENT POST FROM ROOT', post);
    let currentPost = { ...this.state.currentPost };
    let image_low = post.image_low || (post.images ? post.images.low_resolution : null),
      image_norm = post.image_norm || (post.images ? post.images.standard_resolution : null),
      video_low = post.video_low || (post.videos ? post.videos.low_bandwidth : null),
      video_norm = post.video_norm || (post.videos ? post.videos.standard_resolution : null);
    Object.assign(currentPost, {
      instaId: post.instaId || post._id,
      username: post.username,
      caption: post.caption,
      image_thumb: post.image_thumb || post.images.thumbnail,
      image_low: image_low ? image_low : null,
      image_norm: image_norm ? image_norm : null,
      video_low: video_low ? video_low : null,
      video_norm: video_norm ? video_norm : null,
      retailLinks: post.retailLinks ? post.retailLinks : null
    });

    this.setState({ mediaIsLoaded: true, currentPost });
  }

  removeCurrentPost(post) {
    this.setState({ currentPost: {}, postLog:  post ? post : null });
  }
  
  currentPostIsEmpty() {
    return Object.keys(this.state.currentPost).length === 0 && this.state.currentPost.constructor === Object;
  }
  
  addToLocalCart(productLink, affiliateLink) {
    // might need to use store instead so that users can switch to different influencers
    // as well as reopening the web app to come back to the cart
    let itemsToAdd = [...this.state.localCart, { url: productLink, affiliate_link: affiliateLink }];
    this.setState({ localCart: itemsToAdd });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  buyProducts() {
    let checkoutRequest = {};
    checkoutRequest['products'] = this.state.localCart;
    checkoutRequest['public_token'] = '52434d36952f32a3bb43f67ea85c64';
    checkoutRequest['custom_css_url'] = `${store.get('URL').root_url}/assets/css/integration_twotap.css`;
    checkoutRequest['confirm'] = { 
      method: 'sms', 
      sms_confirm_url: `${store.get('URL').root_url}/purchase_confirm_callback`,
      sms_update_url: `${store.get('URL').root_url}/purchase_updated_callback`
    }
    checkoutRequest['unique_token'] = (Math.floor(Math.random() * 9999999) + 1).toString();
    checkoutRequest['test_mode'] = 'fake_confirm';
    checkoutRequest['close_button'] = { show: 'true' };

    axios.post('https://checkout.twotap.com/prepare_checkout', { checkout_request: checkoutRequest })
      .then(res => {
        this.setState({ checkout_request_id: res.data.checkout_request_id });
      })
      .catch(err => console.log('OOOPPPSS:', err));

    // load ga enhanced ecommerce plugin here to ensure firing only
    // when user clicks the cart button
    ReactGA.plugin.require('ec');
  }

  renderPurchase() {
    if (this.state.checkout_request_id) {
      return (
        <div id="purchaseModal" className="modal-content" ref={el => this.el = el}>
          <iframe id="purchase-iframe" src={`https://checkout.twotap.com/?checkout_request_id=${this.state.checkout_request_id}`} frameBorder="0" ></iframe>
        </div>
      )
    }
  }

  renderUser() {
    return (
      <div id="user-info">
        <img src={this.state.user.profile_picture} className="col-md-offset-5 col-xs-offset-5 img-circle" style={{ 'maxWidth': '15%' }} />
        <br />
      </div>
    )
  }

  renderPosts() {
    return this.state.data.map(post => {
      if (post.videos) {
        return (
          <ConsumerPostList
            key={post._id || post.id}
            username={post.username}
            instaId={post._id || post.id}
            caption={post.caption.text}
            image_thumb={post.images.thumbnail}
            video_low={post.videos.low_bandwidth}
            video_norm={post.videos.standard_resolution}
            retailLinks={post.retailLinks}
            addCurrentPost={this.addCurrentPost}
            {...this.props}
          />
        )
      } else {
        return (
          <ConsumerPostList
            key={post._id || post.id}
            username={post.username}
            instaId={post._id || post.id}
            caption={post.caption.text}
            image_low={post.images.low_resolution}
            image_norm={post.images.standard_resolution}
            image_thumb={post.images.thumbnail}
            retailLinks={post.retailLinks}
            addCurrentPost={this.addCurrentPost}
            {...this.props}
          />
        )
      }
    });
  }

  renderPostItem() {
    return (
      <ConsumerPostItem
        currentPost={this.state.currentPost}
        removeCurrentPost={this.removeCurrentPost}
        addToLocalCart={this.addToLocalCart}
        {...this.props}
      />
    );
  }

  render() {
    console.log(`localCart!! @${Date.now() / 1000 | 0}`, this.state.localCart);
    if (this.state.error) {
      return (<FourOhFour />);
    }
    return (
      <div id="page-outer" className="container-fluid">
        <br />
        <div className="row">
          <button type="button" className="col-lg-1 col-lg-offset-9 col-md-2 col-md-offset-9 col-sm-2 col-sm-offset-9 col-xs-2 col-xs-offset-9 btn btn-primary" onClick={this.buyProducts} data-toggle="modal" data-target=".bs-example-modal-sm">
            <span className={`${this.state.localCart.length == 0 ? 'hidden' : 'badge'}`}>{this.state.localCart.length} </span> <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> <span className="hidden-xs">Cart </span>
          </button>
          <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
            <div className="modal-dialog modal-sm" role="document">
              {this.renderPurchase()}
            </div>
          </div>
          <div className="clearfix visible-xs-block"></div>
          {!this.state.userIsLoaded ?
            (<LoadingSpinner />)
            :
            (this.renderUser())
          }
        </div>
        <hr />
        <div id="main" className="row">
          {!this.state.mediaIsLoaded ?
            (<LoadingSpinner />)
            :
            (this.currentPostIsEmpty() ? this.renderPosts() : this.renderPostItem())
          }
        </div>
        <div className="row">
          <Footer />
        </div>
      </div>
    )
  }
}
