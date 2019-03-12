import React, { Component } from 'react';
import { Button, List, Card, Row, Col, Select, Divider, Avatar, Menu, Icon, Dropdown, message, DatePicker } from 'antd'

import './Analysis.css';
import LocationSelector from "../LocationSelector/LocationSelector"
import LocationWrapper from "../Analysis/LocationWrapper"
import MetricSelector from "../MetricSelector/MetricSelector"
import Visualizer from '../Visualizer/Visualizer';
import VisualizerManager from '../Visualizer/VisualizerManager'
import db from '../Database/database';
import moment from 'moment';

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
        locationData: {
        },//locationData,
        showTable: true,
        selectedUser: null,
        dataLoaded: false,
        currentView: "table",
        selectedLocation: null,
        addingLocation: false,
        Dates: { StartDate: new Date("2015-01-01T00:00:00.000Z"), EndDate: new Date("2019-01-01T00:00:00.000Z") },
        arr: null,
        dataForSingleLocation: [],
        dataForAllLocations: [],
        showGraph: false,
        graphType: "Group",
        data: null
    }
    generateGraph = () => {
        var locationData = [];
        //convert to array
        for (var key in this.state.locationData) {
            locationData.push(this.state.locationData[key]);
        }
        if (this.state.metricData.Type == "Metric") {
            this.createMetricGraph(locationData);

        } else if (this.state.metricData.Type == "Set") {
            this.createSetGraph(locationData);
        } else if (this.state.metricData.Type == "Group") {

        }

        this.setState({
            currentView: "graph"
        })
    }
    formatDate = (date) => {
        //Format into YYYY-MM-DDT:00:00:00.000Z
        let dateString = `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}T00:00:00.000Z`
        return dateString
    }
    createMetricGraph = (locationData) => {
        var dataForAllLocations = [];

        let context = {
            dataForAllLocations: dataForAllLocations
        };

        this.forEachPromise(locationData, this.getDataPromiseByLocation, context).then(() => {
            console.log(this.state.metricData.Name);
            this.setState({
                showGraph: true,
                currentView: "graph",
                graphType: "Set",
                data: {
                    name: this.state.metricData.Name,
                    data: context.dataForAllLocations,
                }
            });
        });
    }
    createSetGraph = (locationData) => {
        var dataForAllLocations = [];
        var legend = [];

        this.getMetricsPromise(this.state.metricData.Id).then((metrics) => {
            let context = {
                dataForAllLocations: dataForAllLocations,
                metrics: metrics,
                locations: legend
            };
            this.forEachPromise(locationData, this.getLocationPromise, context).then(() => {
                console.log(context.locations);
                console.log(context.dataForAllLocations);
                this.setState({
                    showGraph: true,
                    currentView: "graph",
                    graphType: "Group",
                    data: {
                        data: context.dataForAllLocations,
                        legendTitles: context.locations
                    }
                });
                console.log("donezo");
            })
        })

    }

    forEachPromise = (items, fn, context) => {
        return items.reduce(function (promise, item) {
            return promise.then(function () {
                return fn(item, context);
            });
        }, Promise.resolve());
    }

    getLocationPromise = (location, context) => {
        return new Promise((resolve, reject) => {
            let context2 = {
                location: location,
                dataForAllLocations: context.dataForAllLocations,
                dataForSingleLocation: []
            }
            this.forEachPromise(context.metrics, this.getDataPromise, context2).then(() => {
                context.dataForAllLocations.push(context2.dataForSingleLocation);
                context.locations.push(context2.location.Name)
            }).then(() => {
                resolve(true);
            });
        })
    }
    getMetricsPromise = (setId) => {
        return db.Metrics.where("parentId").equalsIgnoreCase(setId).toArray();
    }
    getDataPromise = (metric, context) => {
        return new Promise((resolve, reject) => {
            db.Data.where(
                ["FacilityId", "MetricId", 'Time']
            ).between(
                [context.location.Id, metric.Id, this.formatDate(this.state.Dates.StartDate)],
                [context.location.Id, metric.Id, this.formatDate(this.state.Dates.EndDate)],
                true,
                true
            ).toArray().then((arr) => {
                let sum = 0;
                arr.forEach((point) => {
                    sum += parseInt(point.Value);
                })
                context.dataForSingleLocation.push({
                    Value: sum,
                    Metric: metric.Name
                });
                console.log("Adding Data from current Metric: " + metric.Id + ", value: " + sum);
                resolve(true);
            })
        })
    }
    getDataPromiseByLocation = (location, context) => {
        return new Promise((resolve, reject) => {
            db.Data.where(
                ["FacilityId", "MetricId", 'Time']
            ).between(
                [location.Id, this.state.metricData.Id, this.formatDate(this.state.Dates.StartDate)],
                [location.Id, this.state.metricData.Id, this.formatDate(this.state.Dates.EndDate)],
                true,
                true
            ).toArray().then((arr) => {
                let sum = 0;
                arr.forEach((point) => {
                    sum += parseInt(point.Value);
                })
                context.dataForAllLocations.push({
                    Value: sum,
                    Metric: location.Name
                });

                console.log("Adding Data from current Location: " + location.Id + ", value: " + sum);
                resolve(true);
            })

        })
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
            let tempData = this.state.locationData;
            if (!this.state.addingLocation) {
                delete tempData[this.state.selectedLocation.Type + "-" + this.state.selectedLocation.Id];
            }
            tempData[location.Type + "-" + location.Id] = location;
            this.setState({ selectedLocation: location });

            message.success('Location Saved');
            this.setState({ locationData: tempData });
        } else {
            message.warning('Location Not Saved');
        }
        this.setState({
            currentView: "table"
        })
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

    //        Dates: { StartDate: new Date("2015-01-01T00:00:00.000Z"), EndDate: new Date("2019-01-01T00:00:00.000Z") },


    startDateOnChange(date, dateString) {
        var endDate = this.state.Dates.EndDate;
        this.setState({
            Dates: { StartDate: new Date(`${dateString}T00:00:00.000Z`), EndDate: endDate }
        }, () => { console.log(this.state) })
    }

    endDateOnChage(date, dateString) {
        var startDate = this.state.Dates.StartDate;
        this.setState({
            Dates: { StartDate: startDate, EndDate: new Date(`${dateString}T00:00:00.000Z`) }
        }, () => { console.log(this.state) })
    }

    render() {
        const { initLoading, loading, list } = this.state;
        const loadMore = !initLoading && !loading ? (
            <div className="center" >
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
                                <Card className="left" size="medium" title="Select Date">
                                       <div className = "center">
                                           <DatePicker defaultValue={moment('2015-01-01', 'YYYY-MM-DD')}  placeholder="Start Date" onChange={(date, dateString) => {this.startDateOnChange(date, dateString)}}/> 
                                           <DatePicker defaultValue={moment('2019-01-01', 'YYYY-MM-DD')}  placeholder="End Date" onChange={(date, dateString) => {this.endDateOnChage(date, dateString)}}/>
                                       </div>                                    
                                </Card>
                            </Col>
                        </Row>

                        <Divider />
                        <Row className={``} gutter={16}>
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                <Card className="left" size="medium" title="Select Location">
                                    <div className="center" >
                                        <Button type="primary" block onClick={this.addLocation}>Add Location</Button>
                                    </div>
                                    {this.state.locationData &&
                                        <List
                                            itemLayout="horizontal"
                                            size="large"
                                            pagination={{
                                                onChange: (page) => {
                                                    console.log(page);
                                                },
                                                pageSize: 4,
                                            }}
                                            dataSource={Object.values(this.state.locationData)}
                                            renderItem={item => (
                                                <List.Item
                                                    key={item.facility}
                                                    actions={[,
                                                        <Button onClick={() => { this.editLocation(item) }} style={{ marginLeft: 8 }}>
                                                            Edit <Icon type="edit" />
                                                        </Button>
                                                    ]}>
                                                    <List.Item.Meta
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
                                <div className="center" >
                                    <Button type="primary" block onClick={this.generateGraph}>Generate Graph</Button>
                                </div>
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

                        <Card className="left" size="medium" title="Graph">
                            <Button onClick={this.showTable}>
                                Back
                            </Button>
                            <Divider />
                            <Button onClick={this.getData}>
                                Save Graph <Icon type="save" />
                            </Button>

                            <Visualizer
                                type={this.state.graphType}
                                show={this.state.showGraph}
                                data={this.state.data}
                            />
                        </Card>

                    </div>
                }
            </div>
        );
    }
}

export default Analysis;
