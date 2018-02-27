import React, { Component } from 'react';
import { GoogleProvider, GoogleDataChart } from 'react-analytics-widget';
import loadEmbedAnalytics from '../../services/loadEmbedAnalytics';

loadEmbedAnalytics();

const CLIENT_ID = '418887696773-5eg12mral6v45b8v9dpumopo2440reaf.apps.googleusercontent.com';

const last30days = {
  reportType: "ga",
  query: {
    dimensions: "ga:date",
    metrics: "ga:pageviews",
    "start-date": "30daysAgo",
    "end-date": "yesterday"
  },
  chart: {
    type: "LINE",
    options: {
      // options for google charts 
      // https://google-developers.appspot.com/chart/interactive/docs/gallery 
      title: "Last 30 days pageviews"
    }
  }
}

// graph 2 config 
const last7days = {
  reportType: "ga",
  query: {
    dimensions: "ga:date",
    metrics: "ga:pageviews",
    "start-date": "7daysAgo",
    "end-date": "yesterday"
  },
  chart: {
    type: "LINE"
  }
}

export default class Reports extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ids: 'ga:168623324'
    };

    this.renderGoogleData = this.renderGoogleData.bind(this);
  }

  renderGoogleData() {
    // analytics views ID 
    const views = {
      query: {
        ids: this.state.ids
      }
    }
    return (
      <GoogleProvider clientId={CLIENT_ID}>
        <GoogleDataChart views={views} config={last30days} />
        <GoogleDataChart views={views} config={last7days} />
      </GoogleProvider>
    )
  }
  
  render() {
    return (
      <div>
        <h1>Reports Overview</h1>
          {this.renderGoogleData()}
      </div>
    )
  }
};
