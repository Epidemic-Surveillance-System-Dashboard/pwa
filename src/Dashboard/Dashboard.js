import React, { Component } from 'react'

import {Table, Button,List, Card, Row, Col, Radio} from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './Dashboard.css'

import VisualizerManager from '../Visualizer/VisualizerManager';
import CreateGraph from '../Graph/CreateGraph'

let graphExamples = [
    // {
    //     Title: "Facility Attendance Female, 29d-11 months",
    //     Location:{
    //         Name: "za Bagega Primary Health Centre",
    //         Id:  "1215",
    //         Type: "Facility"
    //     },
    //     Data:{
    //         Id: "11729",
    //         Type: "Metric",
    //     },
    //     Dates:{
    //         StartDate:new Date("2015-01-01T00:00:00.000Z"),
    //         EndDate: new Date("2015-12-01T00:00:00.000Z"),
    //     },
    //     GraphId: 0
    // },
    // {
    //     Title: "Facility Attendance Outpatient Value",
    //     Location:{
    //         Name: "za Bagega Primary Health Centre",
    //         Id:  "1215",
    //         Type: "Facility"
    //     },
    //     Data:{
    //         Id: "11493",
    //         Type: "Metric",
    //     },
    //     Dates:{
    //         StartDate:new Date("2015-01-01T00:00:00.000Z"),
    //         EndDate: new Date("2015-12-01T00:00:00.000Z"),
    //     },
    //     GraphId: 1
    // },
    // {
    //     Title: "Facility Attendance Outpatient",
    //     Location:{
    //         Name: "za Bagega Ward",
    //         Id:  "386",
    //         Type: "Ward"
    //     },
    //     Data:{
    //         Id: "2094",
    //         Type: "Set",
    //     },
    //     Dates:{
    //         StartDate:new Date("2015-01-01T00:00:00.000Z"),
    //         EndDate: new Date("2015-12-01T00:00:00.000Z"),
    //     },
    //     GraphId: 2
    // },
    {
        Title: "Facility Attendance Male",
        Location:{
            Name: "za Bagega Ward",
            Id:  "386",
            Type: "Ward"
        },
        Data:{
            Id: "2094",
            Type: "Set",
            TotalOrDistribution: "distribution"
        },
        Dates:{
            StartDate:new Date("2015-01-01T00:00:00.000Z"),
            EndDate: new Date("2015-12-01T00:00:00.000Z"),
        },
        GraphId: 3
    },
    {
        Title: "Facility Attendance Male",
        Location:{
            Name: "za Bagega Primary Health Centre",
            Id:  "1215",
            Type: "Facility"
        },
        Data:{
            Id: "2094",
            Type: "Set",
            TotalOrDistribution: "distribution"
        },
        Dates:{
            StartDate:new Date("2015-01-01T00:00:00.000Z"),
            EndDate: new Date("2015-12-01T00:00:00.000Z"),
        },
        GraphId: 4
    }
]

const metricTableColumns = [
    {
        title: "Metric Tracked",
        key: "metricTracked",
        dataIndex:"metric",
        defaultSortOrder: 'descend',
        sorter: (a,b)=>{
            return b.metric.localeCompare(a.metric, "en")
        },
    },
    {
        title: "Change",
        key: "change",
        dataIndex:"change",
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
            return a.change - b.change
        },
        render: decimal => {
            return `${Math.round(decimal * 100)}%`
        }
    },

]

const metricData = [
    {
        key: '1',
        metric: "Malaria Vaccinations",
        change: 0.15
    },
    {
        key: '2',
        metric: "Tetanus Vaccinations",
        change: -.13
    },
    {
        key: '3',
        metric: "Measles Outbreaks",
        change: 0
    },
]

class Dashboard extends Component {

    state = {
        fullSize: true,
        reportCard: false,
        showGraphs: true,
        graphOpenCloseState: null,
    }

    componentWillMount(){

        //Create a record of all open/close states for the graphs
        let visiblity = {}
        for (let i = 0; i < graphExamples.length; i++){
            visiblity[i] = {open: true, showInFilter: true}
        }
        visiblity["collapseOrExpandText"] = {text: "Collapse All"}
        this.setState({graphOpenCloseState: visiblity})
    }

    fullSizeOrListChanged = (e) =>{
        this.setState({fullSize: e.target.value === "0" ? false: true})
    }

    reportCardOrGraphsChanged = (e) =>{
        this.setState({reportCard: e.target.value === "0" ? false: true}, () =>{
            window.dispatchEvent(new Event ('resize'));
        })
    }

    toggleGraph = (key) =>{
        //Update the open/close state for this graph
        let copy = this.state.graphOpenCloseState
        let newVal = !copy[key].open
        copy[key] = {open: newVal}
        let anyOpen = false
        //Check if all graphs open
        for (let i = 0; i<Object.keys(copy).length-1; i++){
            if (i === key) continue
            if (copy[i].open === true) {
                anyOpen = true
                break
            }
        }
        if (anyOpen){
            copy["collapseOrExpandText"] = {text: "Collapse All"}
        }else{
            copy["collapseOrExpandText"] = {text: "Expand All"}
        }

        this.setState({graphOpenCloseState: copy})
    }

