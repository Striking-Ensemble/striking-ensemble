import React, { Component } from 'react';
// import Signin from '../scenes/Sign/signin.react';
import Navigation from './navigation.react';
import Account from '../scenes/Home/account.react';
import Footer from './footer.react';

export default class App extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <Navigation />
        <Account />
        <Footer />
      </div>
    )
  }
}
