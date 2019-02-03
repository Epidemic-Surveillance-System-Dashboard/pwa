import React, { Component } from 'react';

//Routing
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import {withRouter } from "react-router-dom"

//antd for ui components
import { Button, Icon, Layout, Menu } from 'antd'

//Nav Bar
import NavigationMenu from './NavigationMenu/NavigationMenu'

//pages
import SamplePage from './SamplePage/SamplePage'
import SampleHome from './SampleHome/SampleHome'

import './App.css';

const {
	Header, Footer, Sider, Content,
} = Layout;

const pathNamesAndTitles = {
	"/" 			: "Home",
	"/dashboard" 	: "Dashboard"
}

class App extends Component {

	getTitle = () =>{
		let pathName = window.location.pathname
		if (pathName in pathNamesAndTitles) return pathNamesAndTitles[pathName]
		return "Hmm...this page has no title"
	}

	state = {
		siderCollapsed: true
	}

	siderCallback = () =>{
		//React-vis needs to be explicitly told to update its width after the sidebar is closed
		if (this.state.siderCollapsed === true) window.dispatchEvent(new Event('resize'));
	}

	toggleSider = () => {
		this.setState({
			siderCollapsed: !this.state.siderCollapsed,
		},this.siderCallback)
	}

	closeSider = () =>{
		this.setState({
			siderCollapsed: true
		},this.siderCallback)
	}

	onSetSidebarOpen = () =>{
		this.setState({
			siderCollapsed: false
		}, this.siderCallback)
	}

	render() {
		return (
			<Router>
				<Layout>
					<Sider collapsible 
						onCollapse={this.collapse} 
						collapsed={this.state.siderCollapsed} 
						trigger={null} 
						width = {250} 
						collapsedWidth={0}
						theme = "light">
						<Menu
							onClick = {this.closeSider}>
							<Menu.Item key="1">
								<Link to="/">
									<Icon type="home"/>Home
								</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/dashboard">
									<Icon type="area-chart"/>Dashboard
								</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Header style={{padding: 0 }}>
							<NavigationMenu 
								siderCollapsed = {this.state.siderCollapsed}
								toggleSider_f = {this.toggleSider}
								title = {this.getTitle()}>
							</NavigationMenu>
						</Header>
						<Content>
							<Route exact path="/" component={SampleHome} />
							<Route path="/dashboard" component={SamplePage} />
						</Content>
						<Footer>Footer goes here. Open source project. Credits. </Footer>
					</Layout>

				</Layout>
			</Router>
		);
	}
}

export default App;