    toggleAllGraphs = () =>{
        //Set future state depending on what the button says
        //Probably not best practice but it works 
        let openState = this.state.graphOpenCloseState["collapseOrExpandText"].text === "Collapse All" ? false : true
        let copy = this.state.graphOpenCloseState
        for (let i = 0; i < Object.keys(copy).length-1; i++){
            copy[i].open = openState
        }
        copy["collapseOrExpandText"].text = openState ? "Collapse All" : "Expand All"
        this.setState({graphOpenCloseState: copy})
    }

    createCollapseExpandButton= (key) => {
        return(
            [<Button key = {0} onClick = {() =>{ this.toggleGraph(key)}}>{this.state.graphOpenCloseState[key].open ? "Collapse" : "Expand"}</Button>]
        )
    }

    renderGraphs = () =>{
        return (
                <List
                    itemLayout="vertical"
                    dataSource = {graphExamples}
                    renderItem = {(item, key) =>(
                        <List.Item >
                            <List.Item.Meta
                            title = {item.Title}
                            description = {item.Location.Name}/>
                            {this.createCollapseExpandButton(key)}

                            <VisualizerManager
                                {...item} //LocationId, Location, etc...
                                show = {this.state.graphOpenCloseState[key].open}
                            />

                        </List.Item>
                    )}>
                </List>
        )

    }

    showHideCreateGraphUI = () =>{
        this.setState({
            showGraphs: !this.state.showGraphs
        }, () =>{
            if (this.state.showGraphs){
                window.dispatchEvent(new Event ('resize'));
            }
        })
    }

    render() {
        return (
            <div className="center">

            {/* Example Visualizer Manager Use */}
           {/* <VisualizerManager
                locationId = "1215"
                locationType = "Facility"
                dataId = "11493"
                dataType = "Metric"
                startDate = {new Date("2015-01-01T00:00:00.000Z")}
                endDate =   {new Date("2015-12-01T00:00:00.000Z")}
            /> */}

                <Row className={`rowVMarginSm rowVMarginTopSm`}>
                    <Col xs={{ span: 24, offset: 0 }} md={{ span: 12, offset: 6 }} lg = {{span: 8, offset: 8}}>
                        <Radio.Group defaultValue="0" buttonStyle="solid" onChange = {this.reportCardOrGraphsChanged}>
                            <Radio.Button value="0">Detailed Graphs</Radio.Button>
                            <Radio.Button value="1">Report Card</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <div className = "gutterOverflowMask">
                    <div className={`${!this.state.reportCard ? "displayNone" : ""}`}>
                        <Row className={`rowVMarginSm`}>
                            <h3>Last Month's Performance</h3>
                        </Row>   
                        <Row className={`rowVMarginSm`}>
                            <Col xs={{ span: 24, offset: 0 }} md={{ span: 18, offset: 3 }} lg = {{span: 12, offset: 6}}>
                                <Table
                                    columns = {metricTableColumns}
                                    dataSource = {metricData}
                                    pagination = {false}/>
                            </Col>
                        </Row>    
                    </div>    
                    <div className={`${this.state.reportCard? "displayNone" : ""}`}>

                        {/* UI For Viewing Graphs */}
                        <div className = {this.state.showGraphs ? "" : "displayNone"}>
                            <Row className={`rowVMarginSm`}>
                                <Col className = "left" xs={{ span: 12, offset: 0 }} sm = {{span: 11, offset:1}} md={{ span: 9, offset: 3 }} lg = {{span: 8, offset: 4}}>
                                    <Button onClick = {this.toggleAllGraphs}>{this.state.graphOpenCloseState["collapseOrExpandText"].text}</Button>
                                </Col>
                                <Col className = "right" xs={{ span: 12, offset: 0 }} sm = {{span: 11, offset:0}} md={{ span: 9, offset: 0 }} lg = {{span: 8, offset: 0}}>
                                    <Button icon="plus" type = "primary" onClick = {this.showHideCreateGraphUI}>Add Graph</Button>
                                </Col>
                            </Row>
                            <Row className={`rowVMarginSm`} gutter= {16}>
                                <Col xs={{ span: 24, offset: 0 }} sm = {{span: 22, offset:1}} md={{ span: 18, offset: 3 }} lg = {{span: 16, offset: 4}}>
                                    <Card className = "left" size ="small">
                                        {this.renderGraphs()}
                                    </Card>
                                </Col>
                            </Row>     
                        </div>
                        
                        {/* UI For Creating Graphs */}
                        <div className = {this.state.showGraphs ? "displayNone" : ""}>
                            <Row className = "rowVMarginSm">
                                <Col><Button icon = "caret-left" onClick = {this.showHideCreateGraphUI}>Back</Button></Col>
                                
                            </Row>
                            <Row className = "rowVMarginSm">
                                <CreateGraph/>
                            </Row>
                            
                            
                        </div>
                    </div>    
                </div>
            </div>
        );
    }
}

export default Dashboard;
