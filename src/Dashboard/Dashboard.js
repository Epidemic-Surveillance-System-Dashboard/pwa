import React, { Component } from 'react'

import {Button,List, Card, Row, Col, Radio} from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './Dashboard.css'

import Visualizer from '../Visualizer/Visualizer'

const graphExamples = [
    {
        title: "Metric Ex | Malaria Vaccinations",
        location: "Ward 1",
        type: "metric"
    },
    {
        title: "Set Ex | Malaria Vaccinations - Male",
        location: "Ward 2",
        type: "set"
    },
    {
        title: "Group Ex | Malaria Vaccinations - Male and Female",
        location: "Ward 3",
        type: "group"
    },

]

class Dashboard extends Component {

    state = {
        fullSize: true
    }

    fullSizeOrListChanged = (e) =>{
        this.setState({fullSize: e.target.value === "0" ? false: true})
    }

    showSingleGraph = (key) =>{

    }

    renderGraphs = () =>{
        if (this.state.fullSize){

            let components = []
            for (let i = 0; i < graphExamples.length; i++){
                components.push(
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} key = {components.length}>
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

        }else{
            return (
                <Card className = "left" size ="small">
                    <List
                        itemLayout="horizontal"
                        dataSource = {graphExamples}
                        renderItem = {item =>(
                            <List.Item actions = {[<Button>View</Button>]}>
                                <List.Item.Meta
                                title = {item.title}
                                description = {item.location}/>

                            </List.Item>
                        )}>
                    </List>
                </Card>
            )
        }
    }

    render() {
        return (
            <div className="center">
                <Row className={`rowVMarginSm rowVMarginTopSm`}>
                    <Col xs={{ span: 24, offset: 0 }} md={{ span: 12, offset: 6 }} lg = {{span: 8, offset: 8}}>
                    <Radio.Group defaultValue="1" buttonStyle="solid" onChange = {this.fullSizeOrListChanged}>
                        <Radio.Button value="1">View Full Size</Radio.Button>
                        <Radio.Button value="0">View List</Radio.Button>
                    </Radio.Group>
                    </Col>
                </Row>
                <Row className="rowVMarginSm">
                    {this.renderGraphs()}
                </Row>         
            </div>
        );
    }
}

export default Dashboard;
