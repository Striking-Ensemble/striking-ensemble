import axios from 'axios';
import store from 'store';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleHome = this.handleHome.bind(this);
  }

  handleLogout(e) {
    console.log('redirect props', this.props);
    axios.post(store.get('URL').root_url + '/logout', { username: this.props.user.username })
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
      <nav className="navbar navbar-inverse navbar-fixed-top">
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
              <li role="button" className={this.props.location.pathname == '/' || this.props.location.pathname.includes('account') ? "active" : ""}>
                <Link to='/' onClick={this.handleHome} data-toggle="collapse" data-target=".navbar-collapse.in">Home <span className="sr-only">(current)</span></Link>
              </li>
              <li role="button" className={this.props.location.pathname.includes('/billing') ? "active" : ""}>
                <Link to="/billing" data-toggle="collapse" data-target=".navbar-collapse.in">Billing Info</Link>
              </li>
              <li role="button" className={this.props.location.pathname.includes('/stats') ? "active" : ""}>
                <Link to="/settings" data-toggle="collapse" data-target=".navbar-collapse.in">Settings</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <button className="btn btn-danger log" onClick={this.handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
