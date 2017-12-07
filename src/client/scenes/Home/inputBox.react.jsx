import React, { Component } from 'react';

export default class InputBox extends Component {
  constructor(props) {
    super(props)

    this.state ={
      textLink: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  handleChange(e) {
    this.setState({textLink: e.target.value});
  }

  removeItem() {
    this.props.removeRetailLink(this.props.retailIndex);
  }

  render() {
    return (
      <div>
        <input type="url" defaultValue={this.props.retailLink} />
        {/* Needs an Edit Button: <button>Edit</button> */}
        <button onClick={this.removeItem} value="retail-form" type="button">-</button>
      </div>
    )
  }
};
