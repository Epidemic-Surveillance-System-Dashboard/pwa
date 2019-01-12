import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';


import SamplePage from './SamplePage/SamplePage'
import SampleHome from './SampleHome/SampleHome'
import './App.css';

const styles = {
	root: {
	  width: 500,
	},
};

class App extends Component {

	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};
	

	render() {

		const { classes } = this.props;
		const { value } = this.state;
		
		return (
			<div>
			<BottomNavigation
				value={value}
				onChange={this.handleChange}
				showLabels
				className={classes.root}
		  	>
				<BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
				<BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
				<BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
		  	</BottomNavigation>

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

export default withStyles(styles)(App);
