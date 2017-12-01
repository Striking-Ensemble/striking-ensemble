import React from 'react';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import App from '../components/app.react';
import Signin from '../scenes/Sign/signin.react';
import Account from '../scenes/Home/account.react';
import PostItem from '../scenes/Home/postItem.react';

const Routing = () => {
  return (
    <Switch>
      <Route path="/login" component={Signin} />
      <Route exact path="/account/post/:id" component={PostItem} />
      <Route path="/" component={App} />
      <Route path="/account" component={App} />
    </Switch>
  )
}

export default Routing;
