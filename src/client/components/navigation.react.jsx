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
    this.props.removeCurrentPost();
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">Striking Ensemble</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link to="/" onClick={this.handleHome.bind(this)}>Home</Link>
          </li>
          <li>
            <Link to="/">Billing Info</Link>
          </li>
          <li>
            <Link to="/">Stats</Link>
          </li>
        </ul>
        <ul className="nav navbar-nav pull-right">
          <li>
            <button className="btn btn-danger log" onClick={this.handleRedirect.bind(this)}>Logout</button>
          </li>
        </ul>
      </nav>
    )
  }
}
