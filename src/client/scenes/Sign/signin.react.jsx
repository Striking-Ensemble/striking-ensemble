import React, { Component } from 'react';

export default class Signin extends Component {
  render() {
    return (
      <div className="container">
        <h1>Welcome!</h1>
        <a href="/auth/instagram" className="btn btn-block btn-social btn-instagram" width="224">
          <span className="fa fa-instagram"></span> Sign in with Instagram
        </a>
      </div>
    )
  }
}
