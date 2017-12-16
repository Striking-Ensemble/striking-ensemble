import React, { Component } from 'react';
import isAuthenticated from '../../services/isAuthenticated'
import { Redirect } from 'react-router-dom';
import PostListItem from './postListItem.react';
import axios from 'axios';
import store from 'store';
import LoadingSpinner from '../../components/loadingSpinner.react';
import RetailForm from './retailForm.react';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: [],
      retailLinks: [{
        url: ''
      }] //[{ id: 1234, url: 'https://www.forever21.com/us/shop/Catalog/Product/21men/mens-new-arrivals/2000211808' }, { id: 12356, url: 'https://www.forever21.com/us/shop/Catalog/Product/21men/mens-new-arrivals/2000249599' }, { id: 1111, url: 'http://us.asos.com/pullbear/pullbear-sweater-with-shawl-neck-in-gray-marl/prd/9172440?clr=chinefon&SearchQuery=&cid=6993&gridcolumn=3&gridrow=5&gridsize=3&pge=1&pgesize=72&totalstyles=877' }, { id: 2222, url: 'fake sample' }] // must accept array of obj with id and url as properties
    }

    this.removeRetailLink = this.removeRetailLink.bind(this);
    this.editRetailLink = this.editRetailLink.bind(this);
    this.addInputBox = this.addInputBox.bind(this);
  }

  componentDidMount() {
    axios.get(store.get('URL').root_url + '/account/media')
      .then(
      res => {
        console.log('I NEED TO FIND res.data', res.data);
        if (res.data.data) {
          const newArr = res.data.data.map(post => post);
          this.setState({
            isLoaded: true, 
            data: [...this.state.data, ...newArr] 
          }, () => {
            axios.post(store.get('URL').root_url + '/account/submit_media', { data: newArr })
              .then(res => console.log('SUBMITTED ALL MEDIA', res))
              .catch(err => console.log(err));
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

  editRetailLink(links) {
    this.setState({ retailLinks: links }, () => console.log('Retail so far...', this.state.retailLinks));
  }

  removeRetailLink(index) {
    console.log('REMOVING @ index', index);
    let retailArr = this.state.retailLinks.slice();
    retailArr.splice(index, 1);
    this.setState({ retailLinks: retailArr }, () => console.log('Current Retail State:', this.state.retailLinks))
  }

  addInputBox() {
    this.setState({ retailLinks: [...this.state.retailLinks, {url: ''}] }, () => console.log('ADDING NEW BOX', this.state.retailLinks));
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
    // previously this.props.location.state.video_low
    console.log('seek this.props.currentPost:', this.props.currentPost);
    if (this.props.currentPost.video_low) {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs=8">
            <iframe src={this.props.currentPost.video_low.url} className="embed-responsive-item" style={{ height: '536px' }} seamless>
            </iframe>
            <p>{this.props.currentPost.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4">
            <RetailForm 
              instaId={this.props.currentPost.instaId}
              retailLinks={this.state.retailLinks}
              editRetailLink={this.editRetailLink}
              removeRetailLink={this.removeRetailLink}
              addInputBox={this.addInputBox}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="container">
          <div id="post-item" className="col-md-8 col-sm-8 col-xs=8">
            <img src={this.props.currentPost.image_norm.url} className="img-responsive" />
            <p>{this.props.currentPost.caption}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4">
            <RetailForm
              instaId={this.props.currentPost.instaId} 
              retailLinks={this.state.retailLinks}
              editRetailLink={this.editRetailLink}
              removeRetailLink={this.removeRetailLink}
              addInputBox={this.addInputBox}
            />
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
