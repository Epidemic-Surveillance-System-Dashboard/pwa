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

import './App.css';

const {
	Header, Footer, Content,
} = Layout;

const pathNamesAndTitles = {
	"/": "Home",
	"/account": "Account",
	"/dashboard": "Dashboard",
	"/users"	: "Users",
}

class App extends Component {

	getTitle = () => {
		let pathName = window.location.pathname
		if (pathName in pathNamesAndTitles) return pathNamesAndTitles[pathName]
		return "Hmm...this page has no title"
	}

	state = {
		drawerOpen: false
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

	render() {
		return (
			<Router>
				<Layout>
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
								<Link to="/account">
									<Icon type="user" />Account
								</Link>
							</Menu.Item>
							<Menu.Item key="4">
								<Link to="/users">
									<Icon type="team" />Users
								</Link>
							</Menu.Item>
						</Menu>
					</Drawer>
					<Header style={{ padding: 0 }}>
						<NavigationMenu
							drawerOpen={this.state.drawerOpen}
							openDrawer_f={this.openDrawer}
							title={this.getTitle()}>
						</NavigationMenu>
					</Header>
					<Content>
						<Route exact path="/" component={SampleHome} />
						<Route path="/dashboard" component={Dashboard} />
						<Route path="/account" component={Account} />
						<Route path="/users" component={User} />
					</Content>
					<Footer>Footer goes here. Open source project. Credits. React. Ant Design. Capstone.</Footer>
				</Layout>
			</Router>
		);
	}
}

export default App;
