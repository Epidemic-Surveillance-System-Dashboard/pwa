import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SamplePage from './SamplePage/SamplePage'
import SampleHome from './SampleHome/SampleHome'
import './App.css';

class App extends Component {
	render() {
		return (
			<div>
				<Router>
					<div>
						<ul>
							<li><Link to="/">Home</Link></li>
							<li><Link to="/samplePage">Sample Page</Link></li>
						</ul>
						<Route exact path="/" component={SampleHome} />
						<Route path="/samplePage" component={SamplePage} />
					</div>
				</Router>	
			</div>
		);
	}
}

export default App;
