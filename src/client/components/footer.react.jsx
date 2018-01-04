import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="footer" className="bg-info">
      <Link to="/terms" className="col-lg-offset-2 col-md-offset-2 col-sm-offset-1 col-xs-offset-1"> Terms </Link>
      <br />
      <Link to="/privacy" className="col-lg-offset-2 col-md-offset-2 col-sm-offset-1 col-xs-offset-1"> Privacy </Link>
      <br />
      <Link to="/contact" className="col-lg-offset-2 col-md-offset-2 col-sm-offset-1 col-xs-offset-1"> Contact </Link>
    </footer>
  )
};

export default Footer;
