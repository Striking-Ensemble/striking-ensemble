import axios from 'axios';
import store from 'store';
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import LoadingSpinner from '../../components/loadingSpinner.react';
import FourOhFour from '../../components/fourOhFour.react';
import Navigation from '../../components/navigation.react';
import isAuthenticated from '../../services/isAuthenticated';

export default class Billing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      user: {}
    }

    this.handlePayoutNow = this.handlePayoutNow.bind(this);
    this.renderDashboard = this.renderDashboard.bind(this);
    this.renderStripeOnboarding = this.renderStripeOnboarding.bind(this);
  }

  componentDidMount() {
    if (!isAuthenticated()) {
      return (<Redirect to={{
        pathname: '/login',
        state: { from: this.props.location }
      }} />)
    } else {
      if (!this.state.user.stripeAccountId) {
        axios.get(store.get('URL').root_url + '/account')
        .then(res => {
          store.set('user', { data: res.data })
          this.setState({ user: store.get('user').data, isLoaded: true });
        })
      }
    }
  }

  handlePayoutNow(e) {
    e.preventDefault();
    axios.post('/billing/stripe/payout')
    .then(response => {
      console.log('billing payout:', response)
    })
    .catch(err => console.log(err))
  }

  renderDashboard() {
    return (
      <header>
        <div>
          <div className="row">
            <div className="col-lg-1 col-md-1 col-sm-2 col-xs-3">
              <img src={this.state.user.profile_picture} className="img-responsive img-circle" />
            </div>
            <div className="col-lg-1 col-md-2 col-sm-2 col-xs-4">
              <h4>{this.state.user.username}</h4>
            </div>
            <div className="col-lg-1 col-md-2 col-sm-2 col-xs-3">
              <a href="/billing/stripe/transfers" className="btn btn-default">View Transfers</a>
              <form method="post" onSubmit={this.handlePayoutNow}>
                <button className="btn btn-success" type="submit">Pay Out Now</button>
              </form>
            </div>
          </div>
        </div>
      </header>
    );
  }
  renderStripeOnboarding() {
    if (!this.state.user.stripeAccountId) {
      return (
        <header>
          <div className="row">
            <div className="col-lg-1 col-md-1 col-sm-2 col-xs-3">
              <img src={this.state.user.profile_picture} className="img-responsive img-circle" />
            </div>
            <div className="col-lg-1 col-md-2 col-sm-2 col-xs-5">
              <h4>{this.state.user.username}</h4>
            </div>
            <a href="/billing/stripe/authorize" className="col-lg-1 col-md-2 col-sm-2 col-xs-5 btn btn-default">Connect Stripe</a>
          </div>
        </header>
      )
    } else {
      return this.renderDashboard();
    }
  }

  render() {
    if (this.state.error) {
      return (<FourOhFour />)
    }
    if (!this.state.isLoaded) {
      return <LoadingSpinner />
    } else {
      return this.renderStripeOnboarding();
    }
  }
};
