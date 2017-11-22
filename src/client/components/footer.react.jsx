import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <h2>Footer Sample</h2>
        <Link to="/terms"> Terms </Link>
        <br />
        <Link to="/privacy"> Privacy </Link>
        <br />
        <Link to="/contact"> Contact </Link>
      </div>
    )
  }
}
