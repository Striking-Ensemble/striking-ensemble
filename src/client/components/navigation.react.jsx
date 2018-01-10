import React, { Component } from 'react';
import store from 'store';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleHome = this.handleHome.bind(this);
  }

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
    this.props.removeCurrentPost();
  }

  render() {
    return (
      <nav className="navbar navbar-fixed-top navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-header-content" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to='/' onClick={this.handleHome}>Striking Ensemble</Link>
          </div>
          <div className="collapse navbar-collapse" id="navbar-header-content">
            <ul className="nav navbar-nav">
              <li role="button" className="active">
                <Link to='/' onClick={this.handleHome} data-toggle="collapse" data-target=".navbar-collapse.in">Home <span className="sr-only">(current)</span></Link>
              </li>
              <li role="button">
                <Link to="/billing" data-toggle="collapse" data-target=".navbar-collapse.in">Billing Info</Link>
              </li>
              <li role="button">
                <Link to="/" data-toggle="collapse" data-target=".navbar-collapse.in">Stats</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <button className="btn btn-danger log" onClick={this.handleRedirect}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
