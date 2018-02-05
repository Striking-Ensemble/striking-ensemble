import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from '../components/navigation.react';
import Influencer from '../scenes/Home/influencer.react';
import Landing from '../scenes/Sign/landing.react';
import FourOhFour from '../components/fourOhFour.react';
import Consumer from '../scenes/Consumer/consumer.react';
import InfluencerList from '../scenes/Consumer/influencerList.react';
import Billing from '../scenes/Billing/billing.react';

const Routing = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Landing} />
        <Route exact path="/account" component={Influencer} />
        <Route exact path="/account/post/:id" component={Influencer} />
        <Route path="/billing" component={Influencer} />
        <Route path="/settings" component={Influencer} />
        <Route exact path="/influencer-list" component={InfluencerList} />
        <Route exact path="/:username" component={Consumer} />
        <Route exact path="/:username/post/:id" component={Consumer} />
        <Route exact path="/" component={Influencer} />
        <Route component={FourOhFour} />
      </Switch>
    </Router>
  )
}

export default Routing;
