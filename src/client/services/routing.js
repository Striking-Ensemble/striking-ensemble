import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';
import Analytics from './analytics';
import PrivateRoute from '../components/privateRoute.react';
import Navigation from '../components/navigation.react';
import Influencer from '../scenes/Home/influencer.react';
import Landing from '../scenes/Sign/landing.react';
import Consumer from '../scenes/Consumer/consumer.react';
import InfluencerList from '../scenes/Consumer/influencerList.react';
import FourOhFour from '../components/fourOhFour.react';

ReactGA.initialize('UA-113143362-1');

const Routing = () => {
  return (
    <Router>
      <div>
        <Route path="/" component={Analytics} />
        <Switch>
          <Route exact path="/login" component={Landing} />
          <PrivateRoute exact path="/home" component={Influencer} />
          <PrivateRoute exact path="/home/p/:id" component={Influencer} />
          <PrivateRoute path="/billing" component={Influencer} />
          <PrivateRoute path="/settings" component={Influencer} />
          <PrivateRoute path="/reports" component={Influencer} />
          <Route exact path="/influencer-list" component={InfluencerList} />
          <Route exact path="/logout" component={Landing} />
          <Route exact path="/:username" component={Consumer} />
          <Route exact path="/:username/p/:id" component={Consumer} />
          <Route exact path="/" component={Landing} />
          <Route component={FourOhFour} />
        </Switch>
      </div>
    </Router>
  )
}

export default Routing;
