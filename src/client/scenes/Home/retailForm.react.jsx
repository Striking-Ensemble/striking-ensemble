import axios from 'axios';
import React, { Component } from 'react';
import { Link, Prompt } from 'react-router-dom';
import InputBox from './inputBox.react';

export default class RetailForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      changesDetected: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangesUnsaved = this.handleChangesUnsaved.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderModal = this.renderModal.bind(this);
  }

  handleChange() {
    console.log('state on changesDetected:', this.state.changesDetected);
    if (!this.state.changesDetected) {
      this.setState({ changesDetected: true });
    }
  }
  // part of modal prompt
  handleChangesUnsaved(e) {
    if (this.state.changesDetected) {
      // pop modal w/ ok & cancel choices
      this.renderModal()
        // if ok
          // changesDetected === false
          // close modal
          // redirect or link to '/' or send to what was clicked
        // else 'cancel'
          // close modal and stay on the same page
    } else {
      return (
        <Redirect to='/' />
      )
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let elements = e.target.elements;
    let body = [];
    let lastUrl = 0;
    const { user, match, instaId, editRetailLink } = this.props;
    // iterate through the entire form element content
    for (let i = 0; i < elements.length - 1; i++) {
      console.log('NEW AFFILIATE FIELD FORM:', elements[i]);
      let item = elements[i];
      if (item.name.includes('link')) {
        if (item.value !== '') {
          body.push({id: `link_${body.length}`, url: item.value, affiliateLink: `${user.affiliateLink}/p/${match.params.id}`});
        }
      }
    }

    console.log('json would be body:', body);
    axios.post(`/account/post/${instaId}/submit_links`, body)
    .then(response => {
      console.log(response);
      this.setState({ changesDetected: false });
    })
    .catch(err => console.log(err));

    editRetailLink(body);
  }
  // part of modal prompt
  renderModal(redirectPath) {
    return (
      <div id="alertModal" className="modal fade" tabindex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Changes Detected!</h4>
            </div>
            <div className="modal-body">
              <p>Oops! You still haven't saved your edited URL links. Click 'Close' to stay and save OR 'Ignore' to move on&hellip;</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <Link to="/" className="btn btn-primary">Ignore</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    console.log('CONTENTS OF LOCAL RETAIL LINKS', this.props.retailLinks);
    return (
      <div>
        <form id="retail-form" method="post" onSubmit={this.handleSubmit}>
          <legend>Product Links</legend>
          <div className="row">
            <div className="col-lg-2 col-md-3 col-sm-3 col-xs-2">
              <button className="btn btn-success btn-sm" type="submit">Save</button>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-3 col-xs-3">
              <Link to='/' className="btn btn-default btn-sm">Cancel</Link>
            </div>
          </div>
          <div className="form-group">
          {
            this.props.retailLinks.map((item, index) => (
              <InputBox 
                key={item.id ? item.id : `link_${index}`}
                retailIndex={index}
                retailLink={item.url}
                affiliateLink={item.affiliateLink}
                editRetailLink={this.props.editRetailLink}
                removeRetailLink={this.props.removeRetailLink}
                handleChange={this.handleChange}
              />
          ))}
          </div>
          <button className="btn btn-default" onClick={this.props.addInputBox} value="retail-form" type="button">Add More Link Boxes</button>
        </form>
        <Prompt
          when={this.state.changesDetected}
          message={location => {
            return (
            `Changes have not been saved yet. Are you sure you want to go to 
            ${location.pathname == '/' ? 'Home' : location.pathname.slice(0)}?`
          )}}
        />
      </div>
    )
  }
};
