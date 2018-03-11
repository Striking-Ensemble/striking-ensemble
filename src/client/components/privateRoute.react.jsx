import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import isAuthenticated from '../services/isAuthenticated';

const PrivateRoute = ({ component: Component, ...rest }) => ( // eslint-disable-line
  <Route
    {...rest}
    render={(props) => {
      if (isAuthenticated()) {
        return <Component {...props} />;
      }
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />; // eslint-disable-line
    }}
  />
);

export default PrivateRoute;
