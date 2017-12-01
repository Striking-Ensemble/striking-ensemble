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
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPost: {}
    }
  }
  componentWillMount() {
    axios.get(ROOT_URL + '/account/media')
      .then(
      res => {
        const newArr = res.data.data.map(post => post);
        this.setState({ data: [...this.state.data, ...newArr] })
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderPosts() {
    return this.state.data.map(post => {
      return (
        <PostListItem
          key={post.id}
          id={post.id}
          caption={post.caption.text}
          image_low={post.images.low_resolution}
          image_norm={post.images.standard_resolution}
          image_thumb={post.images.thumbnail}
          {...this.props}
        />
      )
    })
  }

  render() {
    console.log('do i have props?', this.props);
    console.log('IN ACCOUNT:', this.state.data);
    let user = this.props.user;
    return (
      <div className="main">
        <h1>{user.full_name} is logged in.</h1>
        <img src={user.profile_picture} className="img-circle" /><p>{user.username}</p>
        <br />
        <div className="post-container">
          {this.renderPosts.bind(this)()}
        </div>
      </div>
    )
  }
}
