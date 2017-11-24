import React, { Component } from 'react';

export default class Account extends Component {
  render() {
    console.log('IN ACCOUNT:', this.props.user.data);
    let data = this.props.user.data;
    return (
      <div className="container">
        <h1>{data.full_name} is logged in.</h1>
        <img src={data.profile_picture} /><span>{data.username}</span>
      </div>
    )
  }
}
