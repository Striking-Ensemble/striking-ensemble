import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/app.react.jsx';
import Routing from './services/routing.js'
render((
	<Router> 
		<Routing />
	</Router>
), document.getElementById('App'));
