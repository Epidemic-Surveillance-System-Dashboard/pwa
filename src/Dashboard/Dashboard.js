import React, { Component } from 'react'

import {Table, Button,List, Card, Row, Col, Radio} from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './Dashboard.css'

import VisualizerManager from '../Visualizer/VisualizerManager';

let graphExamples = [
    {
        Title: "Facility Attendance Female, 29d-11 months",
        LocationName:"za Bagega Primary Health Centre",
        LocationId: "1215",
        LocationType : "Facility",
        DataId : "11729",
        DataType : "Metric",
        StartDate : new Date("2015-01-01T00:00:00.000Z"),
        EndDate :  new Date("2015-12-01T00:00:00.000Z"),
        GraphId: 0
    },
    {
        Title: "Facility Attendance Outpatient Value",
        LocationName:"za Bagega Primary Health Centre",
        LocationId: "1215",
        LocationType : "Facility",
        DataId : "11493",
        DataType : "Metric",
        StartDate : new Date("2015-01-01T00:00:00.000Z"),
        EndDate :  new Date("2016-12-01T00:00:00.000Z"),
        GraphId: 1
    },
    {
        Title: "Facility Attendance Outpatient",
        LocationName:"za Bagega Ward",
        LocationId: "386",
        LocationType : "Ward",
        DataId : "2094",
        DataType : "Set",
        DataPresentation: "none", //none, total, or distribution
        StartDate : new Date("2015-01-01T00:00:00.000Z"),
        EndDate :  new Date("2015-12-01T00:00:00.000Z"),
        GraphId: 2
    },
    {
        Title: "Facility Attendance Outpatient",
        LocationName:"za Bagega Ward",
        LocationId: "386",
        LocationType : "Ward",
        DataId : "2094",
        DataType : "Set",
        DataPresentation: "total", //none, total, or distribution
        StartDate : new Date("2015-01-01T00:00:00.000Z"),
        EndDate :  new Date("2017-12-01T00:00:00.000Z"),
        GraphId: 3
    },
    {
        Title: "Facility Attendance Outpatient",
        LocationName:"za Bagega Ward",
        LocationId: "386",
        LocationType : "Ward",
        DataId : "2094",
        DataType : "Set",
        DataPresentation: "none", //none, total, or distribution
        StartDate : new Date("2015-01-01T00:00:00.000Z"),
        EndDate :  new Date("2017-12-01T00:00:00.000Z"),
        GraphId: 4
    }
    // ,
    // {
    //     title: "Set Ex | Malaria Vaccinations - Male",
    //     location: "Ward 2",
    //     type: "set",
    //     graphId:1
    // },
    // {
    //     title: "Group Ex | Malaria Vaccinations - Male and Female",
    //     location: "Ward 3",
    //     type: "group",
    //     graphId:2
    // },

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

    componentDidMount(){
        //Test Cases

        //Metric, Id = 7231

        //Set, Id = 1247
        let MetricId = "7231"
        let SetId = "1247"
        let SetName = "Facility Attendance Male" //Store the name with the ID so we can avoid a lookup

        let GroupId = "691"

        //Logic for Metrics:
        // db.Data.where({MetricId: MetricId}).toArray((arr) =>{
        //     this.setState({
        //         tempGraphReady: true,
        //         tempGraphData: arr
        //     })
        // })

        // db.Metrics.where({parentId: SetId}).toArray(arr =>{
        //     //Sort (using Key as proxy for order)
        //     arr.sort((a,b) => {
        //         return a.Key - b.Key
        //     })
            
        //     let promises = []

        //     arr.forEach(el =>{
        //         let newPromise = db.Data.get({MetricId: el.Id, Time: "2015-05-01T11:00:00.000Z"})
        //         promises.push(newPromise)
        //     })

        //     Promise.all(promises).then(values =>{
    
        //         let validData = []

        //         for(let i = 0; i < values.length; i++){
        //             try{
        //                 if (values[i] !== undefined){         
        //                     if (arr[i].Name === SetName) continue  //Skip the totals because they are often incorrect
        //                     let x = values[i]
        //                     x.Metric = arr[i].Name.replace(`${SetName}, `, "") //Strip away redundant text
        //                     x.Date = new Date(x.Time)
        //                     x.Value = Number.parseInt(x.Value)                        
        //                     if (x.Metric !== undefined && x.Metric !== SetName) validData.push(x)
        //                 }
        //             }catch(e){
        //                 //Probably empty
        //             }
    
        //         }

        //         //Sort Array
        //         if (values[0].hasOwnProperty('RelativeOrder')) values.sort((a,b) =>{
        //             return a.RelativeOrder - b.RelativeOrder
        //         })

        //         this.setState({
        //             tempGraphReady: true,
        //             tempGraphData: {
        //                 name: SetName,
        //                 data: validData
        //             }
        //         })
                
        //     })
            
        // })

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
                            description = {item.LocationName}/>
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
                    <div className={`${!this.state.reportCard? "displayNone" : ""}`}>
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
                        <Row className={`rowVMarginSm`}>
                            <Col className = "left" xs={{ span: 24, offset: 0 }} sm = {{span: 22, offset:1}} md={{ span: 18, offset: 3 }} lg = {{span: 16, offset: 4}}>
                                <Button onClick = {this.toggleAllGraphs}>{this.state.graphOpenCloseState["collapseOrExpandText"].text}</Button>
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
                </div>
            </div>
        );
    }
}

export default Dashboard;
