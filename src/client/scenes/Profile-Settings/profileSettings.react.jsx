import axios from 'axios';
import store from 'store';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import LoadingSpinner from '../../components/loadingSpinner.react';
import FourOhFour from '../../components/fourOhFour.react';
import Navigation from '../../components/navigation.react';
import isAuthenticated from '../../services/isAuthenticated';

export default class ProfileSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false
    }

    this.renderForm = this.renderForm.bind(this);
  }

  handleFormSubmit() {

  }

  renderForm() {
    return (
      <form>
        <div className="row">
          <div className="col-lg-4 col-lg-offset-1 col-md-6 col-sm-6">
            <div className="form-group">
              <label htmlFor="businessName">Business Name <span id="helpBlock" className="help-block">(If none, provide your full name)</span></label>
              <input type="text" className="form-control" placeholder="Jane Doe" aria-describedby="helpBlock" required />
            </div>
            <div className="form-group">
              <label htmlFor="legalEntityType">Legal Entity Type</label>
              <select className="form-control">
                <option>Please Select</option>
                <option>Individual</option>
                <option>Partnership</option>
                <option>Corporation</option>
                <option>Sole Proprietorship</option>
                <option>Other</option>
                <option>LLC</option>
                <option>LLP</option>
                <option>Non-Profit</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="socialSecurity">Social Security</label>
              <input type="password" className="form-control" id="socialSecurity" placeholder="xxx-xx-xxxx" required />
            </div>
            <div className="form-group">
              <label htmlFor="retypeSocialSecurity">Re-type Social Security</label>
              <input type="password" className="form-control" id="retypeSocialSecurity" placeholder="xxx-xx-xxxx" required />
            </div>
            <div className="form-group">
              <label htmlFor="taxForm">Tax Form</label>
              <select className="form-control">
                <option>Please Select</option>
              </select>
            </div>
          </div>
          <div className="col-lg-4 col-lg-offset-2 col-md-6 col-sm-6">
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" className="form-control" id="addressInput" placeholder="1234 GoldFish St" required/>
            </div>
            <div className="form-group">
              <label htmlFor="address2">Address 2<span id="helpBlock" className="help-block">(Optional)</span></label>
              <input type="text" className="form-control" id="address2Input" placeholder="Apt. 101" />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="email" className="form-control" id="cityInput" placeholder="Bakedfield" />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input type="text" className="form-control" id="postalCodeInput" placeholder="12345" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="number" className="form-control" id="phoneInput" placeholder="(123) 456-7890" />
            </div>
          </div>
        </div>
        <div className="row">
          <button type="submit" className="btn btn-success pull-right">Save</button>
        </div>
      </form>
    )
  }

  render() {
    if (this.state.error) {
      return (<FourOhFour />)
    }
    return this.renderForm();
  }
};
