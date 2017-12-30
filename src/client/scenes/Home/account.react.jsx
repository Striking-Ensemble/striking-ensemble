import axios from 'axios';
import store from 'store';
import { Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import isAuthenticated from '../../services/isAuthenticated'
import PostListItem from './postListItem.react';
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
        if (res.data) {
          const newArr = res.data.map(post => post);
          // update state, then send recent media to DB
          this.setState({
            isLoaded: true, 
            data: [...this.state.data, ...newArr] 
          });
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
              key={post._id || post.id}
              instaId={post._id || post.id}
              caption={post.caption.text}
              image_thumb={post.images.thumbnail}
              video_low={post.videos.low_bandwidth}
              video_norm={post.videos.standard_resolution}
              retailLinks={post.retailLinks}
              addCurrentPost={this.props.addCurrentPost}
              {...this.props}
            />
          )
        } else {
          return (
            <PostListItem
              key={post._id || post.id}
              instaId={post._id || post.id}
              caption={post.caption.text}
              image_low={post.images.low_resolution}
              image_norm={post.images.standard_resolution}
              image_thumb={post.images.thumbnail}
              retailLinks={post.retailLinks}
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
      <div className="row">
        <div>
          <div className="row">
            <div className="col-lg-1 col-md-2 col-sm-2 col-xs-4">
              <img src={user.profile_picture} className="img-responsive img-circle" />
            </div>
            <div className="col-lg-1 col-md-2 col-sm-2 col-xs-4">
              <h4>{user.username}</h4>
            </div>
          </div>
        </div>
        <br />
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="row">
              {this.currentPostIsEmpty() ? this.renderPosts.bind(this)() : this.renderPostItem.bind(this)()}
          </div>
        </div>
      </div>
    )
  }
}
