import React from 'react';
import { Router } from 'react-router-dom';

import history from './../../service/history';
import Routes from './../../routes/index';

class App extends React.Component {
	render(){
		return (
		    <Router history={history}>
		      <Routes />
		    </Router>
  		);
	}
}

export default App;
