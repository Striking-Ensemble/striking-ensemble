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
  }

  componentDidMount() {
    axios.get(store.get('URL').root_url + `/user${this.props.location.pathname}`)
      .then(
        res => {
          // console.log('I NEED TO FIND res.data for user', res.data);
          if (res.data) {
            if(!res.data[0]) {
              this.setState({error: true});
            }
            const newObj = res.data[0];
            // update user state
            this.setState({
              userIsLoaded: true,
              user: newObj
            });
            // this.props.history.push(`/${this.state.user.username}`);
          }
        }
      )
      .catch(err => {
        console.log(err);
      });

    axios.get(store.get('URL').root_url + `/${this.props.match.params.username}/media-products`)
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
        console.log(err);
      });
    // events for TwoTap cart API
    window.addEventListener('message', this.tTHandleEvents);
  }

  componentWillReceiveProps(nextProps) {
    // this serves as the basis for browser forward
    // which will assign currentPost again based on postLog's pathname
    // and next pathname match
    if (nextProps.location.pathname === this.state.postLog.pathname) {
      this.setState({ currentPost: this.state.postLog });
    }
    console.log('NEW STUFF:', nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.tTHandleEvents);
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
        const GA = ReactGA.ga();
        for (let storeId in data.cart_contents) {
          let storeList = data.cart_contents[storeId]
          for (let itemId in storeList) {
            let productFields = storeList[itemId];
            let dollarLess = productFields.price.slice(1);
            revenueSoFar += parseFloat(dollarLess) * parseFloat(productFields.fields_input.quantity);
            // ReactGA.plugin.execute('ec', 'addProduct', {
            //   id: itemId,
            //   name: productFields.title,
            //   brand: productFields.brand,
            //   price: dollarLess,
            //   quantity: productFields.fields_input.quantity,
            //   coupon: productFields.affiliate_link
            // });
            GA('ec:addProduct', {
              id: itemId,
              name: productFields.title,
              brand: productFields.brand,
              price: dollarLess,
              quantity: productFields.fields_input.quantity,
              coupon: productFields.affiliate_link
            });

          }
        }
        // ReactGA.plugin.execute('ec', 'setAction', 'purchase', {
        //   id: data.purchase_id,
        //   affiliation: 'TwoTap Cart API',
        //   revenue: revenueSoFar
        // });
        GA('ec:setAction', 'purchase', {
          id: data.purchase_id,
          affiliation: 'TwoTap Cart API',
          revenue: revenueSoFar
        });
        // ReactGA.send('transaction');
        GA('send', 'transaction');
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
    currentPost.instaId = post.instaId;
    currentPost.caption = post.caption;
    currentPost.image_thumb = post.image_thumb;
    currentPost.image_low = post.image_low ? post.image_low : null;
    currentPost.image_norm = post.image_norm ? post.image_norm : null;
    currentPost.video_low = post.video_low ? post.video_low : null;
    currentPost.video_norm = post.video_norm ? post.video_norm : null;
    currentPost.retailLinks = post.retailLinks ? post.retailLinks : null;

    this.setState({ currentPost });
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
    // checkoutRequest['custom_css_url'] = `${store.get('URL').root_url}/public/assets/css/integration_twotap.css`
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

    // load ga ecommerce plugin & located here to ensure firing only
    // when user clicks the cart button
    ReactGA.plugin.require('ec');
  }

  renderPurchase() {
    let customStyles = { 
      width: '100%',
      minHeight: '600px', 
      maxHeight: '700px'
    };
    if (this.state.checkout_request_id) {
      return (
        <div id="purchaseModal" className="modal-content" ref={el => this.el = el}>
          <iframe id="purchase-frame" src={`https://checkout.twotap.com/?checkout_request_id=${this.state.checkout_request_id}`} style={customStyles} frameBorder="0" ></iframe>
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
          <button type="button" className="col-lg-1 col-lg-offset-9 col-md-2 col-md-offset-9 col-sm-2 col-sm-offset-9 col-xs-2 col-xs-offset-9 btn btn-primary btn-xs" onClick={this.buyProducts} data-toggle="modal" data-target=".bs-example-modal-sm">
            <span className={`${this.state.localCart.length == 0 ? 'hidden' : 'badge'}`}>{this.state.localCart.length} </span> <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> <span className="hidden-xs">Check Cart </span>
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
