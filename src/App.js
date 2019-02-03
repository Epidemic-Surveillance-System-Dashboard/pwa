import React, { Component } from 'react';

//Routing
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//antd for ui components
import { Icon, Layout, Menu } from 'antd';


//pages
import SamplePage from './SamplePage/SamplePage'
import SampleHome from './SampleHome/SampleHome'

import './App.css';

const {
	Header, Footer, Sider, Content,
} = Layout;

class App extends Component {

	state = {
		siderCollapsed: true
	}

	toggleSider = () => {
		console.log("hi")
		this.setState({
			siderCollapsed: !this.state.siderCollapsed,
		});
	}


	render() {
		return (
			<Router>
				<Layout>
					<Sider collapsible onCollapse={this.collapse} collapsed={this.state.siderCollapsed} trigger={null} collapsedWidth={0}>
						<Menu>
							<Menu.Item>Hello</Menu.Item>
							<Menu.Item>World</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Header style={{ background: '#fff', padding: 0 }}>


							<Menu
								theme="dark"
								mode="horizontal"
								// defaultSelectedKeys={['1']}
								style={{ lineHeight: '64px' }}
							>
								<Menu.Item key="0">
									<Icon
									className="trigger"
									type={this.state.siderCollapsed ? 'menu-unfold' : 'menu-fold'}
									onClick={this.toggleSider} />
								</Menu.Item>
								<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
								<Menu.Item key="2"><Link to="/samplePage">Sample Graphs</Link></Menu.Item>
							</Menu>
						</Header>
						<Content>
							<Route exact path="/" component={SampleHome} />
							<Route path="/samplePage" component={SamplePage} />
						</Content>
						<Footer>Footer goes here. Open source project. Credits. </Footer>
					</Layout>

				</Layout>
			</Router>
		);
	}
}

export default App;
