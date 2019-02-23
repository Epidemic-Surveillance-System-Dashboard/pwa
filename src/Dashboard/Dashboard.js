import React, { Component } from 'react'

import { Input, Icon, Table, Button, List, Card, Row, Col, Radio } from 'antd'

import '../../node_modules/react-vis/dist/style.css'
import './Dashboard.css'

import Visualizer from '../Visualizer/Visualizer'

let graphExamples = [
    {
        title: "Metric Ex | Malaria Vaccinations",
        location: "Ward 1",
        type: "metric",
        id: 0
    },
    {
        title: "Set Ex | Malaria Vaccinations - Male",
        location: "Ward 2",
        type: "set",
        id: 1
    },
    {
        title: "Group Ex | Malaria Vaccinations - Male and Female",
        location: "Ward 3",
        type: "group",
        id: 2
    },

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


const dashboardGraphs = [
    {
        dataType:"Metric",
        dataID: 1,
        dataName: "Malaria Vaccinations",     //Cache to reduce # of db queries
        locationID:1,
        locationType:"Ward",
        locationName:"Example Ward",            //Cache
        startDate:new Date(),
        endDate: new Date(),
    }
]

class Dashboard extends Component {

    state = {
        fullSize: true,
        reportCard: false,
        graphOpenCloseState: null
    }

    componentWillMount() {

        //Create a record of all open/close states for the graphs
        let visiblity = {}
        for (let i = 0; i < graphExamples.length; i++) {
            visiblity[i] = { open: true, showInFilter: true }
        }
        visiblity["collapseOrExpandText"] = { text: "Collapse All" }
        this.setState({ graphOpenCloseState: visiblity })
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

    renderGraphs = () => {
        return (
            <List
                itemLayout="vertical"
                dataSource={graphExamples}
                renderItem={(item, key) => (
                    <List.Item >
                        <List.Item.Meta
                            title={item.title}
                            description={item.location} />
                        {this.createCollapseExpandButton(key)}
                        <Visualizer type={item.type} show={this.state.graphOpenCloseState[key].open}></Visualizer>
                    </List.Item>
                )}>
            </List>
        )

    }

    render() {
        return (
            <div className="center">
                <Row className={`rowVMarginSm rowVMarginTopSm`}>
                    <Col xs={{ span: 24, offset: 0 }} md={{ span: 12, offset: 6 }} lg={{ span: 8, offset: 8 }}>
                        <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.reportCardOrGraphsChanged}>
                            <Radio.Button value="0">Detailed Graphs</Radio.Button>
                            <Radio.Button value="1">Report Card</Radio.Button>
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
                        <Row className={`rowVMarginSm`}>
                            <Col className="left" xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                <Button onClick={this.toggleAllGraphs}>{this.state.graphOpenCloseState["collapseOrExpandText"].text}</Button>
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
                </div>
            </div>
        );
    }
}

export default Dashboard;
