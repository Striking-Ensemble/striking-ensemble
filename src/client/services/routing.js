import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from '../components/app.react.jsx';
import Signin from '../scenes/Sign/signin.react.jsx';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/account" component={App} />
      <Route path="/login" component={Signin} />
    </Switch>
  )
}

export default Routing;
