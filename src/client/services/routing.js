import React from 'react';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import App from '../components/app.react';
import Signin from '../scenes/Sign/signin.react';
import Account from '../scenes/Home/account.react';
import PostItem from '../scenes/Home/postItem.react';
import Navigation from '../components/navigation.react';
import Footer from '../components/footer.react';

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
//     mainContent: () => <App />,
//     footer: () => <Footer />
//   },
//   {
//     path: '/account',
//     nav: () => <Navigation />,
//     mainContent: () => <App />,
//     footer: () => <Footer />
//   }
// ];

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
