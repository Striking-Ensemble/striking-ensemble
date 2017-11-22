import React, { Component } from 'react';
import Signin from '../scenes/Sign/signin.react.jsx';
import Footer from './footer.react.jsx';

export default class App extends Component {
  render() {
    return (
      <div className="container">
        <Signin />
        <Footer />
      </div>
    )
  }
}
