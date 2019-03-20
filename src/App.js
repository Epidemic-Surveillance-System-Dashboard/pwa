import React, { Component } from 'react';

//Routing
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

//antd for ui components
import { Drawer, Icon, Layout, Menu, Divider } from 'antd'

//Nav Bar
import NavigationMenu from './NavigationMenu/NavigationMenu'

//pages
import Dashboard from './Dashboard/Dashboard'
import SampleHome from './SampleHome/SampleHome'
import Account from './Account/Account'
import User from './Users/Users'
import Sync from './Sync/Sync'
import Analysis from './Analysis/Analysis'
import DataQuality from './DataQuality/DataQuality'

import userService from './Services/User'

import './App.css';
import Login from './Login/Login';

const {
	Header, Footer, Content,
} = Layout;

const pathNamesAndTitles = {
	"/": "Dashboard",
	"/account": "Account",
	"/dashboard": "Dashboard",
	"/analysis": "Analysis",
	"/users": "Users",
	"/sync": "Synchronize Data",
	"/health": "Data Health"
}

class App extends Component {

	getTitle = () => {
		let pathName = window.location.pathname
		if (pathName in pathNamesAndTitles) return pathNamesAndTitles[pathName]
		return "Hmm...this page has no title"
	}

	state = {
		drawerOpen: false,
		user: null
	}

	openDrawer = () => {
		this.setState({
			drawerOpen: true,
		})
	}

	closeDrawer = () => {
		this.setState({
			drawerOpen: false,
		})
	}

	componentWillMount() {
		userService.user().then((userObj) => {
			this.setState({
				user: userObj
			})
		});
	}

	updateDrawer = () => {
		return userService.user().then((result) => {
			this.setState({
				user: result
			})
		});
	}

	logout = async () => {
		this.setState({
			user: null
		});
		await userService.logout();
	}

	render() {
		return (
			<Router>
				<Layout>
					{this.state.user == null ? "" :
						<Drawer
							title="Menu"
							placement="left"
							closable={true}
							onClose={this.closeDrawer}
							visible={this.state.drawerOpen}>
							<Menu
								onClick={this.closeDrawer}>
								<Menu.Item key="2">
									<Link to="/dashboard">
										<Icon type="area-chart" />Dashboard
									</Link>
								</Menu.Item>
								<Menu.Item key="3">
									<Link to="/analysis">
										<Icon type="stock" />Analysis
										</Link>
								</Menu.Item>
								<Menu.Item key="4">
									<Link to="/health">
										<Icon type="heart" />Data Health
									</Link>
								</Menu.Item>
								<Menu.Item key="5">
									<Link to="/account">
										<Icon type="user" />Account
								</Link>
								</Menu.Item>
								{
									this.state.user !== null && this.state.user.UserType !== "admin" ? "" :
										<Menu.Item key="6">
											<Link to="/users">
												<Icon type="team" />Users
									</Link>
										</Menu.Item>
								}
								<Menu.Item key="7">
									<Link to="/sync">
										<Icon type="sync" />Synchronize Data
								</Link>
								</Menu.Item>
								{this.state.user == null ? "" :
									<Menu.Item key="8" onClick={this.logout}>
										<Link to="/">
											<Icon type="poweroff" />Logout
								</Link>
									</Menu.Item>
								}
							</Menu>
						</Drawer>
					}
					<Header style={{ padding: 0 }}>
						<NavigationMenu
							drawerOpen={this.state.drawerOpen}
							openDrawer_f={this.openDrawer}
							title={this.getTitle()}>
						</NavigationMenu>
					</Header>
					<Content className="min-height-wrapper">
						<Route exact path="/" render={(props) => <SampleHome {...props} updateDrawer={this.updateDrawer} />}/>
						<Route path="/dashboard" component={Dashboard} />
						<Route path="/analysis" component={Analysis} />
						<Route path="/account" component={Account} />
						<Route path="/users" component={User} />
						<Route path="/sync" component={Sync} />
						<Route path="/health" component={DataQuality} />
					</Content>
					<Footer>
						<p>
							ESSD is an <a href = "https://github.com/Epidemic-Surveillance-System-Dashboard/" target = "_blank" rel="noopener noreferrer">open source capstone project</a> by Aayush Bahendwar, Jackie Ngo, Laban Lin, and Patrick Lee.
						</p>
						<p>
							It is built with components by 
							<a href = "https://ant.design/" target = "_blank" rel="noopener noreferrer"> Ant Financial </a>
							and powered by 
							<a href = "https://reactjs.org/" target = "_blank" rel="noopener noreferrer"> React</a>.
						</p>
					</Footer>
				</Layout>
			</Router>
		);
	}
}

export default App;
