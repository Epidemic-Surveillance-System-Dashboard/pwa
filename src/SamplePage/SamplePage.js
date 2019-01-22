import React, { Component } from 'react'

import {Row, Col} from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './SamplePage.css';

import Visualizer from '../Visualizer/Visualizer'

let metric = {
    name: "Hello",
    value: 10,
    date: new Date ("November 1, 2018 00:00:00 GMT"),
}

class SamplePage extends Component {

    transform(rawData){
        let data = [
            {x: rawData.name, y: rawData.value},
        ]
        return data
    }

    render() {

        let barData = [
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,0,1).getTime()/1000, value: Math.random() * 1000},
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,1,1).getTime()/1000, value: Math.random() * 1000},
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,2,1).getTime()/1000, value: Math.random() * 1000},
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,3,1).getTime()/1000, value: Math.random() * 1000}
        ]

        let pieData = [
            {angle:50, label: "term 1", subLabel: "50%"},
            {angle:40, label: "term 2"},
            {angle:30, label: "term 3"},
            {angle:20, label: "term 4"},
            {angle:10, label: "term 5"},

        ]
        // let width = this.props.width ? this.props.width : 500
        // let height = this.props.height ? this.props.height : 500
        // let xDistance = this.props.xDistance ? this.props.xDistance : 100

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
                        <Visualizer data={barData} title = "Sample Metric Graph" type = "line"></Visualizer>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Visualizer data={barData} title = "Sample Set Graph (Distribution)" type = "histogram"></Visualizer>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Visualizer data={barData} title = "Sample Group (Sets of Sets) Graph" type = "multiplebar"></Visualizer>
                    </Col>

                </Row>         
            </div>
        );
    }
}

export default SamplePage;
