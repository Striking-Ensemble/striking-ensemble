import React, { Component } from 'react';
import store from 'store';
import { get as GET, post as POST } from 'axios';
import isAuthenticated from '../../services/isAuthenticated';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/loadingSpinner.react';
import LoadingBars from '../../components/loadingBars.react';
import Footer from '../../components/footer.react';
import Redirect from 'react-router-dom/Redirect';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logClicked: false,
      authenticated: false,
      redirectToReferrer: false,
      isLoaded: false
    }

    this.authenticating = this.authenticating.bind(this);
    this.handleLogClicked = this.handleLogClicked.bind(this);
    this.renderLogOrContinue = this.renderLogOrContinue.bind(this);
  }

  componentDidMount() {
    if (this.props.location.pathname === '/logout') {
      POST(store.get('URL').root_url + '/logout')
        .then(
          res => {
            store.remove('user');
            store.remove('isAuthenticated');
            this.setState({ isLoaded: true, authenticated: false });
            this.props.history.push('/login');
          }
        )
        .catch(err => {
          console.log(err);
        });
    } else {
      this.authenticating(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    // location changed
    console.log('WILLL RECEIVE IN LANDING');
    if (nextProps.location !== this.props.location) {
      if (nextProps.location.pathname === '/logout') {
        POST(store.get('URL').root_url + '/logout')
          .then(
            res => {
              store.remove('user');
              store.remove('isAuthenticated');
              this.setState({ isLoaded: true, authenticated: false });
              this.props.history.push('/login');
            }
          )
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

  authenticating(params) {
    const { history } = params;
    const rootUrl = store.get('URL').root_url;
    if (isAuthenticated()) {
      console.log('AM I TRIGGERED?', isAuthenticated());
      this.setState({ isLoaded: true, authenticated: true, redirectToReferrer: true });
    } else {
      console.log('so what am I..... UN-Authenticated?');
      this.setState({ isLoaded: true, authenticated: false });
      store.remove('user');
      store.remove('isAuthenticated');
      console.log('PLEASE LOG IN 1st cuz AUTH landing');
    }
  };

  handleLogClicked() {
    console.log('tickle me:', this.props.location.state);
    store.set('from', this.props.location.state);
    this.setState({ logClicked: true });
  }

  renderLogOrContinue() {
    if (this.state.isLoaded) {
      if (this.state.authenticated) {
        return (
          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-md-offset-1">
            <h3>Continue to Your Account:</h3>
            <Link to='/home'>Enter</Link>
            <p> or </p>
            <Link to='/logout'>Sign Out</Link>
          </div>
        ) 
      } else {
        return (
          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-md-offset-1">
            <h3>Synchronize your Instagram posts here:</h3>
            <a href="/auth/instagram" onClick={this.handleLogClicked} className="btn btn-block btn-lg btn-social btn-instagram">
              <span className="fa fa-instagram"></span>
              {this.state.logClicked ? <LoadingBars /> : `Sign in with Instagram`}
            </a>
          </div>
        )
      }
    } else {
      return <LoadingSpinner />
    }
  }

  render() {
    // location.state doesn't work here yet due to page
    // redirect from server when clicking log in instagram
    // const { from } = this.props.location.state || { from: { pathname: '/home' } };
    // if (this.state.redirectToReferrer) {
    //   console.log('whats my from path?', from.pathname);
    //   return <Redirect to={from.pathname} />
    // }

    return (
      <div id="wrap">
        <div className="container-fluid">
          <div id="main" className="container">
            <div className="jumbotron">
              <div className="row page-header">
                <img src="/assets/images/striking_ensemble_logo.png" className="col-lg-2 col-lg-offset-3 col-md-3 col-md-offset-2 col-sm-3 col-sm-offset-1 col-xs-4 col-xs-offset-4" alt='SE_Logo' />
                <h1 className="col-md-4 col-sm-8 col-xs-12">Striking Ensemble</h1>
              </div>
              <h3>Join Striking Ensemble now and headline your social media posts with retail products to give them easy checkout process for your followers.</h3> 
            </div>
            <div className="row">
              {this.renderLogOrContinue()}
              <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-md-offset-1">
                <h3>Check Out Our Influencers!</h3>
                <a href="/influencer-list" className="btn btn-default btn-lg">
                  <span className="glyphicon glyphicon-user" aria-hidden="true"></span> Influencers Portal
                </a>
              </div>
            </div>
          </div>
        </div>
        <br />
        <Footer />
      </div>
    )
  }
}
