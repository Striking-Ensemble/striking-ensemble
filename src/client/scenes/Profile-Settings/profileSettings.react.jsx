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
      <form className="form-horizontal">
        <div className="box-it">
          <h3>Company Info</h3>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="businessName">Business Name<span className="help-block">(If none, provide your full name)</span></label>
                <div className="col-md-9 col-sm-9">
                  <input type="text" className="form-control" placeholder="Jane Doe" aria-describedby="helpBlock" required />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="legalEntityType">Legal Entity Type</label>
                <div className="col-md-9 col-sm-9">
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
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="socialSecurity">Social Security</label>
                <div className="col-md-9 col-sm-9">
                  <input type="password" className="form-control" id="socialSecurity" placeholder="xxx-xx-xxxx" required />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="retypeSocialSecurity">Re-type Social Security</label>
                <div className="col-md-9 col-sm-9">
                  <input type="password" className="form-control" id="retypeSocialSecurity" placeholder="xxx-xx-xxxx" required />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="taxForm">Tax Form</label>
                <div className="col-md-9 col-sm-9">
                  <select className="form-control">
                    <option>Please Select</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-lg-offset-1 col-md-6 col-sm-6">
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="address">Address</label>
                <div className="col-md-9 col-sm-9">
                  <input type="text" className="form-control" id="addressInput" placeholder="1234 GoldFish St" required/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="address2">Address 2<span id="helpBlock" className="help-block">(Optional)</span></label>
                <div className="col-md-9 col-sm-9">
                  <input type="text" className="form-control" id="address2Input" placeholder="Apt. 101" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="city">City</label>
                <div className="col-md-9 col-sm-9">
                  <input type="text" className="form-control" id="cityInput" placeholder="Bakedfield" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="postalCode">Postal Code</label>
                <div className="col-md-9 col-sm-9">
                  <input type="text" className="form-control" id="postalCodeInput" placeholder="12345" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="phone">Phone</label>
                <div className="col-md-9 col-sm-9">
                  <input type="number" className="form-control" id="phoneInput" placeholder="(123) 456-7890" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-it">
          <h3>Contact Info</h3>
          <div className="row">
            <div className="col-lg-5 col-lg-offset-1 col-md-6 col-sm-6">
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="firstName">First Name</label>
                <div className="col-md-9 col-sm-9">
                  <input type="text" className="form-control" id="firstNameInput" placeholder="Jane" required />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="lastName">Last Name</label>
                <div className="col-md-9 col-sm-9">
                  <input type="text" className="form-control" id="lastNameInput" placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="email">Email</label>
                <div className="col-md-9 col-sm-9">
                  <input type="email" className="form-control" id="emailInput" placeholder="janedoe@email.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="securityQuestion">Security Question</label>
                <div className="col-md-9 col-sm-9">
                  <select className="form-control">
                    <option>Please Select</option>
                    <option>What is your pet's name?</option>
                    <option>What was the name of your first school?</option>
                    <option>Who was your childhood hero?</option>
                    <option>What is your favorite pastime?</option>
                    <option>What is your all-time favorite sports team?</option>
                    <option>What is your father's middle name?</option>
                    <option>What was your high school mascot?</option>
                    <option>What make was your first car?</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 col-sm-3 col-xs-8" htmlFor="phone">Answer</label>
                <div className="col-md-9 col-sm-9">
                  <input type="text" className="form-control" id="answerInput" />
                </div>
              </div>
            </div>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox" /><span> I have read and accept the terms of the Influencer Membership Agreement</span>
            </label>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox" /><span> I am 18 years of age or older</span>
            </label>
          </div>
        </div>
        <div className="row">
          <button type="submit" className="btn btn-success center-block">Save</button>
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
