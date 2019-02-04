import React, { Component } from 'react'

import {Card, Row, Col, Radio} from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './Dashboard.css'

import Visualizer from '../Visualizer/Visualizer'

const graphExamples = [
    {
        title: "Metric Ex | Malaria Vaccinations",
        type: "metric"
    },
    {
        title: "Set Ex | Malaria Vaccinations - Male",
        type: "set"
    },
    {
        title: "Group Ex | Malaria Vaccinations - Male and Female",
        type: "group"
    },

]

class Dashboard extends Component {

    state = {
        fullSize: true
    }

    fullSizeOrListChanged = (e) =>{
        this.setState({fullSize: e.target.value === "0" ? false: true})
        console.log(e.target.value === "0" ? false: true)
    }

    visualizationEx = () =>{

        //Switch here for graphs vs list view

        let components = []
        for (let i = 0; i < graphExamples.length; i++){
            components.push(
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="Visualizer">
                        <Card title={graphExamples[i].title} 
                            size="small" 
                            bodyStyle={{paddingLeft: 0, paddingRight:0}}
                            actions = {["View Related", "Edit"]}>
                            <Visualizer type = {graphExamples[i].type}></Visualizer>
                        </Card>
                    </div>
                    
                </Col>
            )
        }
        return components
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
                    {this.visualizationEx()}
                </Row>         
            </div>
        );
    }
}

export default Dashboard;
