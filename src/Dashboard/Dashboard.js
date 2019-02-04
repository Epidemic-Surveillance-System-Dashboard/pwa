import React, { Component } from 'react'

import {Row, Col, Radio} from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './Dashboard.css'

import Visualizer from '../Visualizer/Visualizer'

class Dashboard extends Component {

    state = {
        fullSize: true
    }

    fullSizeOrListChanged = (e) =>{
        this.setState({fullSize: e.target.value === "0" ? false: true})
        console.log(e.target.value === "0" ? false: true)
    }

    render() {
        return (
            <div className="sampleApp">
                <Row className="rowVMarginSm">
                    <p>
                        This contains sample graphs. 
                        This is a work in progress.
                    </p>
                </Row>
                <Row className="rowVMarginSm">
                    <Col xs={{ span: 24, offset: 0 }} md={{ span: 12, offset: 6 }} lg = {{span: 8, offset: 8}}>
                    <Radio.Group defaultValue="1" buttonStyle="solid" onChange = {this.fullSizeOrListChanged}>
                        <Radio.Button value="1">View Full Size</Radio.Button>
                        <Radio.Button value="0">View List</Radio.Button>
                    </Radio.Group>
                    </Col>
                </Row>
                <Row className="rowVMarginSm">
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Visualizer title = "Sample Metric Graph" type = "line"></Visualizer>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Visualizer title = "Sample Set Graph (Distribution)" type = "histogram"></Visualizer>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Visualizer title = "Sample Group (Sets of Sets) Graph" type = "multiplebar"></Visualizer>
                    </Col>

                </Row>         
            </div>
        );
    }
}

export default Dashboard;
