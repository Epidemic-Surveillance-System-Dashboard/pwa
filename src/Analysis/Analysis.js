import React, { Component } from 'react';
import { Button, List, Card, Row, Col, Select, Divider, Avatar, Menu, Icon, Dropdown, message, DatePicker } from 'antd'

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
var s = "Group";
var mockGroup = {
    data: [
        [
            { Value: 1, Metric: "Metric1" },
            { Value: 2, Metric: "Metric2" },
            { Value: 3, Metric: "Metric3" },
            { Value: 4, Metric: "Metric4" },
        ],
        [
            { Value: 2, Metric: "Metric1" },
            { Value: 3, Metric: "Metric2" },
            { Value: 4, Metric: "Metric3" },
            { Value: 5, Metric: "Metric4" },
        ],
        [
            { Value: 3, Metric: "Metric1" },
            { Value: 4, Metric: "Metric2" },
            { Value: 5, Metric: "Metric3" },
            { Value: 6, Metric: "Metric4" },
        ],
    ],
    legendTitles: [
        "Location 1",
        "Location 2",
        "Location 3"
    ]
}
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
    }
    generateGraph = () => {
        console.log("--------------------");
        console.log(this.state.metricData);
        console.log(this.state.selectedLocation);
        console.log(this.state.Dates);
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
    formatDate = (date) => {
        //Format into YYYY-MM-DDT:00:00:00.000Z
        let dateString = `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}T00:00:00.000Z`
        return dateString
    }


    /*
    dataPromises.push(this.getMetrics(this.state.metricData.Id)
        .then((metrics) => {
            metrics.forEach((metric) => {
                this.getData(this.state.locationData[key].Id, metric.Id, this.formatDate(this.state.Dates.StartDate), this.formatDate(this.state.Dates.EndDate))
                    .then((data) => {
                        let sum = 0;
                        data.forEach((point) => {
                            sum += parseInt(point.Value);
                        })
                        dataForSingleLocation.push({
                            Value: sum,
                            Metric: metric.Name
                        });
                        console.log("Adding Data from current Metric: " + metric.Id);
                    })
            })
        }));
        for (var key in this.state.locationData) {
                console.log(this.state.locationData[key]);
                console.log(this.formatDate(this.state.Dates.StartDate));
                console.log(this.formatDate(this.state.Dates.EndDate));
                legend.push(this.state.locationData[key].Name);

                if (this.state.metricData.Type == "Metric") {/*
                    //Normal Bar chart
                    db.Data.where(
                        ["FacilityId", "MetricId", 'Time']
                    ).between(
                        [this.state.locationData[key].Id, this.state.metricData.Id, this.formatDate(this.state.Dates.StartDate)],
                        [this.state.locationData[key].Id, this.state.metricData.Id, this.formatDate(this.state.Dates.EndDate)],
                        true,
                        true
                    )
                        .toArray().then((arr) => {
                            this.setState({
                                arr: arr
                            })
                            dataForAllLocations.push(arr);
                            console.log(dataForAllLocations);
    
                        })
                    } else if (this.state.metricData.Type == "Set") {
                        dataPromises.push(this.getMetricsPromise(this.state.metricData.Id));
                    } else if (this.state.metricData.Type == "Group") {
    
                    }
    
    
                }
    db.Metrics.where("parentId").equalsIgnoreCase(this.state.metricData.Id)
        .toArray().then((arr) => {
            metricsForData = arr;
 
            console.log("Metrics from given set: " + this.state.metricData.Id);
            //Get data for each metric
            metricsForData.forEach((metric) => {
                dataPromises.push(new Promise((resolve, reject) => {
                    db.Data.where(
                        ["FacilityId", "MetricId", 'Time']
                    ).between(
                        [this.state.locationData[key].Id, metric.Id, this.formatDate(this.state.Dates.StartDate)],
                        [this.state.locationData[key].Id, metric.Id, this.formatDate(this.state.Dates.EndDate)],
                        true,
                        true
                    )
                        .toArray().then((arr) => {
                            let sum = 0;
                            arr.forEach((point) => {
                                sum += parseInt(point.Value);
                            })
                            dataForSingleLocation.push({
                                Value: sum,
                                Metric: metric.Name
                            });
                            console.log("Adding Data from current Metric: " + metric.Id);
                            resolve(true);
                        })
                }));
            })
        })
        
        
        Promise.all(dataPromises).then(function (values) {
            dataForAllLocations.push(dataForSingleLocation);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log(values);
            console.log(dataForAllLocations);
            dataForSingleLocation = []; //empties data
            dataPromises = []; //empties promises
        });
        */

    getData = () => {
        var dataForAllLocations = [];
        var dataPromises = []; //for Set
        var dataForSingleLocation = [];
        var metricsForData = [];
        var legend = [];
        var locationData = [];
        //convert to array
        for (var key in this.state.locationData) {
            locationData.push(this.state.locationData[key]);
        }

        this.getMetricsPromise(this.state.metricData.Id).then((metrics) => {
            let context = {
                dataForAllLocations: dataForAllLocations,
                metrics: metrics
            };
            this.forEachPromise(locationData, this.getLocationPromise, context).then(() => {
                console.log("donezo")
            })
        })

    }
    logItem = (item) => {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                console.log(item);
                resolve();
            })
        });
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
            console.log("getLocationPromise------------------");
            console.log("Metrics:");
            console.log(context.metrics);
            let context2 = {
                locationId: location.Id,
                dataForAllLocations: context.dataForAllLocations,
                dataForSingleLocation: []
            }
            this.forEachPromise(context.metrics, this.getDataPromise, context2).then(() => {
                console.log('done location');
                context.dataForAllLocations.push(context2.dataForSingleLocation);
                console.log(context.dataForAllLocations);
            }).then(() => {
                resolve(true);
            });
        })
    }
    getMetricsPromise = (setId) => {
        console.log("getMetricPromise------------------");
        return db.Metrics.where("parentId").equalsIgnoreCase(setId).toArray();
    }
    getDataPromise = (metric, context) => {
        return new Promise((resolve, reject) => {
            console.log("getDataPromise------------------");
            console.log(metric);
            console.log(context);
            console.log(this.state.Dates.StartDate);
            console.log(this.state.Dates.EndDate);

            db.Data.where(
                ["FacilityId", "MetricId", 'Time']
            ).between(
                [context.locationId, metric.Id, this.formatDate(this.state.Dates.StartDate)],
                [context.locationId, metric.Id, this.formatDate(this.state.Dates.EndDate)],
                true,
                true
            ).toArray().then((arr) => {
                console.log(arr);

                let sum = 0;
                arr.forEach((point) => {
                    sum += parseInt(point.Value);
                })
                context.dataForSingleLocation.push({
                    Value: sum,
                    Metric: metric.Name
                });
                console.log("Adding Data from current Metric: " + metric.Id +", value: " + sum);
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
            /*
            temp
            */
            this.setState({ selectedLocation: location });
            console.log("location");
            console.log(location);

            message.success('Location Saved');
            this.setState({ locationData: tempData });
        } else {
            message.warning('Location Not Saved');
        }
        this.setState({
            currentView: "table"
        })
        console.log(save)/*
        for (var a in  this.state.locationData){
            console.log(a);
            console.log(this.state.locationData[a]);
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

    //        Dates: { StartDate: new Date("2015-01-01T00:00:00.000Z"), EndDate: new Date("2019-01-01T00:00:00.000Z") },


    startDateOnChange(date, dateString){
        var endDate = this.state.Dates.EndDate;
        this.setState({
            Dates: {StartDate: new Date(`${dateString}T00:00:00.000Z`), EndDate: endDate} 
        }, () => {console.log(this.state)})
    }

    endDateOnChage(date, dateString){
        var startDate = this.state.Dates.StartDate;
        this.setState({
            Dates: {StartDate: startDate, EndDate: new Date(`${dateString}T00:00:00.000Z`)} 
        }, () => {console.log(this.state)})
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
                                    <Visualizer
                                        type={s}
                                        show={true}
                                        locationData={mockGroup}
                                    />
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
                                    <div className="center" >
                                        <Button type="primary" block onClick={this.addLocation}>Picker Date</Button>
                                    </div>
                                    {this.state.data &&
                                       <div className = "center">
                                           <DatePicker placeholder="Start Date" onChange={(date, dateString) => {this.startDateOnChange(date, dateString)}}/> 
                                           <DatePicker placeholder="End Date" onChange={(date, dateString) => {this.endDateOnChage(date, dateString)}}/>
                                       </div>
                                    }
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
                                <div className="center" >
                                    <Button type="primary" block onClick={this.generateGraph}>Generate Graph</Button>
                                </div>
                                <Card className="left" size="medium" title="Graph">
                                    <Button onClick={this.getData}>
                                        Save Graph <Icon type="save" />
                                    </Button>
                                </Card>
                            </Col>

                        </Row>
                        <Row>
                            {this.state.arr && this.state.arr.forEach((ele) => {
                                return <h6>{ele.Value}</h6>
                            })}
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
