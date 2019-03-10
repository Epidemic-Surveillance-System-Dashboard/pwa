import React, { Component } from 'react';
import { Button, List, Card, Row, Col, Select, Divider, Avatar, Menu, Icon, Dropdown, message } from 'antd'

import './Analysis.css';
import LocationSelector from "../LocationSelector/LocationSelector"
import LocationWrapper from "../Analysis/LocationWrapper"
import MetricSelector from "../MetricSelector/MetricSelector"
import Visualizer from '../Visualizer/Visualizer';
import VisualizerManager from '../Visualizer/VisualizerManager'
import db from '../Database/database';

const Option = Select.Option
var dataDict = {};
for (let i = 0; i < 20; i++) {
    var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    var dataPoint = {
        color: color,
        facility: `facility ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        state: `state ${i}`,
        LGA: `LGA ${i}`,
        ward: `Ward ${i}`
    };
    var dataList = [];
    dataDict[dataPoint.facility + dataPoint.ward + dataPoint.LGA + dataPoint.state] = dataPoint;
}
var initialMetric = {
    GroupValue: "1191|Facility Attendance|Group",
    SetValue: "-3-1191|All Facility Attendance (Distribution)|Group",
    MetricValue: ""
};

class Analysis extends Component {

    state = {
        metricData: null,
        initLoading: false,
        loading: false,
        data: {
        },//dataDict,
        showTable: true,
        selectedUser: null,
        dataLoaded: false,
        currentView: "table",
        selectedLocation: null,
        addingLocation: false,
        Dates: { StartDate: new Date("2015-01-01T00:00:00.000Z"), EndDate: new Date("2019-01-01T00:00:00.000Z") }
    }
    generateGraph = () => {
        console.log("--------------------");
        console.log(this.state.metricData);
        console.log(this.state.selectedLocation);
        console.log(this.state.Dates);
        console.log(this.state.metricData);


        console.log("--------------------");
        this.setState({
            currentView: "graph"
        })
        /*
        db.Data.toArray().then(arr => {
            console.log(arr);
            let dataDict = {};
            arr.forEach(ele => {
                dataDict[ele.Id] = ele;
            });

        })*/

    }
    saveGraph = () => {

    }

    updateRawData = (rawData) => {
        this.setState({
            RawData: rawData
        })
    }

    updateData = (data) => {
        this.setState({ metricData: data })
    }
    updateLocation = (location, save) => {
        if (save) {
            let tempData = this.state.data;
            if (!this.state.addingLocation) {
                delete tempData[this.state.selectedLocation.Type + "-" + this.state.selectedLocation.Id];
            }
            tempData[location.Type + "-" + location.Id] = location;
            /*
            temp
            */
            this.setState({ selectedLocation: location });
            console.log("location");
            console.log(location);

            message.success('Location Saved');
            this.setState({ data: tempData });
        } else {
            message.warning('Location Not Saved');
        }
        this.setState({
            currentView: "table"
        })
        console.log(save)/*
        for (var a in  this.state.data){
            console.log(a);
            console.log(this.state.data[a]);
        }*/
        console.log(location);
        //this.setState({ location: location })
    }
    handleChange = (value) => {
        console.log("boo" + value);
    }
    addLocation = () => {
        this.state.selectedLocation = null;
        this.setState({
            addingLocation: true,
            currentView: "existing"
        })
    }

    editLocation = (location) => {
        this.setState({
            addingLocation: false,
            selectedLocation: location,
            currentView: "existing"
        })

    }
    showTable = () => {
        this.setState(
            { currentView: "table" }
        )
    }
    showHideTableClass = () => {
        return this.state.currentView === "table" ? "" : "displayNone"
    }
    render() {
        const { initLoading, loading, list } = this.state;
        const loadMore = !initLoading && !loading ? (
            <div class="center" >
                <Button onClick={this.addLocation}>Add Location</Button>
            </div>
        ) : null;

        return (
            <div>
                {
                    this.state.currentView === "table" &&
                    <div className="center">
                        <Row className={``} gutter={16}>
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                <Card className="left" size="medium" title="Select Metric">
                                    <MetricSelector parentHandler={this.updateData}
                                        initialData={{
                                            GroupValue: "1191|Facility Attendance|Group",
                                            SetValue: "-3-1191|All Facility Attendance (Distribution)|Group",
                                            MetricValue: ""
                                        }}
                                    ></MetricSelector>

                                </Card>
                            </Col>
                        </Row>
                        <Divider />
                        <Row className={``} gutter={16}>
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                <Card className="left" size="medium" title="Select Location">
                                    <div class="center" >
                                        <Button type="primary" block onClick={this.addLocation}>Add Location</Button>
                                    </div>
                                    {this.state.data &&
                                        <List
                                            itemLayout="horizontal"
                                            size="large"
                                            pagination={{
                                                onChange: (page) => {
                                                    console.log(page);
                                                },
                                                pageSize: 4,
                                            }}
                                            dataSource={Object.values(this.state.data)}
                                            renderItem={item => (
                                                <List.Item
                                                    key={item.facility}
                                                    actions={[,
                                                        <Button onClick={() => { this.editLocation(item) }} style={{ marginLeft: 8 }}>
                                                            Edit <Icon type="edit" />
                                                        </Button>
                                                    ]}>
                                                    <List.Item.Meta
                                                        avatar={<Avatar icon="environment" style={{ backgroundColor: item.color }} />}
                                                        title={<a href="https://ant.design">{item.Name}</a>}
                                                        description={
                                                            "Location Type: " + item.Type
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    }
                                </Card>
                            </Col>
                        </Row>
                        <Divider />

                        <Row>
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                <div class="center" >
                                    <Button type="primary" block onClick={this.generateGraph}>Generate Graph</Button>
                                </div>
                                <Card className="left" size="medium" title="Graph">
                                    <Button onClick={this.saveGraph}>
                                        Save Graph <Icon type="save" />
                                    </Button>
                                </Card>
                            </Col>

                        </Row>
                    </div>
                }

                {this.state.currentView !== "existing" ?
                    null :
                    <div className="">
                        <LocationWrapper
                            parentHandler={this.updateLocation} initialLocation={this.state.selectedLocation}
                        />
                    </div>
                }
                {this.state.currentView !== "graph" ?
                    null :
                    <div className="">
                        <Button onClick={this.showTable}>
                            Back
                        </Button>

                        <VisualizerManager
                            Title={this.state.metricData !== undefined && this.state.metricData.Name !== undefined ? this.state.metricData.Name.split("(")[0] : ""}
                            Location={this.state.selectedLocation} //{Name, Id, Type}
                            Data={this.state.metricData} // {Id, Type, TotalOrDistribution="total|none|distribution"}
                            Dates={this.state.Dates}
                            ParentHandler={this.updateRawData} /*
                            {...item} //LocationId, Location, etc...
                            show={this.state.graphOpenCloseState[key].open}*/
                        />
                    </div>
                }
            </div>
        );
    }
}

export default Analysis;
