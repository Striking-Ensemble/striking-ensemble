import React from 'react';
import { render } from 'react-dom';
import Routing from './services/routing';
import store from 'store';

const protocol = window.location.protocol,
	host = window.location.host,
	pathname = window.location.pathname;

store.set('URL', {
	protocol: protocol,
	host: host,
	pathname: pathname,
	root_url: `${protocol}//${host}`
});

if (process.env.NODE_ENV === 'production') {
	render((
		<Routing />
	), document.getElementById('App'))
} else {
	const { AppContainer } = require('react-hot-loader');
	const renderFn = Component => {
		render((
			<AppContainer>
				<Component />
			</AppContainer>
		), document.getElementById('App'));
	};

	renderFn(Routing);

	// Webpack Hot Module Replacement API
	if (module.hot) {
		module.hot.accept('./services/routing', () => {
			const NextApp = require('./services/routing').default;
			renderFn(NextApp);
		})
	};
};
