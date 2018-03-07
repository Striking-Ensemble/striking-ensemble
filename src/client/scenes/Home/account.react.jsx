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
      currentPost: {}
    }

    this.fetchInstaPosts = this.fetchInstaPosts.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.renderPostItem = this.renderPostItem.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.path == '/account' || match.path == '/') {
      this.fetchInstaPosts();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    // fetch insta posts when on '/account' or '/' and 
    // not coming from '/' and 
    // no media on state yet to avoid duplication
    const toFetchData = (match.path == '/account' || match.path == '/') && 
                        this.props.location.pathname !== '/' && 
                        this.state.data.length == 0;
    if (toFetchData) {
      this.fetchInstaPosts();
    }
  }

  fetchInstaPosts() {
    axios.post(store.get('URL').root_url + '/account/media', { username: this.props.user.username })
      .then(
        res => {
          if (res.data[0] && typeof res.data !== 'string') {
            const newArr = res.data.map(post => post);
            // update state, then send recent media to DB
            this.setState({
              isLoaded: true,
              data: [...this.state.data, ...newArr]
            });
          } else {
            // necessary for when server restarts
            // and client still has login session
            store.remove('user');
            store.remove('isAuthenticated');
            <Redirect to={{
              pathname: '/login',
              state: { from: this.props.location }
            }} />
          }
        })
      .catch(err => {
        console.log(err);
        store.remove('user');
        store.remove('isAuthenticated');
        this.props.history.replace({ pathname: '/login' });
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
              caption={post.caption}
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
              caption={post.caption}
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
            <div className="col-lg-1 col-md-1 col-sm-2 col-xs-3">
              <img src={user.profile_picture} className="img-responsive img-circle" />
            </div>
            <div className="col-lg-1 col-md-1 col-sm-2 col-xs-3">
              <h4 className="username-text">{user.username}</h4>
            </div>
          </div>
        </div>
        <br />
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="row">
              {this.currentPostIsEmpty() ? this.renderPosts() : this.renderPostItem()}
          </div>
        </div>
      </div>
    )
  }
}
