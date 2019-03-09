import React, { Component } from 'react';

//Routing
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

//antd for ui components
import { Drawer, Icon, Layout, Menu } from 'antd'

//Nav Bar
import NavigationMenu from './NavigationMenu/NavigationMenu'

//pages
import Dashboard from './Dashboard/Dashboard'
import SampleHome from './SampleHome/SampleHome'
import Account from './Account/Account'
import User from './Users/Users'
import Sync from './Sync/Sync'
import Analysis from './Analysis/Analysis'

import userService from './Services/User'

import './App.css';

const {
	Header, Footer, Content,
} = Layout;

const pathNamesAndTitles = {
	"/": "Home",
	"/account": "Account",
	"/dashboard": "Dashboard",
	"/analysis": "Analysis",
	"/users"	: "Users",
	"/sync"		: "Synchronize Data"
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

	closerDrawer = () => {
		this.setState({
			drawerOpen: false,
		})
	}

	componentWillMount(){
        userService.user().then((userObj) => {
			this.setState({
				user: userObj
			})
			//console.log(this.state.user.UserType);
        });
	}

	updateDrawer = () => {
		return userService.user().then((result) => {
			this.setState({
				user: result
			})
		});
	}
	
	logout = async () =>{
		this.setState({
			user: null
		});
		await userService.logout();
	}

	render() {
		return (
			<Router>
				<Layout>
					{this.state.user == null? "" :
					<Drawer
						title="Menu"
						placement="left"
						closable={true}
						onClose={this.closerDrawer}
						visible={this.state.drawerOpen}>
						<Menu
							onClick={this.closerDrawer}>
							<Menu.Item key="1">
								<Link to="/">
									<Icon type="home" />Home
								</Link>
							</Menu.Item>
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
								<Link to="/account">
									<Icon type="user" />Account
								</Link>
							</Menu.Item>
							{
								this.state.user != null && this.state.user.UserType != "admin" ? "": 
								<Menu.Item key="4">
									<Link to="/users">
										<Icon type="team" />Users
									</Link>
								</Menu.Item>
							}
							<Menu.Item key="5">
								<Link to="/sync">
									<Icon type="sync" />Synchronize Data
								</Link>
							</Menu.Item>
							{this.state.user == null? "":
							<Menu.Item key="6" onClick={this.logout}>
								<Link to="/">
									<Icon type="logout" />Logout
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
					<Content>
						<Route exact path="/" render={(props) => <SampleHome {...props} updateDrawer={this.updateDrawer} />} />
						<Route path="/dashboard" component={Dashboard} />
						<Route path="/analysis" component={Analysis} />
						<Route path="/account" component={Account} />
						<Route path="/users" component={User} />
						<Route path="/sync" component={Sync} />
					</Content>
					<Footer>Footer goes here. Open source project. Credits. React. Ant Design. Capstone.</Footer>
				</Layout>
			</Router>
		);
	}
}

export default App;
