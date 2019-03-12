import React, { Component } from 'react'

import { Table, Button, List, Card, Row, Col, Radio } from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './Dashboard.css'

import VisualizerManager from '../Visualizer/VisualizerManager';
import CreateGraph from '../Graph/CreateGraph'
import db from '../Database/database';
import Visualizer from '../Visualizer/Visualizer';

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
    // {
    //     Title: "Facility Attendance Male",
    //     Location:{
    //         Name: "za Bagega Ward",
    //         Id:  "386",
    //         Type: "Ward"
    //     },
    //     Data:{
    //         Id: "2094",
    //         Type: "Set",
    //         TotalOrDistribution: "distribution"
    //     },
    //     Dates:{
    //         StartDate:new Date("2015-01-01T00:00:00.000Z"),
    //         EndDate: new Date("2015-12-01T00:00:00.000Z"),
    //     },
    //     GraphId: 3
    // },
    // {
    //     Title: "Facility Attendance Male",
    //     Location:{
    //         Name: "za Bagega Primary Health Centre",
    //         Id:  "1215",
    //         Type: "Facility"
    //     },
    //     Data:{
    //         Id: "2094",
    //         Type: "Set",
    //         TotalOrDistribution: "distribution"
    //     },
    //     Dates:{
    //         StartDate:new Date("2015-01-01T00:00:00.000Z"),
    //         EndDate: new Date("2015-12-01T00:00:00.000Z"),
    //     },
    //     GraphId: 4
    // }
]

