import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import store from 'store';
import Navigation from './navigation.react';
import Account from '../scenes/Home/account.react';
import Footer from './footer.react';
import LoadingSpinner from './loadingSpinner.react';
import isAuthenticated from '../services/isAuthenticated';

const protocol = window.location.protocol;
const host = window.location.host;
const pathname = window.location.pathname;

const ROOT_URL = `${protocol}//${host}`;

export default class App extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      user: {},
      login: false
    }
  }

  componentWillMount() {
    // check if state on user is empty
    // if (Object.keys(this.state.user).length === 0 && this.state.user.constructor === Object) {
    //   store.remove('isAuthenticated');
    //   store.remove('user');
    // }

    axios.get(ROOT_URL + '/account')
      .then(
      res => {
        if (res.request.responseURL === ROOT_URL + '/login') {
          this.setState({ login: true });
        }
        if (res.data.username) {
          this.setState({
            isLoaded: true,
            user: res.data,
            login: false
          });
          // const { history } = this.props;
          // store.set('user', { username: res.data.username });
          // history.push('/');
        }
      })
      .catch(err => {
        console.log(err);
        store.each((value, key) => {
          console.log('WHATs IN STORE:', key, '==', value);
        })
      });
  }

  render() {
    console.log('USER IN APP', this.state.user);
    console.log('what\'s current load state', this.state.isLoaded);
    if (this.state.login) {
      console.log('NO USER DETECTED... REDIRECTING TO /login');
      return <Redirect to='/login' />
    } 
    console.log('SHOULD BE LOGGED, PROPS?', this.props);
    if (!this.state.isLoaded) {
      return <LoadingSpinner />
    } else {
      return (
        <div id="page-outer">
          <Navigation />
          <div className="page-container">
            <Account user={this.state.user} {...this.props}/>
          </div>
          <Footer />
        </div>
      )
    }
  }
}
