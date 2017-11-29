import React, { Component } from 'react';
import isAuthenticated from '../../services/isAuthenticated'
import { Redirect } from 'react-router-dom';

export default class Account extends Component {
  render() {
    console.log('IN ACCOUNT:', this.props.user);
    let data = this.props.user;
    return (
      <div className="container">
        <h1>{data.full_name} is logged in.</h1>
        <img src={data.profile_picture} /><p>{data.username}</p>
      </div>
    )
  }
}
