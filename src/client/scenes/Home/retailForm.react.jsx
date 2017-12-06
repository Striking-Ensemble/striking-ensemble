import React, { Component } from 'react';
import InputBox from './inputBox.react';
import axios from 'axios';

export default class RetailForm extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      inputBox: [
        {
          id: 1 
        }
      ]
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addInputBox = this.addInputBox.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    alert('Sending a POST req to server');
    // axios.post('')
  }

  addInputBox(e) {
    e.preventDefault();
    console.log('I need something from event to add', e.target);
    let newItem = ['new Item'];
    this.setState({inputBox: [...this.state.inputBox, ...newItem]});
  }

  render() {
    return (
      <form id="retail-form" method="post" onSubmit={this.handleSubmit}>
        <legend>Add your retail links</legend>
        <input type="submit" value="Save" /><input type="reset" value="Cancel" />
        <br />
        {this.state.inputBox.map((item, index) => (
          <InputBox
            key={item.id + 1}
            retailLinks={this.props.retailLinks}
            addInputBox={this.addInputBox}
          />
        ))}
      </form>
    )
  }
};
