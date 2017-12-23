import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import store from 'store';
import Navigation from './navigation.react';
import Account from '../scenes/Home/account.react';
import Footer from './footer.react';
import LoadingSpinner from './loadingSpinner.react';
import isAuthenticated from '../services/isAuthenticated';
import checkCredentials from '../services/checkCredentials';

export default class Influencer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      currentPost: {}
    }

    this.removeUser = this.removeUser.bind(this);
    this.addCurrentPost = this.addCurrentPost.bind(this);
    this.removeCurrentPost = this.removeCurrentPost.bind(this);
    this.currentUserIsEmpty = this.currentUserIsEmpty.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  componentWillMount() {
    console.log('REVAMP!!', this.props);
    this.checkAuthentication(this.props);
    this.setState({ isLoaded: true });
  }

  componentWillReceiveProps(nextProps) {
    console.log('WILL RECEIVE:', nextProps);
    console.log('im supposed to compare: this.props,', this.props.location);
    // if (nextProps.location !== this.props.location) {
    //  this.checkAuthentication(nextProps);
    // }
  }

  checkAuthentication(params) {
    const { history } = params;
    return checkCredentials(params);
      // .catch(e => history.replace({ pathname: '/login' }));
  }

  componentWillUnmount() {

  }
  // for logout nav use
  removeUser() {
    // this.setState({ user: {}, loggedIn: false }, () => console.log('back in app, loggedIn:', this.state.loggedIn));
    store.clearAll();
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
  // for navigation use
  removeCurrentPost() {
    console.log('REMOVING CURRENT POST FROM ROOT');
    this.setState({currentPost: {}}, () => console.log('UPDATE ON CURRENTPOST', this.state.currentPost))
    this.props.history.push('/');
  }

  render() {
    // console.log('what\'s current user state', store.get('user').data);
    if (!isAuthenticated()) {
      console.log('NO USER Authenticated... REDIRECTING TO /login');
      return (
        <Redirect to={{
          pathname: '/login',
          state: { from: this.props.location } 
        }}/>
      )
    } else {
      return (
        <div id="page-outer">
          <Navigation 
            user={store.get('user').data} 
            removeUser={this.removeUser} 
            removeCurrentPost={this.removeCurrentPost}
            {...this.props} 
          />
          <div className="page-container">
            { !this.state.isLoaded ? 
              (<LoadingSpinner />) 
              : 
              (<Account 
                user={store.get('user').data}
                currentPost={this.state.currentPost} 
                addCurrentPost={this.addCurrentPost} 
                removeCurrentPost={this.removeCurrentPost} 
                {...this.props} 
              />) 
            }
          </div>
          <Footer />
        </div>
      )
    }
  }
};
