import React, { Component } from 'react';
import store from 'store';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

export default class Navigation extends Component {
  handleRedirect(e) {
    console.log('redirect props', this.props);
    axios.get(store.get('URL').root_url + '/logout')
      .then(
        res => {
          this.props.removeUser();
        }
      )
      .catch( err => {
        console.log(err);
      });
  }

  handleHome(e) {
    // should change currentPost state to empty
    e.preventDefault();
    console.log('LET ME SEE fn', this.props);
  }

  render() {
    return (
      <div className="navigation">
        <h1>NAVIGATION SAMPLE</h1>
        <Link to="/" onClick={this.handleHome.bind(this)}>Home</Link>
        <br />
        <Link to="/login" onClick={this.handleRedirect.bind(this)}>Logout</Link>
      </div>
    )
  }
}
