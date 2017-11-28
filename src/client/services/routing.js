import React from 'react';
import { Route, Switch, } from 'react-router-dom';
import App from '../components/app.react';
import Signin from '../scenes/Sign/signin.react';
import Account from '../scenes/Home/account.react';

const Routing = () => {
  return (
    <Switch>
      <Route path="/login" component={Signin} />
      <Route path="/" component={App} />
      <Route path="/account" component={App} />
    </Switch>
  )
}

export default Routing;
