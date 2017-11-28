import React, { Component } from 'react';
import store from 'store';
// import Signin from '../scenes/Sign/signin.react';
import Navigation from './navigation.react';
import Account from '../scenes/Home/account.react';
import Footer from './footer.react';
import isAuthenticated from '../services/isAuthenticated';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

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
      user: []
    }
  }

  componentWillMount() {
    axios.get(ROOT_URL + '/account')
      .then(
      (res) => {
        if (res.data.username) {
          this.setState({
            isLoaded: true,
            user: res.data
          });
          const { history } = this.props;
          store.set('user', { username: res.data.username })
          store.set('isAuthenticated', res.data.isAuthenticated);
          history.push('/account');
        }
      });
  }

  render() {
    console.log('PROPS IN APP', this.props);
    if (!isAuthenticated()) {
      return <Redirect to='/login' />
    } else {
      return (
        <div className="container">
          <Navigation />
          <Account user={this.state.user} />
          <Footer />
        </div>
      )
    }
  }
}

