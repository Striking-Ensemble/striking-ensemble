import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {
  render() {
    return (
      <div className="navigation">
        <h1>NAVIGATION SAMPLE</h1>
        <Link to="/">Home</Link>
        <br />
        <Link to="/logout">Logout</Link>
      </div>
    )
  }
}
