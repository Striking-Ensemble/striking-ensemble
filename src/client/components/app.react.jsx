import React, { Component } from 'react';
// import Signin from '../scenes/Sign/signin.react';
import Navigation from './navigation.react';
import Account from '../scenes/Home/account.react';
import Footer from './footer.react';
import axios from 'axios';

const protocol = window.location.protocol;
const host = window.location.host;
const pathname = window.location.pathname;

const ROOT_URL = `${protocol}//${host}`;

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      user: [],
    }
  }

  componentDidMount() {
    console.log('IN APP MOUNT', ROOT_URL);
    axios.get(ROOT_URL + '/account')
      .then(
        (res) => {
          this.setState({
            isLoaded: true,
            user: res
          });
        },
        (err) => {
          this.setState({
            isLoaded: true,
            error: err
          });
        }
      );
  }

  render() {
    const { error, isLoaded, user } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="container">
          <Navigation />
          <Account user={user} />
          <Footer />
        </div>
      )
    }
  }
}
