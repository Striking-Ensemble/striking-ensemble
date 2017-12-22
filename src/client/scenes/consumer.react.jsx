import React, { Component } from 'react';
import axios from 'axios';
import store from 'store';
import Footer from '../components/footer.react';
import LoadingSpinner from '../components/loadingSpinner.react';
import PostListItem from './Home/postListItem.react';

export default class Consumer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      userIsLoaded: false,
      mediaIsLoaded: false,
      user: {},
      data: [],
      currentPost: {}
    }

    this.renderUser = this.renderUser.bind(this);
    this.addCurrentPost = this.addCurrentPost.bind(this);
    this.removeCurrentPost = this.removeCurrentPost.bind(this);
  }

  componentDidMount() {
    axios.get(store.get('URL').root_url + `/user${this.props.location.pathname}`)
      .then(
      res => {
        console.log('I NEED TO FIND res.data', res.data);
        if (res.data) {
          const newObj = res.data.forEach(post => post);
          // update user state
          this.setState({
            userIsLoaded: true,
            user: {...newObj}
          });
        }
      })
      .catch(err => {
        console.log(err);
      });

    axios.get(store.get('URL').root_url + '/:username/media')
      .then(
      res => {
        console.log('I NEED TO FIND res.data', res.data);
        if (res.data) {
          const newArr = res.data.map(post => post);
          // update media state
          this.setState({
            mediaIsLoaded: true,
            data: [...newArr]
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  addCurrentPost(post) {
    console.log('WE ARE ADDING CURRENT POST FROM ROOT', post);
    let currentPost = { ...this.state.currentPost };
    currentPost.instaId = post.instaId;
    currentPost.caption = post.caption;
    currentPost.image_thumb = post.image_thumb;
    currentPost.image_low = post.image_low ? post.image_low : null;
    currentPost.image_norm = post.image_norm ? post.image_norm : null;
    currentPost.video_low = post.video_low ? post.video_low : null;
    currentPost.video_norm = post.video_norm ? post.video_norm : null;
    currentPost.retailLinks = post.retailLinks ? post.retailLinks : null;

    this.setState({ currentPost }, () => console.log('updated state value', this.state.currentPost));
  }

  removeCurrentPost() {
    console.log('REMOVING CURRENT POST FROM ROOT');
    this.setState({ currentPost: {} }, () => console.log('UPDATE ON CURRENTPOST', this.state.currentPost))
  }

  renderUser() {
    return (
      <div className="user-info">
        <button className="btn btn-default" onClick={this.removeCurrentPost}>Back</button>
        <h2>{this.state.user.full_name}</h2>
        <img src={this.state.user.profile_picture} className="img-circle" style={{ 'maxWidth': '15%' }} />
        <br />
      </div>
    )
  }

  renderPosts() {
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

  render() {
    return (
      <div id="page-outer">
        <div className="page-container">
          {!this.state.userIsLoaded ?
            (<LoadingSpinner />)
            :
            (this.renderUser())
          }
          <br />
          {!this.state.mediaIsLoaded ?
            (<LoadingSpinner />)
            :
            (this.renderPosts())
          }
        </div>
        <Footer />
      </div>
    )
  }
}
