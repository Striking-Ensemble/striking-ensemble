import store from 'store';
import axios from 'axios';

const checkCredentials = (props) => {
  const { history } = props;
  return axios.get(store.get('URL').root_url + '/account')
  .then(
    res => {
      console.log('are we even???????????????');
      // If res URL is a redirect to /login, set login to true
      // this will render Signin scene
      // if (res.request.responseURL === store.get('URL').root_url + '/login') {
      //   this.setState({ loggedIn: true }); // this will throw a warning due to redirect to another component
      if (res.data.username) {
        store.set('user', {
          data: res.data
        });
        store.set('isAuthenticated', true);
        // store.set('user', { username: res.data.username });
        history.push('/');
        console.log('ARE WE CLEAR in CRED?', store.get('user'));
      }
    })
    .catch(err => {
      console.log('BUT ISS ITTT??');
      console.log(err);
      store.each((value, key) => {
        console.log('WHATs IN STORE:', key, '==', value);
      });
      history.replace({ pathname: '/login' });
    });
};

export default checkCredentials;
