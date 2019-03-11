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
        data: {
        },//dataDict,
        showTable: true,
        selectedUser: null,
        dataLoaded: false,
        currentView: "table",
        selectedLocation: null,
        addingLocation: false,
        Dates: { StartDate: new Date("2015-01-01T00:00:00.000Z"), EndDate: new Date("2019-01-01T00:00:00.000Z") },
        arr: null
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

    getData = () => {
        var tempData = [];

        for (var key in this.state.data) {
            //this.queryComplexData(this.state.data[key], this.state.metricData);

            console.log(this.state.data[key].Id);
            console.log(this.state.metricData.Id);
            console.log(this.state.metricData.Type);
            console.log(this.formatDate(this.state.Dates.StartDate));
            console.log(this.formatDate(this.state.Dates.EndDate));

            if (this.state.metricData.Type == "Metric") {
                //Normal Bar chart
                db.Data.where(
                    ["FacilityId", "MetricId", 'Time']
                ).between(
                    [this.state.data[key].Id, this.state.metricData.Id, this.formatDate(this.state.Dates.StartDate)],
                    [this.state.data[key].Id, this.state.metricData.Id, this.formatDate(this.state.Dates.EndDate)],
                    true,
                    true
                )
                    .toArray().then((arr) => {
                        this.setState({
                            arr: arr
                        })
                        tempData.push(arr);
                        console.log(tempData);

                    })
            } else if (this.state.metricData.Type == "Set") {

            } else if (this.state.metricData.Type == "Group") {

            }


        }
    }
    /*
    queryComplexData = (location,metric) => {

        //Build Query URL
        let period = "month"

        if (this.state.Dates.StartDate.getUTCFullYear() !== this.state.Dates.EndDate.getUTCFullYear()) period = "year"
        let rootURL = `https://essd-backend-dev.azurewebsites.net/api/data/query?`
        let url = rootURL +
            "LocationId=" + location.Id
            + "&LocationType=" + location.Type
            + "&DataId=" + metric.Id
            + "&DataType=" + metric.Type
            + "&StartDate=" + this.formatDateForRemoteQuery(this.state.Dates.StartDate)
            + "&EndDate=" + this.formatDateForRemoteQuery(this.state.Dates.EndDate)
            + "&Period=" + period
            + "&Distribution=" + metric.TotalOrDistribution

        //Data comes back as an array
        fetch(url, {}).then(stream => stream.json().then(result => {

            if (period === "year") {

                //TODO: Switch to vertical bar graph in the future
                result.forEach(el => {
                    el.Value = Number.parseFloat(el.Total)
                    el.Metric = el.Yr
                })

                result.sort((a, b) => {
                    return a.Yr - b.Yr
                })

                if (metric.TotalOrDistribution === "none" || metric.TotalOrDistribution=== "total") { //== total
                    this.setState({
                        ready: true,
                        data: {
                            data: result,
                            name: this.state.Title
                        },
                        graphType: "Set",

                    })
                } else {

                }
            } else {
                //Period === month
                let graphType = metric.TotalOrDistributionn === "distribution" ? "Set" : "Metric"

                let groupName = "MetricName"
                if (result.length > 0) groupName = result[0].hasOwnProperty("MetricName") ? "MetricName" : "SetName"

                let titleIndex = undefined

                for (let i = 0; i < result.length; i++) {
                    let d = new Date(this.state.Dates.StartDate)
                    d.setUTCMonth(result[i].Month - 1)
                    result[i].Date = d
                    result[i].Value = Number.parseInt(result[i].Total)
                    if (graphType === "Set") {
                        if (result[i][groupName] === this.state.Title) titleIndex = i
                        result[i].Metric = result[i][groupName].replace(`${this.state.Title}, `, "")
                    } else {
                        result[i].Metric = result[i][groupName]
                    }
                }

                if (titleIndex !== undefined) {
                    result.splice(titleIndex, 1)
                }

                this.setState({
                    ready: true,
                    graphType: graphType,
                    data: {
                        data: result,
                        name: this.state.Title
                    }
                })

            }

            if (this.props.ParentHandler) this.props.ParentHandler(result)

            //TODO: store data locally
        }))

    }
*/
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
                                        data={mockGroup}
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
