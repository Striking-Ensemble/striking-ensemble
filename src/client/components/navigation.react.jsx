import React, { Component } from 'react';
import store from 'store';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Navigation extends Component {
  handleRedirect() {
    axios.get(store.get('URL').root_url + '/logout')
      .then(
        res => {
          browserHistory.push('/login');
        }
      )
      .catch( err => {
        console.log(err);
      });
    console.log('IN NAV', browserHistory);
  }

  handleHome() {
    // should change currentPost state to empty
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
