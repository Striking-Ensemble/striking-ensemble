import React, { Component } from 'react';

export default class Account extends Component {
  render() {
    return (
      <div className="container">
        <h1>You are logged in.</h1>
        <p>Stuff rendering here depends on the current nav</p>
      </div>
    )
  }
}
