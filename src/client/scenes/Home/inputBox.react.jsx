import React, { Component } from 'react';

export default class InputBox extends Component {
  constructor(props) {
    super(props)

    this.removeItem = this.removeItem.bind(this);
  }

  removeItem() {
    this.props.removeRetailLink(this.props.retailIndex);
  }

  render() {
    return (
      <div>
        <input type="url" name={`link_${this.props.retailIndex}`} defaultValue={this.props.retailLink} />
        <button onClick={this.removeItem} value="retail-form" type="button">-</button>
      </div>
    )
  }
};
