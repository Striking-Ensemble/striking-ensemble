import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import store from 'store';
import Navigation from './navigation.react';
import Account from '../scenes/Home/account.react';
import Footer from './footer.react';
import LoadingSpinner from './loadingSpinner.react';
import isAuthenticated from '../services/isAuthenticated';

export default class App extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      user: {},
      login: false,
      currentPost: {}
    }

    this.removeUser = this.removeUser.bind(this);
    this.addCurrentPost = this.addCurrentPost.bind(this);
    this.removeCurrentPost = this.removeCurrentPost.bind(this);
  }

  componentDidMount() {
    axios.get(store.get('URL').root_url + '/account')
      .then(
      res => {
        // If res URL is a redirect to /login, set login to true
        // this will render Signin scene
        if (res.request.responseURL === store.get('URL').root_url + '/login') {
          this.setState({ login: true });
        }
        if (res.data.username) {
          this.setState({
            isLoaded: true,
            user: res.data,
            login: false
          });
          const { history } = this.props;
          // store.set('user', { username: res.data.username });
          history.push('/');
        }
      })
      .catch(err => {
        console.log(err);
        store.each((value, key) => {
          console.log('WHATs IN STORE:', key, '==', value);
        })
      });
  }

  removeUser() {
    this.setState({ user: {}, login: true }, () => console.log('back in app', this.state.login));
    this.props.history.push('/login');
  }

  addCurrentPost(post) {
    console.log('WE ARE ADDING CURRENT POST FROM ROOT');
    let currentPost = {...this.state.currentPost};
    currentPost.id = post.id;
    currentPost.caption = post.caption;
    currentPost.image_thumb = post.image_thumb;
    currentPost.image_low = post.image_low ? post.image_low : null;
    currentPost.image_norm = post.image_norm ? post.image_norm : null;
    currentPost.video_low = post.video_low ? post.video_low : null;
    currentPost.video_norm = post.video_norm ? post.video_norm : null;

    this.setState({currentPost}, () => console.log('updated state value', this.state.currentPost));
  }

  removeCurrentPost() {
    console.log('REMOVING CURRENT POST FROM ROOT');
    this.setState({currentPost: {}}, () => console.log('UPDATE ON CURRENTPOST', this.state.currentPost))
  }

  render() {
    console.log('what\'s current user state', this.state.user);
    if (this.state.login) {
      console.log('NO USER DETECTED... REDIRECTING TO /login');
      return (<Redirect to='/login' />)
    } else {
      return (
        <div id="page-outer">
          <Navigation 
            user={this.state.user} 
            removeUser={this.removeUser} 
            removeCurrentPost={this.removeCurrentPost}
            {...this.props} 
          />
          <div className="page-container">
            { !this.state.isLoaded ? 
              (<LoadingSpinner />) 
              : 
              (<Account 
                user={this.state.user}
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
}
