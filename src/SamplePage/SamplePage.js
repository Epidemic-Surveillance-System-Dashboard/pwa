import React, { Component } from 'react'

import {Row, Col} from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './SamplePage.css';

import Visualizer from '../Visualizer/Visualizer'

class SamplePage extends Component {

    render() {
        return (
            <div className="sampleApp">
                <Row>
                    <p>
                        This contains sample graphs. 
                        This is a work in progress.
                    </p>
                </Row>
                <Row>
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

export default SamplePage;
