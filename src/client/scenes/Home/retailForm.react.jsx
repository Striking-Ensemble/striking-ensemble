import React, { Component } from 'react';
import InputBox from './inputBox.react';
import axios from 'axios';

export default class RetailForm extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      inputBox: [
        {
          id: 1,
          link: '', 
        }
      ]
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addInputBox = this.addInputBox.bind(this);
    // this.removeInputBox = this.removeInputBox.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    alert('Sending a POST req to server');
    // axios.post('')
  }

  addInputBox(e) {
    e.preventDefault();
    console.log('I need something from event to add', e);
    let newItem = ['new Item'];
    this.setState({inputBox: [...this.state.inputBox, ...newItem]});
  }

  // removeInputBox(index) {
  //   console.log('REMOVING INPUT BOX', index);
  //   this.setState({inputBox: this.state.inputBox.splice(index, 1)})
  // }

  render() {
    return (
      <form id="retail-form" method="post" onSubmit={this.handleSubmit}>
        <legend>Add your retail links</legend>
        <input type="submit" value="Save" /><input type="reset" value="Cancel" />
        <br />
        {/* {this.state.inputBox.map((item, index) => (
          <InputBox
            key={item.id + 1}
            retailLinks={this.props.retailLinks}
            addInputBox={this.addInputBox}
            removeInputBox={this.removeInputBox}
          />
        ))} */}
        {this.props.retailLinks.map((item, index) => (
          <InputBox 
            key={index}
            retailIndex={index}
            retailLink={item}
            addInputBox={this.addInputBox}
            removeRetailLink={this.props.removeRetailLink}
          />
        ))}
        <br />
        <button onClick={this.addInputBox} value="retail-form" type="button">Add More Link Boxes</button>
      </form>
    )
  }
};
