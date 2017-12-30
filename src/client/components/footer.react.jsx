import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="footer" className="bg-info">
      <Link to="/terms"> Terms </Link>
      <br />
      <Link to="/privacy"> Privacy </Link>
      <br />
      <Link to="/contact"> Contact </Link>
    </footer>
  )
};

export default Footer;