const metricTableColumns = [
    {
        title: "Metric Tracked",
        key: "metricTracked",
        dataIndex: "metric",
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
            return b.metric.localeCompare(a.metric, "en")
        },
    },
    {
        title: "Change",
        key: "change",
        dataIndex: "change",
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
        graphDataLoaded: false,
        related: null,
        relatedGraphs: []
    }

    fullSizeOrListChanged = (e) => {
        this.setState({ fullSize: e.target.value === "0" ? false : true })
    }

    reportCardOrGraphsChanged = (e) => {
        this.setState({ reportCard: e.target.value === "0" ? false : true }, () => {
            window.dispatchEvent(new Event('resize'));
        })
    }

    toggleGraph = (key) => {
        //Update the open/close state for this graph
        let copy = this.state.graphOpenCloseState
        let newVal = !copy[key].open
        copy[key] = { open: newVal }
        let anyOpen = false
        //Check if all graphs open
        for (let i = 0; i < Object.keys(copy).length - 1; i++) {
            if (i === key) continue
            if (copy[i].open === true) {
                anyOpen = true
                break
            }
        }
        if (anyOpen) {
            copy["collapseOrExpandText"] = { text: "Collapse All" }
        } else {
            copy["collapseOrExpandText"] = { text: "Expand All" }
        }

        this.setState({ graphOpenCloseState: copy })
    }

    toggleAllGraphs = () => {
        //Set future state depending on what the button says
        //Probably not best practice but it works 
        let openState = this.state.graphOpenCloseState["collapseOrExpandText"].text === "Collapse All" ? false : true
        let copy = this.state.graphOpenCloseState
        for (let i = 0; i < Object.keys(copy).length - 1; i++) {
            copy[i].open = openState
        }
        copy["collapseOrExpandText"].text = openState ? "Collapse All" : "Expand All"
        this.setState({ graphOpenCloseState: copy })
    }

    createCollapseExpandButton = (key) => {
        return (
            [<Button key={0} onClick={() => { this.toggleGraph(key) }}>{this.state.graphOpenCloseState[key].open ? "Collapse" : "Expand"}</Button>]
        )
    }

    getFirstLocation = (object) => {
        let keys = Object.keys(object)
        if (keys.length > 0) {
            return object[keys[0]]
        }
    }

    loadGraphsFromDB = () => {
        db.Dashboard.toArray().then(arr => {
            //Create a record of all open/close states for the graphs
            let visibility = {}
            for (let i = 0; i < arr.length; i++) {
                visibility[i] = { open: true, showInFilter: true }
            }

            visibility["collapseOrExpandText"] = { text: "Collapse All" }

            this.setState({
                graphData: arr,
                graphDataLoaded: true,
                graphOpenCloseState: visibility
            })
        })
    }

    componentDidMount() {
        this.loadGraphsFromDB()
    }


    findAllGraphs = (item) => {
        return new Promise((resolve) => {
            let callback = (data) => {
                resolve(data)
            }

            switch (item.Data.Type) {
                case "Metric":
                    db.Metrics.toArray(callback)
                    break
                case "Set":
                    db.Sets.toArray(callback)
                    break
                case "Group":
                    db.Sets.toArray(callback)
                    break
                default:
                    //
                    break;
            }
        })
    }

    findRelatedGraphs = (item) => {
        return this.findAllGraphs(item).then((allData) => {
            let relatedFound = [];
            let parentId = ""
            if (item.Data.Type === "Group") {
                parentId = item.Data.Id
            } else {
                allData.forEach(function (metricData) {
                    if (metricData.Id === item.Data.Id) {
                        parentId = metricData.parentId
                        return
                    }
                })
            }

            allData.forEach(function (metricData) {
                if (metricData.parentId === parentId) {
                    if (metricData.Id != item.Data.Id) {
                        relatedFound.push(metricData)
                    }
                }
            })
            return relatedFound;
        })
    }

    toggleViewRelated = async (item) => {
        if (this.state.currentView === "related") {
            this.setState({
                currentView: ""
            })
        } else {
            this.setState({
                currentView: "related"
            })

            var relatedFound = await this.findRelatedGraphs(item);

            this.processFoundData(relatedFound, item)

        }
    }

    createViewRelatedButton = (item) => {
        return (
            <Button onClick={() => { this.toggleViewRelated(item) }}>View Related</Button>
        )
    }

    processFoundData = (relatedFound, item) => {
        let processedRelatedData = []
        console.log(item)
        console.log(relatedFound)
        relatedFound.forEach(function (data) {
            var temp = JSON.parse(JSON.stringify(item))
            temp.Title = data.Name
            if (item.Data.Type === "Set" || item.Data.Type === "Group") {
                temp.Title = "All " + data.Name
            } else {
                temp.Title = data.Name
            }
            if (item.Data.Type === "Set" || item.Data.Type === "Group") {
                temp.Data.Name = "All " + data.Name + " (Distribution)"
            } else {
                temp.Data.Name = data.Name
            }
            temp.Data.Id = data.Id
            temp.Dates.StartDate = item.Dates.StartDate
            temp.Dates.EndDate = item.Dates.EndDate
            temp.RawData = null
            console.log("temp")
            console.log(temp)
            processedRelatedData.push(temp)
        })
        this.setState({
            relatedGraphs: processedRelatedData
        }, () => { console.log(this.state.relatedGraphs) })
    }

    renderRelated = () => {
        return (
            <List
                itemLayout="vertical"
                dataSource={this.state.relatedGraphs}
                renderItem={(item1, key) => (
                    <List.Item >
                        <List.Item.Meta
                            title={item1.Title}
                            description={item1.Locations.Name} />
                        <VisualizerManager
                            {...item1} //LocationId, Location, etc...
                            Location={this.getFirstLocation(item1.Locations)}
                        // show = {true}
                        />
                    </List.Item>
                )}>
            </List>
        )
    }
    itemHasCompare = (item)=>{
        for (let tag in item){
            console.log(tag)
            if (tag == "Compare"){
                return true
            } 
        }
        return false;
    }


    renderGraphs = () => {
        if (this.state.graphDataLoaded !== true) return null
        return (
            <List
                itemLayout="vertical"
                dataSource={this.state.graphData}
                renderItem={(item, key) => (
                    <List.Item >
                        {!this.itemHasCompare(item)? (
                            <div>
                                <List.Item.Meta
                                    title={item.Title}
                                    description={this.getFirstLocation(item.Locations).Name} />
                                {this.createCollapseExpandButton(key)}

                                <VisualizerManager
                                    {...item} //LocationId, Location, etc...
                                    Location={this.getFirstLocation(item.Locations)}

                                    show={this.state.graphOpenCloseState[key].open}
                                />
                                {this.createViewRelatedButton(item)}
                            </div>) : (
                                <div>
                                    <List.Item.Meta
                                        title={item.Title}
                                        description={item.Dates.StartDate.toUTCString() + " - " + item.Dates.EndDate.toUTCString()} />
                                    <Visualizer
                                        type={item.GraphType}
                                        show={true}
                                        data={item.Data}>
                                    </Visualizer>
                                </div>)}
                    </List.Item>
                )}>
            </List>
        )

    }

    showHideCreateGraphUI = () => {
        this.setState({
            showGraphs: !this.state.showGraphs
        }, () => {
            if (this.state.showGraphs) {
                window.dispatchEvent(new Event('resize'));
            }
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.currentView === "related" &&
                    <div>
                        <Row className="rowVMarginTopSm" gutter={-1}>
                            <Col className="left" xs={{ span: 16, offset: 0 }} sm={{ span: 14, offset: 1 }} md={{ span: 10, offset: 3 }} lg={{ span: 8, offset: 4 }}>
                                <h3>Related Graphs</h3>
                            </Col>
                            <Col className="right" span={8}>
                                <Button onClick={() => { this.toggleViewRelated() }}>Back</Button>
                            </Col>
                        </Row>
                        <div className={this.state.showGraphs ? "" : "displayNone"}>
                            <Row className={`rowVMarginSm`} gutter={16}>
                                <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                    <Card className="left" size="small">
                                        {this.renderRelated()}
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>

                }
                {
                    this.state.currentView != "related" &&
                    <div className="center">
                        <Row className={`rowVMarginSm rowVMarginTopSm`}>
                            <Col xs={{ span: 24, offset: 0 }} md={{ span: 12, offset: 6 }} lg={{ span: 8, offset: 8 }}>
                                <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.reportCardOrGraphsChanged}>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <div className="gutterOverflowMask">
                            <div className={`${!this.state.reportCard ? "displayNone" : ""}`}>
                                <Row className={`rowVMarginSm`}>
                                    <h3>Last Month's Performance</h3>
                                </Row>
                                <Row className={`rowVMarginSm`}>
                                    <Col xs={{ span: 24, offset: 0 }} md={{ span: 18, offset: 3 }} lg={{ span: 12, offset: 6 }}>
                                        <Table
                                            columns={metricTableColumns}
                                            dataSource={metricData}
                                            pagination={false} />
                                    </Col>
                                </Row>
                            </div>
                            <div className={`${this.state.reportCard ? "displayNone" : ""}`}>

                                {/* UI For Viewing Graphs */}
                                {
                                    this.state.graphDataLoaded &&
                                    <div className={this.state.showGraphs ? "" : "displayNone"}>
                                        <Row className={`rowVMarginSm`}>
                                            <Col className="left" xs={{ span: 12, offset: 0 }} sm={{ span: 11, offset: 1 }} md={{ span: 9, offset: 3 }} lg={{ span: 8, offset: 4 }}>
                                                <Button onClick={this.toggleAllGraphs}>{this.state.graphOpenCloseState["collapseOrExpandText"].text}</Button>
                                            </Col>
                                            <Col className="right" xs={{ span: 12, offset: 0 }} sm={{ span: 11, offset: 0 }} md={{ span: 9, offset: 0 }} lg={{ span: 8, offset: 0 }}>
                                                <Button icon="plus" type="primary" onClick={this.showHideCreateGraphUI}>Add Graph</Button>
                                            </Col>
                                        </Row>
                                        <Row className={`rowVMarginSm`} gutter={16}>
                                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                                <Card className="left" size="small">
                                                    {this.renderGraphs()}
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                }


                                {/* UI For Creating Graphs */}
                                <div className={this.state.showGraphs ? "displayNone" : ""}>
                                    <Row className="rowVMarginSm">
                                        <Col><Button icon="caret-left" onClick={this.showHideCreateGraphUI}>Back</Button></Col>

                                    </Row>
                                    <Row className="rowVMarginSm">
                                        <CreateGraph
                                            ParentHandler={this.loadGraphsFromDB}
                                        />
                                    </Row>

                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Dashboard;
