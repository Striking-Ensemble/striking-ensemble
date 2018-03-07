import React, { Component } from 'react';
import axios from 'axios';
import store from 'store';
import LoadingSpinner from '../../components/loadingSpinner.react';
import { Table, TableRow } from '../../components/tables.react';

export default class Reports extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ready: false,
      productData: {}
    };

    this.queryReportBuilder = this.queryReportBuilder.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.renderTHeaders = this.renderTHeaders.bind(this);
    this.renderTCell = this.renderTCell.bind(this);
  }

  componentDidMount() {
    const rootUrl = store.get('URL').root_url;
    /** 
     * Pie query sample
     *  query: {
          dimensions: "ga:productName",
          metrics: "ga:itemQuantity",
          filters: `ga:productCouponCode=@${this.props.user.affiliateLink}`,
          "start-date": "30daysAgo",
          "end-date": "yesterday"
        },
    */

    let queryTable = this.queryReportBuilder(
      this.props.user.affiliateLink,
      "ga:productBrand,ga:productName",
      "ga:itemQuantity,ga:itemRevenue,ga:calcMetric_Commisions",
      "30daysAgo",
      "yesterday"
    );

    axios.post(`${rootUrl}/reports/affiliate`, queryTable)
      .then(res => {
        const { columnHeaders, rows, totalsForAllResults } = res.data;
        this.setState({ ready: true, productData: {columnHeaders, rows, totalsForAllResults} });
      })
      .catch(err => {
      console.log('ERROR in REPORTS POST', err);
      });
  }

  /**
   * @method queryReportBuilder
   * 
   * @param {String} affiliateLink 
   * @param {String} dimensions 
   * @param {String} metrics 
   * @param {String} startDate 
   * @param {String} endDate
   *  
   * @returns {Object}
   */
  queryReportBuilder(affiliateLink, dimensions, metrics, startDate, endDate) {
    return {
      'affiliateLink': affiliateLink,
      'dimensions': dimensions,
      'metrics': metrics,
      'start-date': startDate,
      'end-date': endDate
    } 
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

    return this.state.productData.columnHeaders.map(item => {
      return (
        <th key={`index_${item.name}`}>
          {titleBuilder(item.name)}
        </th>
      )
    })
  }

  renderTCell() {
    return this.state.productData.rows.map((item, index) => {
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
      </div>
    )
  }
};
