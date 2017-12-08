import React, { Component } from 'react';

export default class InputBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      textLink: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.removeItem = this.removeItem.bind(this);
    // this.editLink = this.editLink.bind(this);
  }

  handleChange(e) {
    this.setState({textLink: e.target.value}, () => console.log('textLink TYPING...', this.state.textLink));
    //this.props.editRetailLink(this.props.retailIndex, this.state.textLink);
  }

  removeItem() {
    this.props.removeRetailLink(this.props.retailIndex);
  }

  // editLink() {
  //   this.props.editRetailLink(this.props.retailIndex, this.state.textLink);
  // }

  render() {
    return (
      <div>
        <input type="url" defaultValue={this.props.retailLink} onChange={this.handleChange} />
        <button onClick={this.removeItem} value="retail-form" type="button">-</button>
      </div>
    )
  }
};
