import React, { Component } from 'react';

export class Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table 
        className={this.props.className}
        style={this.props.style}
        ref={node => (this.tableNode = node)}
      >
        {this.props.children}  
      </table>
    )
  }
};

export class TableRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr 
        className={this.props.className}
        style={this.props.style}
        ref={node => (this.tableRowNode = node)}
      >
       {this.props.children}
      </tr>
    )
  }
};
