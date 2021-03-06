import React, { Component } from 'react'

import { message, Button, List, Card, Row, Col, Popconfirm } from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './Dashboard.css'

import VisualizerManager from '../Visualizer/VisualizerManager';
import CreateGraph from '../Graph/CreateGraph'
import db from '../Database/database';
import Visualizer from '../Visualizer/Visualizer';

// let graphExamples = [
//     {
//         Title: "Facility Attendance Female, 29d-11 months",
//         Location:{
//             Name: "za Bagega Primary Health Centre",
//             Id:  "1215",
//             Type: "Facility"
//         },
//         Data:{
//             Id: "11729",
//             Type: "Metric",
//         },
//         Dates:{
//             StartDate:new Date("2015-01-01T00:00:00.000Z"),
//             EndDate: new Date("2015-12-01T00:00:00.000Z"),
//         },
//         GraphId: 0
//     },
//     {
//         Title: "Facility Attendance Outpatient Value",
//         Location:{
//             Name: "za Bagega Primary Health Centre",
//             Id:  "1215",
//             Type: "Facility"
//         },
//         Data:{
//             Id: "11493",
//             Type: "Metric",
//         },
//         Dates:{
//             StartDate:new Date("2015-01-01T00:00:00.000Z"),
//             EndDate: new Date("2015-12-01T00:00:00.000Z"),
//         },
//         GraphId: 1
//     },
//     {
//         Title: "Facility Attendance Outpatient",
//         Location:{
//             Name: "za Bagega Ward",
//             Id:  "386",
//             Type: "Ward"
//         },
//         Data:{
//             Id: "2094",
//             Type: "Set",
//         },
//         Dates:{
//             StartDate:new Date("2015-01-01T00:00:00.000Z"),
//             EndDate: new Date("2015-12-01T00:00:00.000Z"),
//         },
//         GraphId: 2
//     },
//     {
//         Title: "Facility Attendance Male",
//         Location:{
//             Name: "za Bagega Ward",
//             Id:  "386",
//             Type: "Ward"
//         },
//         Data:{
//             Id: "2094",
//             Type: "Set",
//             TotalOrDistribution: "distribution"
//         },
//         Dates:{
//             StartDate:new Date("2015-01-01T00:00:00.000Z"),
//             EndDate: new Date("2015-12-01T00:00:00.000Z"),
//         },
//         GraphId: 3
//     },
//     {
//         Title: "Facility Attendance Male",
//         Location:{
//             Name: "za Bagega Primary Health Centre",
//             Id:  "1215",
//             Type: "Facility"
//         },
//         Data:{
//             Id: "2094",
//             Type: "Set",
//             TotalOrDistribution: "distribution"
//         },
//         Dates:{
//             StartDate:new Date("2015-01-01T00:00:00.000Z"),
//             EndDate: new Date("2015-12-01T00:00:00.000Z"),
//         },
//         GraphId: 4
//     }
// ]

// const metricTableColumns = [
//     {
//         title: "Metric Tracked",
//         key: "metricTracked",
//         dataIndex: "metric",
//         defaultSortOrder: 'descend',
//         sorter: (a, b) => {
//             return b.metric.localeCompare(a.metric, "en")
//         },
//     },
//     {
//         title: "Change",
//         key: "change",
//         dataIndex: "change",
//         defaultSortOrder: 'descend',
//         sorter: (a, b) => {
//             return a.change - b.change
//         },
//         render: decimal => {
//             return `${Math.round(decimal * 100)}%`
//         }
//     },

// ]

// const metricData = [
//     {
//         key: '1',
//         metric: "Malaria Vaccinations",
//         change: 0.15
//     },
//     {
//         key: '2',
//         metric: "Tetanus Vaccinations",
//         change: -.13
//     },
//     {
//         key: '3',
//         metric: "Measles Outbreaks",
//         change: 0
//     },
// ]

class Dashboard extends Component {

    state = {
        fullSize: true,
        graphOpenCloseState: null,
        graphDataLoaded: false,
        related: null,
        relatedGraphs: [],
        prevScollPos: 0,
        currentView: "dashboard" // "dashboard" || "viewRelated" || "createGraph"
    }

