import React, { Component } from 'react';
import Footer from '../../components/footer.react.jsx';

export default class Signin extends Component {
  render() {
    return (
      <div className="container">
        <div className="signin">
        <h1>Welcome!</h1>
        <a href="/auth/instagram" className="btn btn-block btn-social btn-instagram" width="224">
          <span className="fa fa-instagram"></span> Sign in with Instagram
        </a>
        </div>
        <Footer />
      </div>
    )
  }
}
