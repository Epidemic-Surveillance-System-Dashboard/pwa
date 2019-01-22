import React, { Component } from 'react';

//Routing
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//antd for ui components
import { Layout, Menu } from 'antd';


//pages
import SamplePage from './SamplePage/SamplePage'
import SampleHome from './SampleHome/SampleHome'

import './App.css';

const {
		Header, Footer, Sider, Content,
	} = Layout;

class App extends Component {
	render() {
		return (
			<Router>
				<Layout>
					<Header className="header">

						<Menu
							theme="dark"
							mode="horizontal"
							// defaultSelectedKeys={['1']}
							style={{ lineHeight: '64px' }}
						>
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
			</Router>
		);
	}
}

export default App;
