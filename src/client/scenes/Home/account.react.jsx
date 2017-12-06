import React, { Component } from 'react';
import isAuthenticated from '../../services/isAuthenticated'
import { Redirect } from 'react-router-dom';
import PostListItem from './postListItem.react';
import axios from 'axios';
import store from 'store';
import LoadingSpinner from '../../components/loadingSpinner.react';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: [],
      currentPost: {},
      retailLinks:[]
    }
    this.changeCurrentPost = this.changeCurrentPost.bind(this);
    this.removeCurrentPost = this.removeCurrentPost.bind(this);
    this.props.location.state = { removeCurrentPost: this.removeCurrentPost };
  }

  componentDidMount() {
    axios.get(store.get('URL').root_url + '/account/media')
      .then(
      res => {
        const newArr = res.data.data.map(post => post);
        this.setState({
          isLoaded: true, 
          data: [...this.state.data, ...newArr] 
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  currentPostIsEmpty() {
    return Object.keys(this.state.currentPost).length === 0 && this.state.currentPost.constructor === Object;
  }
  
  changeCurrentPost(post) {
    console.log('WE ARE CHANGING CURRENT');
    let currentPost = {...this.state.currentPost};
    currentPost.id = post.id,
    currentPost.caption = post.caption,
    currentPost.image_thumb = post.image_thumb
    currentPost.image_low = post.image_low ? post.image_low : null,
    currentPost.image_norm = post.image_norm ? post.image_norm : null,
    currentPost.video_low = post.video_low ? post.video_low : null,
    currentPost.video_norm = post.video_norm ? post.video_norm : null

    this.setState({currentPost}, () => console.log('updated state value', this.state.currentPost));
  }

  removeCurrentPost() {
    console.log('REMOVING CURRENT POST');
    this.setState({currentPost: {}}, () => console.log('UPDATE ON CURRENTPOST', this.state.currentPost));
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
              id={post.id}
              caption={post.caption.text}
              image_thumb={post.images.thumbnail}
              video_low={post.videos.low_bandwidth}
              video_norm={post.videos.standard_resolution}
              changeCurrentPost={this.changeCurrentPost}
              {...this.props}
            />
          )
        } else {
          return (
            <PostListItem
              key={post.id}
              id={post.id}
              caption={post.caption.text}
              image_low={post.images.low_resolution}
              image_norm={post.images.standard_resolution}
              image_thumb={post.images.thumbnail}
              changeCurrentPost={this.changeCurrentPost}
              {...this.props}
            />
          )
        }
      });
    }
  }

  renderPostItem() {
    // previously this.props.location.state.video_low
    if (this.state.currentPost.video_low) {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs=8">
            <iframe src={this.state.currentPost.video_low.url} className="embed-responsive-item" style={{ height: '536px' }} seamless>
            </iframe>
            <p>{this.state.currentPost.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4">
            <p>bunch of retail links/img</p>
            <p>bunch of retail links/img</p>
            <p>bunch of retail links/img</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs=8">
            <img src={this.state.currentPost.image_norm.url} className="img-responsive" />
            <p>{this.state.currentPost.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4">
            <p>bunch of retail links/img</p>
            <p>bunch of retail links/img</p>
            <p>bunch of retail links/img</p>
          </div>
        </div>
      )
    }
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
