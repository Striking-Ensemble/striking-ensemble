import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/app.react';
import Routing from './services/routing'
render((
	<Router> 
		<Routing />
	</Router>
), document.getElementById('App'));
