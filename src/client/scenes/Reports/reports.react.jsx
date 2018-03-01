import React, { Component } from 'react';
import axios from 'axios';
import store from 'store';
import LoadingSpinner from '../../components/loadingSpinner.react';
import { GoogleProvider, GoogleDataChart } from 'react-analytics-widget';
import loadEmbedAnalytics from '../../services/loadEmbedAnalytics';
import { Table, TableRow } from '../../components/tables.react';

loadEmbedAnalytics();

const CLIENT_ID = '418887696773-5eg12mral6v45b8v9dpumopo2440reaf.apps.googleusercontent.com';

export default class Reports extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ids: 'ga:168623324',
      ready: false,
      data: {}
    };

    this.renderGoogleData = this.renderGoogleData.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.renderTHeaders = this.renderTHeaders.bind(this);
    this.renderTCell = this.renderTCell.bind(this);
  }

  componentDidMount() {
    const rootUrl = store.get('URL').root_url;
    axios.post(`${rootUrl}/reports/affiliate`, { affiliateLink: this.props.user.affiliateLink })
      .then(res => {
        const { columnHeaders, rows, totalsForAllResults } = res.data;
        this.setState({ ready: true, data: {columnHeaders, rows, totalsForAllResults} });
      })
      .catch(err => {
      console.log('ERROR in REPORTS POST', err);
      });
  }

  renderGoogleData() {
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
          // options for google charts 
          // https://google-developers.appspot.com/chart/interactive/docs/gallery
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
        <h3>Unique Purchases per Product</h3>
        <GoogleDataChart views={views} config={last7days} />
      </GoogleProvider>
    )
  }

  renderTable() {
    return (
      <div className="table-responsive">
        <Table className="table table-hover">
          <thead>
            <tr>
              {this.renderTHeaders()}
            </tr>
          </thead>
          <tbody className="table-striped">
            {this.renderTCell()}
          </tbody>
        </Table>
      </div>
    )
  }

  renderTHeaders() {
    // capitalize every first letter of the word
    const titleBuilder = (str) => {
      let jointWord = str.slice(3);
      if (jointWord.indexOf('_') !== -1) {
        return jointWord.slice(jointWord.indexOf('_') + 1);
      } else {
        const strArr = jointWord.split('');
        let foundCap = false,
            i = 0,
            firstWord, 
            secondWord;

        while (!foundCap) {
          let current = strArr[i];
          if (current == current.toUpperCase()) {
            firstWord = strArr[0].toUpperCase() + strArr.slice(1, i).join('');
            secondWord = strArr.slice(i).join('');
            foundCap = true;
          }
          i++
        }
        return firstWord.concat(' ', secondWord);
      }
    }

    return this.state.data.columnHeaders.map(item => {
      return (
        <th key={`index_${item.name}`}>
          {titleBuilder(item.name)}
        </th>
      )
    })
  }

  renderTCell() {
    return this.state.data.rows.map((item, index) => {
      return (
        <TableRow key={`row_${index}`}>
          {item.map((value, index) => (<td key={`index_${value}_${index}`}>{value}</td>))}
        </TableRow>
      )
    })
  }
  
  render() {
    return (
      <div>
        <h1>Product Summary</h1><p className="small text-info" data-toggle="tooltip" data-placement="bottom" title="Out-of-stock and/or cancelled items may be included within the data presented">* Raw values are displayed</p>
        {this.state.ready ? this.renderTable() : <LoadingSpinner /> }
        {this.renderGoogleData()}
      </div>
    )
  }
};
