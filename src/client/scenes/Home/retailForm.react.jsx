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
    alert('Sending a POST req to server');
    // axios.post('')
  }

  render() {
    return (
      <form id="retail-form" method="post" onSubmit={this.handleSubmit}>
        <legend>Add your retail links</legend>
        <input type="submit" value="Save" /><input type="reset" value="Cancel" />
        <br />
        {this.props.retailLinks.map((item, index) => (
          <InputBox 
            key={index}
            retailIndex={index}
            retailLink={item}
            editRetailLink={this.props.editRetailLink}
            removeRetailLink={this.props.removeRetailLink}
          />
        ))}
        <br />
        <button onClick={this.props.addInputBox} value="retail-form" type="button">Add More Link Boxes</button>
      </form>
    )
  }
};
