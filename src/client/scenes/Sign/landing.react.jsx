import React, { Component } from 'react';
import store from 'store';
import { get as GET, post as POST } from 'axios';
import isAuthenticated from '../../services/isAuthenticated';
import { Link } from 'react-router-dom';
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
            this.setState({ authenticated: false });
            this.props.history.push('/login');
          }
        )
        .catch(err => {
          console.log(err);
        });
    }
    this.authenticating(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // location changed
    if (nextProps.location !== this.props.location) {
      if (nextProps.location.pathname === '/logout') {
        POST(store.get('URL').root_url + '/logout')
          .then(
            res => {
              store.remove('user');
              store.remove('isAuthenticated');
              this.setState({ authenticated: false });
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
      this.setState({ authenticated: true });
    } else {
      GET(`${rootUrl}/account`)
        .then(
          res => {
            if (res.data.username) {
              console.log('LOG IN SUCCESS, Retrieving user info...');
              store.set('user', { data: res.data });
              store.set('isAuthenticated', true); // app wide checking
              this.setState({ authenticated: true, redirectToReferrer: true });
            } else {
              store.remove('user');
              store.remove('isAuthenticated');
              console.log('PLEASE LOG IN 1st');
            }
          })
        .catch(err => {
          console.log('ERROR IN CHECK checkAuth', err);
          store.remove('user');
          store.remove('isAuthenticated');
          store.each((value, key) => {
            console.log('WHATs IN STORE:', key, '==', value);
          });
        });
    }
  };

  handleLogClicked() {
    this.setState({ logClicked: true });
  }

  renderLogOrContinue() {
    if (this.state.authenticated) {
      return (
        <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-md-offset-1">
          <h3>Continue to Your Account:</h3>
          <Link to='/account'>Enter</Link>
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
  }

  render() {
    // location.state doesn't work here yet due to page
    // redirect from server when clicking log in instagram
    const { from } = this.props.location.state || { from: { pathname: '/account' } };
    if (this.state.redirectToReferrer) {
      return <Redirect to={from.pathname} />
    }

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
