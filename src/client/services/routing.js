import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Influencer from '../components/influencer.react';
import Landing from '../scenes/Sign/landing.react';
import Account from '../scenes/Home/account.react';
import PostItem from '../scenes/Home/postItem.react';
import Navigation from '../components/navigation.react';
import Footer from '../components/footer.react';
import PostListItem from '../scenes/Home/postListItem.react';
import NotFound from '../components/notFound.react';
import Consumer from '../scenes/consumer.react';

// const routes = [
//   { path:'/login',
//     mainContent: () => <Signin />
//   },
//   { path: '/account/post/:id',
//     exact: true,
//     nav: () => <Navigation />,
//     mainContent: () => <PostItem />,
//     footer: () => <Footer />
//   },
//   {
//     path: '/',
//     nav: () => <Navigation />,
//     mainContent: () => <Influencer />,
//     footer: () => <Footer />
//   },
//   {
//     path: '/account',
//     nav: () => <Navigation />,
//     mainContent: () => <Influencer />,
//     footer: () => <Footer />
//   }
// ];

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/login" component={Landing} />
      <Route path="/account" component={Influencer} />
      <Route exact path="/account/post/:id" component={Account} />
      <Route path="/:username" component={Consumer} />
      <Route exact path="/404" component={NotFound} />
      <Route exact path="/" component={Influencer} />
    </Switch>
  )
}

export default Routing;
