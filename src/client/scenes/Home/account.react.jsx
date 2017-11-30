import React, { Component } from 'react';
import isAuthenticated from '../../services/isAuthenticated'
import { Redirect } from 'react-router-dom';
import PostListItem from './postListItem.react';
import axios from 'axios';

const protocol = window.location.protocol;
const host = window.location.host;
const pathname = window.location.pathname;

const ROOT_URL = `${protocol}//${host}`;

export default class Account extends Component {
  componentWillMount() {
    axios.get(ROOT_URL + '/account/media')
      .then(
      res => {
        this.props.user.data = res.data.data.map((post, index) => {
          return post;
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderPosts() {
    console.log('DO I HAVE DATA NOW?', this.props.user.data);
    return this.props.user.data.map(post => {
      return (
        <PostListItem
          key={post.id}
          caption={post.caption.text}
          image_low={post.images.low_resolution}
          image_norm={post.images.standard_resolution}
          image_thumb={post.images.thumbnail}
        />
      )
    })
  }

  render() {
    console.log('IN ACCOUNT:', this.props.user);
    let user = this.props.user;

    return (
      <div className="main">
        <h1>{user.full_name} is logged in.</h1>
        <img src={user.profile_picture} /><p>{user.username}</p>
        <br />
        <div className="post-container">
          {this.renderPosts.bind(this)()}
        </div>
      </div>
    )
  }
}
