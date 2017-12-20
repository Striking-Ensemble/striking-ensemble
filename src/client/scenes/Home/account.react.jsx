import React, { Component } from 'react';
import isAuthenticated from '../../services/isAuthenticated'
import { Redirect } from 'react-router-dom';
import PostListItem from './postListItem.react';
import axios from 'axios';
import store from 'store';
import LoadingSpinner from '../../components/loadingSpinner.react';
import PostItem from './postItem.react';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: [],
    }
  }

  componentDidMount() {
    axios.get(store.get('URL').root_url + '/account/media')
      .then(
      res => {
        console.log('I NEED TO FIND res.data', res.data);
        if (res.data.data) {
          const newArr = res.data.data.map(post => post);
          // update state, then send recent media to DB
          this.setState({
            isLoaded: true, 
            data: [...this.state.data, ...newArr] 
          });

          axios.post(store.get('URL').root_url + '/account/submit_media', { data: newArr })
            .then(res => console.log('SUBMITTED ALL MEDIA', res))
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  currentPostIsEmpty() {
    return Object.keys(this.props.currentPost).length === 0 && this.props.currentPost.constructor === Object;
  }

  renderPosts() {
    if (!this.state.isLoaded) {
      return <LoadingSpinner />
    } else {
      return this.state.data.map(post => {
        if (post.videos) {
          return (
            <PostListItem 
              key={post.id}
              instaId={post.id}
              caption={post.caption.text}
              image_thumb={post.images.thumbnail}
              video_low={post.videos.low_bandwidth}
              video_norm={post.videos.standard_resolution}
              addCurrentPost={this.props.addCurrentPost}
              {...this.props}
            />
          )
        } else {
          return (
            <PostListItem
              key={post.id}
              instaId={post.id}
              caption={post.caption.text}
              image_low={post.images.low_resolution}
              image_norm={post.images.standard_resolution}
              image_thumb={post.images.thumbnail}
              addCurrentPost={this.props.addCurrentPost}
              {...this.props}
            />
          )
        }
      });
    }
  }

  renderPostItem() {
    console.log('seek this.props.currentPost:', this.props.currentPost);
    return (
      <PostItem
        {...this.props}
      />
    )
  }

  render() {
    console.log('do i have props?', this.props);
    console.log('IN ACCOUNT:', this.state.data);
    let user = this.props.user;
    return (
      <div className="main">
        <h1>{user.full_name} is logged in.</h1>
        <img src={user.profile_picture} className="img-circle" style={{'maxWidth': '15%'}} /><p>{user.username}</p>
        <br />
        <div className="post-container">
          {this.currentPostIsEmpty() ? this.renderPosts.bind(this)() : this.renderPostItem.bind(this)()}
        </div>
      </div>
    )
  }
}
