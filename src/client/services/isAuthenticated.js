import store from 'store';

export default function isAuthenticated() {
  return !!store.get('isAuthenticated');
};
