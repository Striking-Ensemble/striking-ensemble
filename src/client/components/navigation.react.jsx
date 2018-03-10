import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = (props) => (
  // <li> classnames here helps to identify which tab should be highlighted
  // depending on the current location => props.location
  <nav className="navbar navbar-inverse navbar-fixed-top">
    <div className="container-fluid">
      <div className="navbar-header">
        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-header-content" aria-expanded="false">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        <Link className="navbar-brand" to="/">Striking Ensemble</Link>
      </div>
      <div className="collapse navbar-collapse" id="navbar-header-content">
        <ul className="nav navbar-nav">
          <li role="button" className={props.location.pathname === '/' || props.location.pathname.includes('account') ? 'active' : ''}>
            <Link to="/account" data-toggle="collapse" data-target=".navbar-collapse.in">Home <span className="sr-only">(current)</span></Link>
          </li>
          <li role="button" className={props.location.pathname.includes('/reports') ? 'active' : ''}>
            <Link to="/reports" data-toggle="collapse" data-target=".navbar-collapse.in">Reports</Link>
          </li>
          <li role="button" className={props.location.pathname.includes('/billing') ? 'active' : ''}>
            <Link to="/billing" data-toggle="collapse" data-target=".navbar-collapse.in">Billing Info</Link>
          </li>
          <li role="button" className={props.location.pathname.includes('/stats') ? 'active' : ''}>
            <Link to="/settings" data-toggle="collapse" data-target=".navbar-collapse.in">Settings</Link>
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/logout" id="logout-button" className="btn btn-danger log" data-toggle="collapse" data-target=".navbar-collapse.in">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navigation;
