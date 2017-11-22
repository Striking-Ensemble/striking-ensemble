import React, { Component } from 'react';
// import Signin from '../scenes/Sign/signin.react.jsx';
import Navigation from './navigation.react.jsx';
import Account from '../scenes/Home/account.react.jsx';
import Footer from './footer.react.jsx';

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
