import React, { Component } from 'react';
import LocationSelector from '../LocationSelector/LocationSelector';
import MetricSelector from '../MetricSelector/MetricSelector';
import VisualizerManager from '../Visualizer/VisualizerManager';


class CreateGraph extends Component {

    state = {
        Location: undefined,
        Data: undefined
    }

    updateLocation = (location) =>{
        console.log(location)
        this.setState({Location: location})
    }

    updateData = (data) =>{
        console.log(data)
        this.setState({Data: data})
    }
    



// 

// {
//     Title: "Facility Attendance Female, 29d-11 months",
//     LocationName:"za Bagega Primary Health Centre",
//     LocationId: "1215",
//     LocationType : "Facility",
//     DataId : "11729",
//     DataType : "Metric",
//     StartDate : new Date("2015-01-01T00:00:00.000Z"),
//     EndDate :  new Date("2015-12-01T00:00:00.000Z"),
//     GraphId: 0
// },


    render(){
        return (
            <div>
                {this.state.Data ? this.state.Data.Type : undefined}
                <h3>Create a Graph</h3>
                <h4>Select Location</h4>
                <LocationSelector
                    parentHandler = {this.updateLocation}
                />
                <h4>Select Data</h4>
                <MetricSelector
                    parentHandler = {this.updateData}
                />
                <VisualizerManager
                    Title="Hi"
                    LocationName={this.state.Location? this.state.Location.Name : undefined}
                    LocationId = {this.state.Location? this.state.Location.Id : undefined}
                    LocationType={this.state.Location? this.state.Location.Type : undefined}
                    DataId = {this.state.Data ? this.state.Data.Id : undefined}
                    DataType = {this.state.Data ? this.state.Data.Type : undefined}
                    StartDate = {new Date("2015-01-01T00:00:00.000Z")}
                    EndDate = {new Date("2015-12-01T00:00:00.000Z")}
                    DataPresentation = {this.state.Data? this.state.Data.TotalOrDistribution : undefined}
                />
            </div>
        )
    }
}

export default CreateGraph