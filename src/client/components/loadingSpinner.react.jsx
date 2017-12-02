import React from 'react';

const divStyle = {
  width: '100%',
  height: '100%'
};
const spinner = {
  width: '100%',
  height: 'auto',
  display: 'block',
  margin: 'auto'
};

const LoadingSpinner = () => (
  <div className="container">
    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-3 col-centered">
      <div className="lds-css ng-scope" style={spinner}>
        <div className="lds-eclipse" style={divStyle}>
          <div></div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;