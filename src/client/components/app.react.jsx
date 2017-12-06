import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import store from 'store';
import Navigation from './navigation.react';
import Account from '../scenes/Home/account.react';
import Footer from './footer.react';
import LoadingSpinner from './loadingSpinner.react';
import isAuthenticated from '../services/isAuthenticated';

const protocol = window.location.protocol,
      host = window.location.host,
      pathname = window.location.pathname;

store.set('URL', { 
  protocol: protocol,
  host: host,
  pathname: pathname,
  root_url: `${protocol}//${host}`
});

export default class App extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      user: {},
      login: false
    }
    this.removeUser = this.removeUser.bind(this);
  }

  componentWillMount() {
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
  }

  render() {
    console.log('what\'s current user state', this.state.user);
    if (this.state.login) {
      console.log('NO USER DETECTED... REDIRECTING TO /login');
      return <Redirect to='/login' />
    } 
    // console.log('SHOULD BE LOGGED, PROPS?', this.props); this.props here are routing properties
    if (!this.state.isLoaded) {
      return <LoadingSpinner />
    } else {
      return (
        <div id="page-outer">
          <Navigation user={this.state.user} removeUser={this.removeUser} {...this.props} />
          <div className="page-container">
            <Account user={this.state.user} {...this.props} />
          </div>
          <Footer />
        </div>
      )
    }
  }
}
