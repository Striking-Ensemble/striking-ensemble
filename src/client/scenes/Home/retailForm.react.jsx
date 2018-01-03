import React, { Component } from 'react';
import InputBox from './inputBox.react';
import axios from 'axios';

export default class RetailForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let elements = e.target.elements;
    let body = [];
    for (let i = 0; i < elements.length - 1; i++) {
      let item = elements[i];
      if (item.type == 'url') {
        if (item.value !== '') {
          body.push({id: `link_${body.length}`, url: item.value});
        }
      }
    }

    console.log('json would be body:', body);
    this.props.editRetailLink(body);

    axios.post(`/account/post/${this.props.instaId}/submit_links`, body)
      .then(response => console.log(response))
      .catch(err => console.log(err)); 
  }

  render() {
    console.log('CONTENTS OF LOCAL RETAIL LINKS', this.props.retailLinks);
    return (
      <div>
        <form id="retail-form" method="post" onSubmit={this.handleSubmit}>
          <legend>Add your retail links</legend>
          <div className="row">
            <div className="col-md-2 col-sm-3 col-xs-2">
              <button className="btn btn-success btn-sm" type="submit">Save</button>
            </div>
            <div className="col-md-2 col-sm-3 col-xs-3">
              <button className="btn btn-default btn-sm" type="reset">Cancel</button>
            </div>
          </div>
          <div className="form-group">
          {
            this.props.retailLinks.map((item, index) => (
              <InputBox 
                key={item.id ? item.id : `link_${index}`}
                retailIndex={index}
                retailLink={item.url}
                editRetailLink={this.props.editRetailLink}
                removeRetailLink={this.props.removeRetailLink}
              />
          ))}
          </div>
          <button className="btn btn-default" onClick={this.props.addInputBox} value="retail-form" type="button">Add More Link Boxes</button>
        </form>
      </div>
    )
  }
};
