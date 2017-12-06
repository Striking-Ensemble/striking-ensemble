import React, { Component } from 'react';
import Footer from '../../components/footer.react';

export default class Signin extends Component {
  render() {
    return (
      <div id="page-outer">
        <div className="container">
          <div className="signin">
          <h1>Welcome!</h1>
          <a href="/auth/instagram" className="btn btn-block btn-social btn-instagram">
            <span className="fa fa-instagram"></span> Sign in with Instagram
          </a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
