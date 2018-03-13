import React from 'react';
import { Link } from 'react-router-dom';

const FourOhFour = () => (
  <div className="container">
    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="error-template">
          <h1>Oops!</h1>
          <h2>404 Not Found</h2>
          <div className="error-details">
            Sorry, an error has occured, Requested page not found!
          </div>
          <br />
          <div className="error-actions">
            <Link to="/login" className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home" /> Take Me Home </Link>
            {/* <Link to="/contact" className="btn btn-default btn-lg">
                  <span className="glyphicon glyphicon-envelope" />
                  Contact Support
                </Link> */}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FourOhFour;
