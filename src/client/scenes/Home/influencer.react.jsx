import axios from 'axios';
import store from 'store';
import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import Navigation from '../../components/navigation.react';
import Account from '../Home/account.react';
import Billing from '../Billing/billing.react'
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

    this.removeUser = this.removeUser.bind(this);
    this.addCurrentPost = this.addCurrentPost.bind(this);
    this.removeCurrentPost = this.removeCurrentPost.bind(this);
    this.currentUserIsEmpty = this.currentUserIsEmpty.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.renderPathname = this.renderPathname.bind(this);
  }

  componentWillMount() {
    console.log('Initial Props!!', this.props);
    this.checkAuthentication(this.props);
  }

  componentDidMount() {
    !isAuthenticated() ? 
      <Redirect to={{
        pathname: '/login',
        state: { from: this.props.location }
      }}/> 
      : this.setState({ isLoaded: true });
  }

  componentWillReceiveProps(nextProps) {
    // location changed
    if (nextProps.location !== this.props.location) {
      // check user is authenticated
      // this.checkAuthentication(nextProps);
      if (!isAuthenticated()) {
        <Redirect to={{
          pathname: '/login',
          state: { from: this.props.location }
        }} />
        // next pathname relates to postLog id?
      } else if (nextProps.location.pathname === `/account/post/${this.state.postLog.instaId}`) {
        // set it as the new currentPost
        this.setState({ currentPost: this.state.postLog });
      }
    }
  }

  checkAuthentication(params) {
    const { history } = params;
    axios.get(store.get('URL').root_url + '/account')
      .then(
      res => {
        if (res.data.username) {
          console.log('LOG IN SUCCESS, Retrieving user info...');
          store.set('user', { data: res.data });
          store.set('isAuthenticated', true);
          this.setState({ isLoaded: true }); // is this still necessary? check setState on DidMount
          console.log('ARE WE CLEAR in checkAuth?', store.get('user'));
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

  // for logout nav use
  removeUser() {
    store.remove('user');
    store.remove('isAuthenticated');
    this.props.history.push('/login');
  }

  currentUserIsEmpty() {
    let user = store.get('user') ? store.get('user').data : {};
    return Object.keys(user).length === 0 && user.constructor === Object;
  }

  addCurrentPost(post) {
    console.log('WE ARE ADDING CURRENT POST FROM ROOT', post);
    let currentPost = {...this.state.currentPost};
    currentPost.instaId = post.instaId;
    currentPost.caption = post.caption;
    currentPost.image_thumb = post.image_thumb;
    currentPost.image_low = post.image_low ? post.image_low : null;
    currentPost.image_norm = post.image_norm ? post.image_norm : null;
    currentPost.video_low = post.video_low ? post.video_low : null;
    currentPost.video_norm = post.video_norm ? post.video_norm : null;
    currentPost.retailLinks = post.retailLinks ? post.retailLinks : null;

    this.setState({currentPost}, () => console.log('updated state value', this.state.currentPost));
  }

  // for browser & navigation use
  removeCurrentPost() {
    console.log('REMOVING CURRENT POST FROM ROOT');
    this.setState({ postLog: this.state.currentPost, currentPost: {} }, () => console.log('UPDATE ON CURRENTPOST & POSTLOG:', this.state));
  }

  renderPathname(location) {
    console.log('OOOOOOHHHHHH TASTY....', location);
    let { pathname } = location;
    if (pathname.includes('/billing')) {
      return <Billing />
    } else if (pathname.includes('/settings')) {
      return <ProfileSettings />
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
    console.log('STACK #:', window.history.length);
    console.log('Router Count:', this.props);
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
            removeUser={this.removeUser} 
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
