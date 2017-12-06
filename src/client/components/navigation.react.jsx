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
          this.props.history.push('/login');
        }
      )
      .catch( err => {
        console.log(err);
      });
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
        <Link to="/login" onClick={this.handleRedirect.bind(this)}>Logout</Link>
      </div>
    )
  }
}
