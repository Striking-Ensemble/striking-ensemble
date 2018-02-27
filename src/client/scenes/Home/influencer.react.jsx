import axios from 'axios';
import store from 'store';
import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import Navigation from '../../components/navigation.react';
import Account from '../Home/account.react';
import Billing from '../Billing/billing.react';
import Reports from '../Reports/reports.react';
import Footer from '../../components/footer.react';
import ProfileSettings from '../Profile-Settings/profileSettings.react';
import LoadingSpinner from '../../components/loadingSpinner.react';
import isAuthenticated from '../../services/isAuthenticated';
import FourOhFour from '../../components/fourOhFour.react';

export default class Influencer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      currentPost: {},
      postLog: {}
    }

    this.addCurrentPost = this.addCurrentPost.bind(this);
    this.removeCurrentPost = this.removeCurrentPost.bind(this);
    this.currentUserIsEmpty = this.currentUserIsEmpty.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.renderPathname = this.renderPathname.bind(this);
  }

  componentWillMount() {
    this.checkAuthentication(this.props);
  }

  componentDidMount() {
    const { location, match } = this.props;
    const rootUrl = store.get('URL').root_url;
    !isAuthenticated() ? 
      <Redirect to={{
        pathname: '/login',
        state: { from: location }
      }}/> 
      : this.setState({ isLoaded: true });
    
    if (match.path == '/account/p/:id') {
      return axios.get(`${rootUrl}/account/post/${match.params.id}`)
        .then(
          res => {
            if (res.data[0] && typeof res.data !== 'string') {
              this.addCurrentPost(res.data[0]);
            }
          })
        .catch(err => {
          console.log('err in fetching post', err);
          this.setState({ error: true })
        })
    }
  }

  componentWillReceiveProps(nextProps) {
    // location changed
    if (nextProps.location !== this.props.location) {
      if (nextProps.location.pathname === '/logout') {
        axios.post(store.get('URL').root_url + '/logout')
        .then(
          res => {
            store.remove('user');
            store.remove('isAuthenticated');
            this.props.history.push('/login');
          }
        )
        .catch(err => {
          console.log(err);
        });
      }
      // check user is authenticated
      // this.checkAuthentication(nextProps);
      if (!isAuthenticated()) {
        <Redirect to={{
          pathname: '/login',
          state: { from: this.props.location }
        }} />
        // next pathname relates to postLog id?
      } else if (nextProps.location.pathname === `/account/p/${this.state.postLog.instaId}`) {
        // set it as the new currentPost
        this.setState({ currentPost: this.state.postLog });
      }
    }
  }

  checkAuthentication(params) {
    const { history } = params;
    const rootUrl = store.get('URL').root_url;

    axios.get(`${rootUrl}/account/`)
      .then(
      res => {
        if (res.data.username) {
          // console.log('LOG IN SUCCESS, Retrieving user info...');
          store.set('user', { data: res.data });
          store.set('isAuthenticated', true);
          this.setState({ isLoaded: true }); // is this still necessary? check setState on DidMount
        } else {
          store.remove('user');
          store.remove('isAuthenticated');
          console.log('PLEASE LOG IN 1st');
          history.replace({ pathname: '/login' });
        }
      })
      .catch(err => {
        console.log('ERROR IN CHECK checkAuth', err);
        store.remove('user');
        store.remove('isAuthenticated');
        store.each((value, key) => {
          console.log('WHATs IN STORE:', key, '==', value);
        });
        history.replace({ pathname: '/login' });
      });
  }

  currentUserIsEmpty() {
    let user = store.get('user') ? store.get('user').data : {};
    return Object.keys(user).length === 0 && user.constructor === Object;
  }

  addCurrentPost(post) {
    console.log('WE ARE ADDING CURRENT POST FROM ROOT', post);
    let currentPost = {...this.state.currentPost};
    let image_low = post.image_low || (post.images ? post.images.low_resolution : null),
        image_norm = post.image_norm || (post.images ? post.images.standard_resolution : null),
        video_low = post.video_low || (post.videos ? post.videos.low_bandwidth : null),
        video_norm = post.video_norm || (post.videos ? post.videos.standard_resolution : null);
    Object.assign(currentPost, {
      instaId: post.instaId || post._id,
      caption: post.caption,
      image_thumb: post.image_thumb || post.images.thumbnail,
      image_low: image_low ? image_low : null,
      image_norm: image_norm ? image_norm : null,
      video_low: video_low ? video_low : null,
      video_norm: video_norm ? video_norm : null,
      retailLinks: post.retailLinks ? post.retailLinks : null
    });

    this.setState({currentPost}, () => console.log('updated state value', this.state.currentPost));
  }

  // for browser & navigation use
  // what if user says OK on modal confirm?
  removeCurrentPost(changesDetected) {
    console.log('REMOVING CURRENT POST FROM ROOT');
    // if (!changesDetected) {
      this.setState({ postLog: this.state.currentPost, currentPost: {} }, () => console.log('UPDATE ON CURRENTPOST & POSTLOG:', this.state));
    // }
  }

  renderPathname(location) {
    let { pathname } = location;
    if (pathname.includes('/billing')) {
      return <Billing />
    } else if (pathname.includes('/settings')) {
      return <ProfileSettings />
    } else if (pathname.includes('/reports')) {
      return <Reports />
    } else {
      return (<Account
        user={store.get('user').data}
        currentPost={this.state.currentPost}
        addCurrentPost={this.addCurrentPost}
        removeCurrentPost={this.removeCurrentPost}
        {...this.props}
        />)
    }
  }

  render() {
    // console.log('STACK #:', window.history.length);
    // console.log('Router Count:', this.props);
    if (this.state.error) {
      return (<FourOhFour />)
    }
    if (!this.state.isLoaded) {
      return <LoadingSpinner />
    } else {
      return (
        <div id="wrap">
          <Navigation 
            user={store.get('user').data}
            removeCurrentPost={this.removeCurrentPost}
            currentPost={this.state.currentPost}
            {...this.props} 
          />
          <br />
          <div className="container-fluid">
            <div id="main" className="container">
              {this.renderPathname(this.props.location)}
            </div>
          </div>
          <Footer />
        </div>
      )
    }
  }
};
