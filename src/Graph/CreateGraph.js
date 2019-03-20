import React, { Component } from 'react';
import LocationSelector from '../LocationSelector/LocationSelector';
import MetricSelector from '../MetricSelector/MetricSelector';
import VisualizerManager from '../Visualizer/VisualizerManager';
import SaveGraph from '../Graph/SaveGraph'
import RangeSelector from '../RangeSelector/RangeSelector'
import { Card, Row, Col, Divider } from 'antd'


class CreateGraph extends Component {

    state = {
        Location: undefined,
        Data: undefined,
        Dates: { StartDate: new Date("2015-01-01T00:00:00.000Z"), EndDate: new Date("2019-01-01T00:00:00.000Z") }
    }

    updateRawData = (rawData) => {
        this.setState({
            RawData: rawData
        })
    }

    updateLocation = (location) => {
        this.setState({ Location: location })
    }

    updateData = (data) => {
        this.setState({ Data: data })
    }
    updateDates = (dates) => {
        this.setState({ Dates: dates });
    }
    createLocationObject = () => {
        let loc = this.state.Location
        let obj = {}
        if (loc !== undefined) {
            let name = `${loc.Type}-${loc.Id}`
            obj[name] = loc
        }
        return obj
    }

    getTitle = () => {
        if (this.state.Data !== undefined) {
            return this.state.Data.Name.split("(")[0]
        }
        return "No title"
    }
    render() {
        return (
            <Card className="left" size="medium" title="Create a Graph">
                <Row className={``} gutter={16}>
                    <Col>
                        <h4>Select Location</h4>
                        <LocationSelector
                            parentHandler={this.updateLocation}
                            initialLocation={{
                                Id: "1215",
                                Type: "Facility"
                            }}
                        />
                    </Col>
                </Row>
                <Divider />
                <Row className={``} gutter={16}>
                    <Col>
                        <h4>Select Data</h4>
                        <MetricSelector
                            parentHandler={this.updateData}
                            initialData={{
                                GroupValue: "1191|Facility Attendance|Group",
                                SetValue: "-3-1191|All Facility Attendance (Distribution)|Group",
                                MetricValue: ""
                            }}
                        />
                    </Col>
                </Row>
                <Divider />
                <Row className={``} gutter={16}>
                    <Col>
                        <h4>Select Date Range</h4>

                        <RangeSelector
                            parentHandler={this.updateDates}
                            initialData={{
                                Dates: this.state.Dates
                            }}
                        />
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col>
                        <h4>Generated Graph</h4>
                        <VisualizerManager
                            Title={this.state.Data !== undefined && this.state.Data.Name !== undefined ? this.state.Data.Name.split("(")[0] : ""}
                            Location={this.state.Location} //{Name, Id, Type}
                            Data={this.state.Data} // {Id, Type, TotalOrDistribution="total|none|distribution"}
                            Dates={this.state.Dates}
                            ParentHandler={this.updateRawData}
                        />

                        <SaveGraph
                            Data={this.state.Data}
                            Dates={this.state.Dates}
                            Locations={this.createLocationObject()}
                            Title={this.getTitle()}
                            RawData={this.state.RawData}
                            ParentHandler={this.props.ParentHandler}
                        />
                    </Col>
                </Row>
            </Card>
        )
    }
}

export default CreateGraph