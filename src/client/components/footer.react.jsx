import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <h2>Footer Sample</h2>
        <a href="/terms"> Terms </a>
        <br />
        <a href="/privacy"> Privacy </a>
        <br />
        <a href="/contact"> Contact </a>
      </div>
    )
  }
}
