import axios from 'axios';
import store from 'store';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import isAuthenticated from '../../services/isAuthenticated';
import LoadingSpinner from '../../components/loadingSpinner.react';
import LoadingBars from '../../components/loadingBars.react';
import FourOhFour from '../../components/fourOhFour.react';
import PayoutList from './payoutList.react';

export default class Billing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      payoutIsLoaded: false,
      balance: {},
      payoutList: [],
      commisions: 0,
      user: {},
    };

    this.handlePayoutNow = this.handlePayoutNow.bind(this);
    this.renderDashboard = this.renderDashboard.bind(this);
    this.renderStripeOnboarding = this.renderStripeOnboarding.bind(this);
    this.handleStripeDeactivate = this.handleStripeDeactivate.bind(this);
    this.renderPayoutList = this.renderPayoutList.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
  }

  componentDidMount() {
    if (!isAuthenticated()) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: { from: this.props.location },
          }}
        />
      );
    } else {
      if (!this.state.user.stripeAccountId) {
        axios.get(store.get('URL').root_url + '/account')
        .then((res) => {
          store.set('user', { data: res.data })
          this.setState({ user: store.get('user').data, isLoaded: true });
        })
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const rootUrl = store.get('URL').root_url;
    if (this.state.user != prevState.user) {
      axios.get(rootUrl + '/billing/stripe/payout-list')
        .then((res) => {
          console.log('MY PAYOUT LIST res.data', res.data);
          this.setState({ payoutList: res.data, payoutIsLoaded: true });
          return axios.get(rootUrl + '/billing/stripe/balance')
        })
        .then((res) => {
          console.log('balance obj is', res.data);
          this.setState({ balance: res.data });
          return axios.get('/billing/stripe/commision-info')
        })
        .then((res) => {
          console.log('commision amount is:', res.data);
          this.setState({ commisions: res.data });
        });
    }
  }

  handleTransfer(e) {
    e.preventDefault();
    axios.get(store.get('URL').root_url + '/billing/stripe/transfer-funds')
      .then((res) => {
        console.log('TESTY:', res.data);
      });
  }

  handlePayoutNow(e) {
    e.preventDefault();
    axios.post('/billing/stripe/payout')
      .then((response) => {
        console.log('billing payout:', response)
      })
      .catch(err => console.log(err))
  }

  handleStripeDeactivate(e) {
    e.preventDefault();
    axios.post('/billing/stripe/deactivate')
      .then((response) => {
        console.log('billing deactivate Stripe:', response);
        store.set('user', response);
        this.setState({ user: response.data });
      })
      .catch(err => console.log(err));
  }

  renderDashboard() {
    return (
      <header>
        <div>
          <div className="row">
            <div className="col-lg-1 col-md-1 col-sm-2 col-xs-3">
              <img src={this.state.user.profile_picture} className="img-responsive img-circle" alt="Profile" />
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-4">
              <h4>{this.state.user.username}</h4>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-5">
              <a href="/billing/stripe/transfers" className="btn btn-default">View Transfers</a>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-5">
              <h4><small>Available:</small> {this.state.balance.available ? `$ ${this.state.balance.available[0].amount.toFixed(2)}` : <LoadingBars />}</h4>
              <h4><small>Pending:</small> {this.state.balance.pending ? `$ ${this.state.balance.pending[0].amount.toFixed(2)}` : <LoadingBars />}</h4>
              <form method="post" onSubmit={this.handlePayoutNow}>
                <button className="btn btn-success" type="submit">Pay Out to Bank</button>
              </form>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-5">
              <h4><small>Commisions:</small> {this.state.commisions ? `${this.state.commisions}` : <LoadingBars />}</h4>
              <form method="post" onSubmit={this.handleTransfer}>
                <button className="btn btn-success" type="submit">Transfer Funds</button>
              </form>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-7">
              <form method="post" onSubmit={this.handleStripeDeactivate}>
                <button className="btn btn-danger" type="submit">Deactivate Stripe</button>
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
              <img src={this.state.user.profile_picture} className="img-responsive img-circle" alt="Profile" />
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-5">
              <h4>{this.state.user.username}</h4>
            </div>
            <a href="/billing/stripe/authorize" className="col-lg-2 col-md-2 col-sm-2 col-xs-5 btn btn-default">Connect Stripe</a>
          </div>
        </header>
      )
    } else {
      return this.renderDashboard();
    }
  }

  renderPayoutList() {
    return (
      <PayoutList
        payoutList={this.state.payoutList}
      />
    );
  }

  render() {
    if (this.state.error) {
      return (<FourOhFour />);
    }
    if (!this.state.isLoaded) {
      return <LoadingSpinner />;
    } else {
      return (
        <div>
          {this.renderStripeOnboarding()}
          <div className="row">
            <div className="table-responsive">
              {this.renderPayoutList()}
            </div>
          </div>
        </div>
      );
    }
  }
}
