import React, { Component } from 'react';
import InputBox from './inputBox.react';

export default class RetailForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form id="retail-form" method="post" onSubmit={this.handleSubmit}>
        <legend>Add your retail links</legend>
        <input type="submit" value="Save" /><input type="reset" value="Cancel" />
        <br />
        <InputBox 
          retailLinks={this.props.retailLinks}
        />
      </form>
    )
  }
};
