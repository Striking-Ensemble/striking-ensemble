import React, { Component } from 'react';
import { GoogleProvider, GoogleDataChart } from 'react-analytics-widget';
import loadEmbedAnalytics from '../../services/loadEmbedAnalytics';

loadEmbedAnalytics();

const CLIENT_ID = '418887696773-5eg12mral6v45b8v9dpumopo2440reaf.apps.googleusercontent.com';

export default class Reports extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ids: 'ga:168623324'
    };

    this.renderGoogleData = this.renderGoogleData.bind(this);
  }

  renderGoogleData() {
    const last30days = {
      reportType: "ga",
      query: {
        dimensions: "ga:productBrand,ga:productName",
        metrics: "ga:itemRevenue,ga:itemQuantity",
        filters: `ga:productCouponCode=@${this.props.user.affiliateLink}`,
        "start-date": "30daysAgo",
        "end-date": "yesterday"
      },
      chart: {
        type: "TABLE",
        options: {
          // options for google charts 
          // https://google-developers.appspot.com/chart/interactive/docs/gallery 
        }
      }
    };

    // graph 2 config 
    const last7days = {
      reportType: "ga",
      query: {
        dimensions: "ga:productName",
        metrics: "ga:itemQuantity",
        filters: `ga:productCouponCode=@${this.props.user.affiliateLink}`,
        "start-date": "7daysAgo",
        "end-date": "yesterday"
      },
      chart: {
        type: "PIE",
        options: {
          pieHole: "0.4",
          title: "Last 7 Days"
        }
      }
    };

    // analytics views ID 
    const views = {
      query: {
        ids: this.state.ids
      }
    };

    return (
      <GoogleProvider clientId={CLIENT_ID}>
        <h3>Last 30 Days</h3>
        <GoogleDataChart views={views} config={last30days} />
        <br />
        <h3>Unique Purchases per Product</h3>
        <GoogleDataChart views={views} config={last7days} />
      </GoogleProvider>
    )
  }
  
  render() {
    return (
      <div>
        <h1>Product Summary</h1><p className="small text-info" data-toggle="tooltip" data-placement="bottom" title="Out-of-stock and/or cancelled items may be included within the data presented">* Raw values are displayed</p>
          {this.renderGoogleData()}
      </div>
    )
  }
};
