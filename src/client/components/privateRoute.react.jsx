import { get as GET } from 'axios';
import store from 'store';
import React, { Component as RouteComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import isAuthenticated from '../services/isAuthenticated';
import LoadingSpinner from './loadingSpinner.react';

export default class PrivateRoute extends RouteComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      isAuthenticated: false
    }
  }

  componentDidMount() {
    GET(`${store.get('URL').root_url}/account`)
      .then((res) => {
        if (res.data.username) {
          console.log('LOG IN SUCCESS, Retrieving user info...');
          store.set('user', { data: res.data });
          store.set('isAuthenticated', true); // app wide checking
          this.setState({ isAuthenticated: true, isLoaded: true });
        } else {
          store.remove('user');
          store.remove('isAuthenticated');
          console.log('PLEASE LOG cuz false');
          this.setState({ isLoaded: true });
        }
      })
      .catch(err => {
        console.log('ERROR IN CHECK checkAuth', err);
        store.remove('user');
        store.remove('isAuthenticated');
        store.each((value, key) => {
          console.log('WHATs IN STORE:', key, '==', value);
        });
        this.setState({ isLoaded: true });
      });
  }

  render() {
    const { component: Component, ...rest } = this.props;
    if (!this.state.isLoaded) {
      return <LoadingSpinner />
    } else {
      return (
        <Route
          {...rest}
          render={(props) => {
            if (this.state.isAuthenticated) {
              return <Component {...props} />;
            } else {
              return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />; // eslint-disable-line
            }
          }}
        />
      )
    }
  }
};
