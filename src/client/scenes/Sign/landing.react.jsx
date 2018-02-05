import React, { Component } from 'react';
import LoadingBars from '../../components/loadingBars.react';
import Footer from '../../components/footer.react';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logClicked: false
    }
    this.handleLogClicked = this.handleLogClicked.bind(this);
  }

  handleLogClicked() {
    this.setState({ logClicked: true });
  }

  render() {
    return (
      <div id="page-outer">
        <div id="main" className="container">
          <div className="jumbotron">
            <div className="row page-header">
              <img src="/public/assets/images/striking_ensemble_logo.png" className="col-lg-2 col-lg-offset-3 col-md-3 col-md-offset-2 col-sm-3 col-sm-offset-1 col-xs-4 col-xs-offset-4" alt='SE_Logo' />
              <h1 className="col-md-4 col-sm-8 col-xs-12">Striking Ensemble</h1>
            </div>
            <h3>Join Striking Ensemble now and headline your social media posts with retail products to give them easy checkout process for your followers.</h3> 
          </div>
          <div className="row">
            <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-md-offset-1">
              <h3>Synchronize your Instagram posts here:</h3>
              <a href="/auth/instagram" onClick={this.handleLogClicked} className="btn btn-block btn-lg btn-social btn-instagram">
                <span className="fa fa-instagram"></span>
                {this.state.logClicked ? <LoadingBars /> : `Sign in with Instagram`}
              </a>
            </div>
            <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-md-offset-1">
              <h3>Check Out Our Influencers!</h3>
              <a href="/influencer-list" className="btn btn-default btn-lg">
                <span className="glyphicon glyphicon-user" aria-hidden="true"></span> Influencers Portal
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
