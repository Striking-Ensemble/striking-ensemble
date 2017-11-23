import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {
  handleRedirect() {
    browserHistory.push('/login');
  }

  render() {
    return (
      <div className="navigation">
        <h1>NAVIGATION SAMPLE</h1>
        <Link to="/">Home</Link>
        <br />
        <Link to="/logout" onClick={this.handleRedirect.bind(this)}>Logout</Link>
      </div>
    )
  }
}
