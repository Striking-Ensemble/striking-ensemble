import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Influencer from '../scenes/Home/influencer.react';
import Landing from '../scenes/Sign/landing.react';
import FourOhFour from '../components/fourOhFour.react';
import Consumer from '../scenes/Consumer/consumer.react';
import InfluencerList from '../scenes/Consumer/influencerList.react';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/login" component={Landing} />
      <Route exact path="/account" component={Influencer} />
      <Route exact path="/account/post/:id" component={Influencer} />
      <Route exact path="/influencer-list" component={InfluencerList} />
      <Route exact path="/:username" component={Consumer} />
      <Route exact path="/:username/post/:id" component={Consumer} />
      <Route exact path="/" component={Influencer} />
      <Route component={FourOhFour} />
    </Switch>
  )
}

export default Routing;
