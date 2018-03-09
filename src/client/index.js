import store from 'store';
import React from 'react';
import { render } from 'react-dom';
import Routing from './services/routing';

const { protocol, host, pathname } = window.location;

store.set('URL', {
  protocol,
  host,
  pathname,
  root_url: `${protocol}//${host}`,
});

if (process.env.NODE_ENV === 'production') {
  render(
    (
      <Routing />
    ), document.getElementById('App'),
  );
} else {
  const { AppContainer } = require('react-hot-loader'); // eslint-disable-line global-require
  const renderFn = Component => (
    render(
      (
        <AppContainer>
          <Component />
        </AppContainer>
      ), document.getElementById('App'),
    )
  );

  renderFn(Routing);

  if (module.hot) {
    module.hot.accept('./services/routing', () => {
      const NextApp = require('./services/routing').default; // eslint-disable-line global-require
      renderFn(NextApp);
    });
  }
}
