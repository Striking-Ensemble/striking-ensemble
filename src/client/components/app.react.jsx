import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import store from 'store';
import Navigation from './navigation.react';
import Account from '../scenes/Home/account.react';
import Footer from './footer.react';
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
      user: {}
    }
  }

  componentWillMount() {
    axios.get(ROOT_URL + '/account')
      .then(
      (res) => {
        if (res.data.username) {
          console.log('TRIGGGEEERRRED in mounting');
          this.setState({
            isLoaded: true,
            user: res.data
          });
          const { history } = this.props;
          store.set('user', { username: res.data.username })
          store.set('isAuthenticated', res.data.isAuthenticated);
          history.push('/');
        }
      });
  }

  render() {
    console.log('PROPS IN APP', this.props);
    console.log('what\'s current state', this.state.isLoaded);
    if (!isAuthenticated()) {
      console.log('NOT LOGGED IN... REDIRECTING');
      return <Redirect to='/login' />
    } else {
      console.log('SHOULD BE LOGGED', isAuthenticated());
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

