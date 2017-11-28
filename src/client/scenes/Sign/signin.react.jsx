import React, { Component } from 'react';
import axios from 'axios';
import store from 'store'

export default class Signin extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     error: null,
  //     isLoaded: false,
  //     user: [],
  //   }
  // }

  // componentDidMount() {
  //   axios.get(ROOT_URL + '/account')
  //     .then(
  //     (res) => {
  //       this.setState({
  //         isLoaded: true,
  //         user: res
  //       });
  //       const { history } = this.props;
  //       store.set('user', { username: res.username })
  //       console.log('IN SIGNIN, RES?', res);
  //       store.set('isAuthenticated', res.isAuthenticated);
  //       history.push('/account');
  //     },
  //     (err) => {
  //       this.setState({
  //         isLoaded: true,
  //         error: err
  //       });
  //     }
  //     );
  // }

  render() {
    return (
      <div className="container">
        <div className="signin">
        <h1>Welcome!</h1>
        <a href="/auth/instagram" className="btn btn-block btn-social btn-instagram">
          <span className="fa fa-instagram"></span> Sign in with Instagram
        </a>
        </div>
      </div>
    )
  }
}