    fullSizeOrListChanged = (e) => {
        this.setState({ fullSize: e.target.value === "0" ? false : true })
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
            <Button key={0} className="condensed" onClick={() => { this.toggleGraph(key) }}>{this.state.graphOpenCloseState[key].open ? "Collapse" : "Expand"}</Button>
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
                    if (metricData.Id !== item.Data.Id) {
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
                currentView: "dashboard"
            }, () => {
                window.scrollTo(0, this.state.prevScollPos)
                window.dispatchEvent(new Event('resize'))
            })
        } else {
            this.setState({
                currentView: "related",
                prevScollPos: window.pageYOffset
            }, () => {
                window.scrollTo(0, 0)
            })
            var relatedFound = await this.findRelatedGraphs(item);
            this.processFoundData(relatedFound, item)
        }
    }

    createViewRelatedButton = (item) => {
        return (
            <Button type="primary" className="condensed" onClick={() => { this.toggleViewRelated(item) }}>View Related</Button>
        )
    }

    createDeleteButton = (item) => {
        return (
            <Popconfirm placement="top" title="Are you sure want to delete this graph?" okText="Delete" cancelText="Cancel"
                onConfirm={() => { this.deleteGraph(item) }}>
                <Button className="condensed" type="danger" icon="delete">Delete</Button>
            </Popconfirm>

        )

    }

    processFoundData = (relatedFound, item) => {
        let processedRelatedData = []
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
            processedRelatedData.push(temp)
        })
        this.setState({
            relatedGraphs: processedRelatedData
        })
    }

    deleteGraph = (item) => {
        db.Dashboard.delete(item.Id).then(() => {
            db.Dashboard.toArray().then(arr => {
                this.setState({
                    graphData: arr
                });
                message.success("Graph successfully deleted.");
            });
        });
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
                            show={true}
                        />
                    </List.Item>
                )}>
            </List>
        )
    }

    itemHasCompare = (item) => {
        return Object.keys(item).includes("Compare")
    }

    showWhenCurrentViewIs = (viewType, classNames) => {
        //Hide this class when the current view matches the view type
        if (this.state.currentView === viewType) return classNames
        return `${classNames} displayNone`
    }

    showWhenCurrentViewIsNot = (viewType, classNames) => {
        //Hide this class when the current view doesn't match the view type
        if (this.state.currentView !== viewType) return classNames
        return `${classNames} displayNone`
    }

    renderGraphs = () => {
        if (this.state.graphDataLoaded !== true) return null
        return (
            <List
                itemLayout="vertical"
                dataSource={this.state.graphData}
                renderItem={(item, key) => (
                    <List.Item

                        actions={[
                            this.createCollapseExpandButton(key),
                            this.createViewRelatedButton(item),
                            this.createDeleteButton(item)
                        ]}>
                        {!this.itemHasCompare(item) ? (
                            <div>
                                <List.Item.Meta
                                    title={item.Title}
                                    description={this.getFirstLocation(item.Locations).Name} />

                                <VisualizerManager
                                    {...item} //LocationId, Location, etc...
                                    Location={this.getFirstLocation(item.Locations)}
                                    show={this.state.graphOpenCloseState[key].open}
                                />

                            </div>) : (
                                <div>
                                    <List.Item.Meta
                                        title={item.Title}
                                        description={new Date(item.Dates.StartDate).toUTCString().substring(0, new Date(item.Dates.StartDate).toUTCString().length - 13) + " - " + new Date(item.Dates.EndDate).toUTCString().substring(0, new Date(item.Dates.EndDate).toUTCString().length - 13)} />
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


    setView = (viewName) => {
        this.setState({
            currentView: viewName,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })
    }

    render() {
        return (
            <div>
                {/* UI For Related Graphs */}
                <div className={this.showWhenCurrentViewIs("related", "center")}>
                    <Row className="rowVMarginSm rowVMarginTopSm left">
                        <Button icon="caret-left" onClick={() => { this.toggleViewRelated() }}>Back</Button>
                    </Row>

                    <Row className={`rowVMarginSm rowVMarginTopSm`} gutter={16}>
                        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                            <Card className="left" size="medium" title="Related Graphs">
                                {this.renderRelated()}
                            </Card>
                        </Col>
                    </Row>
                </div>

                <div className={this.showWhenCurrentViewIsNot("related", "center")}>
                    {/* UI For Viewing Graphs */}
                    {
                        this.state.graphDataLoaded &&
                        <div className={this.showWhenCurrentViewIs("dashboard", "")}>
                            <Row className="rowVMarginSm rowVMarginTopSm">
                                <Col className="left" xs={{ span: 12, offset: 0 }} sm={{ span: 11, offset: 1 }} md={{ span: 9, offset: 3 }} lg={{ span: 8, offset: 4 }}>
                                    <Button onClick={this.toggleAllGraphs}>{this.state.graphOpenCloseState["collapseOrExpandText"].text}</Button>
                                </Col>
                                <Col className="right" xs={{ span: 12, offset: 0 }} sm={{ span: 11, offset: 0 }} md={{ span: 9, offset: 0 }} lg={{ span: 8, offset: 0 }}>
                                    <Button icon="plus" type="primary" onClick={() => { this.setView("createGraph") }}>Add Graph</Button>
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
                    <div className={this.showWhenCurrentViewIs("createGraph", "")}>
                        <Row className="rowVMarginSm rowVMarginTopSm">
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}
                                className="left">
                                <Button icon="caret-left" onClick={() => { this.setView("dashboard") }}>Back</Button>
                            </Col>
                        </Row>
                        <Row className="rowVMarginSm">
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                <CreateGraph
                                    ParentHandler={this.loadGraphsFromDB}
                                />
                            </Col>
                        </Row>

                    </div>

                </div>

            </div>
        );
    }
}

export default Dashboard;
