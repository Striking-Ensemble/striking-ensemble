import React, { Component } from 'react';

export default class Navigation extends Component {
  render() {
    return (
      <div className="navigation">
        <h1>NAVIGATION SAMPLE</h1>
        <a href="/"> HOME </a>
        <br />
        <a href="/logout"> Logout </a>
      </div>
    )
  }
}
