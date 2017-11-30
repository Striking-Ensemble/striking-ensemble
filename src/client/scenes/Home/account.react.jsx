import React, { Component } from 'react';
import isAuthenticated from '../../services/isAuthenticated'
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const protocol = window.location.protocol;
const host = window.location.host;
const pathname = window.location.pathname;

const ROOT_URL = `${protocol}//${host}`;

export default class Account extends Component {
  componentDidMount() {
    axios.get(ROOT_URL + '/account/media')
      .then(
      res => {
        console.log('ACCOUNT MEDIA', res)
      }
      )
      .catch(err => {
        console.log(err);
      });
  }
  
  render() {
    console.log('IN ACCOUNT:', this.props.user);
    let data = this.props.user;
    return (
      <div className="main">
        <h1>{data.full_name} is logged in.</h1>
        <img src={data.profile_picture} /><p>{data.username}</p>
      </div>
    )
  }
}
