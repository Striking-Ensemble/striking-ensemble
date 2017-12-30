import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Influencer from '../components/influencer.react';
import Landing from '../scenes/Sign/landing.react';
import Account from '../scenes/Home/account.react';
import PostItem from '../scenes/Home/postItem.react';
import Navigation from '../components/navigation.react';
import Footer from '../components/footer.react';
import PostListItem from '../scenes/Home/postListItem.react';
import FourOhFour from '../components/fourOhFour.react';
import Consumer from '../scenes/consumer.react';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/login" component={Landing} />
      <Route exact path="/account" component={Influencer} />
      <Route exact path="/account/post/:id" component={Account} />
      <Route exact path="/:username" component={Consumer} />
      <Route exact path="/" component={Influencer} />
      <Route component={FourOhFour} />
    </Switch>
  )
}

export default Routing;
