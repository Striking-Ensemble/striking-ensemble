import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
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

render((
	<Router>
		<Routing />
	</Router>
), document.getElementById('App'));
