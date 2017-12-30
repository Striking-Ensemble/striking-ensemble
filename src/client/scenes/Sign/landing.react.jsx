import React, { Component } from 'react';
import Footer from '../../components/footer.react';

export default class Landing extends Component {
  render() {
    return (
      <div id="page-outer">
        <div className="container">
        <div className="jumbotron">
          <h1>Welcome!</h1>
          <h3>Join Striking Ensemble now and headline your social media posts with retail products to give them easy checkout process for your followers.</h3> 
        </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-md-offset-1">
              <h3>Synchronize your Instagram posts here:</h3>
              <a href="/auth/instagram" className="btn btn-block btn-lg btn-social btn-instagram">
                <span className="fa fa-instagram"></span> Sign in with Instagram
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
        <div className="the-void">
          <div className="jumbotron" style={{height: '19vh', backgroundColor: 'white'}}>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
