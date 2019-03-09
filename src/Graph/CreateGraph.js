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


    render(){
        return (
            <div>
                {this.state.Data ? this.state.Data.Type : undefined}
                <h3>Create a Graph</h3>
                <h4>Select Location</h4>
                <LocationSelector
                    parentHandler = {this.updateLocation}
                    initialLocation = {
                        {
                            Id: "1215",
                            Type: "Facility"
                        }
                    }
                />
                <h4>Select Data</h4>
                <MetricSelector
                    parentHandler = {this.updateData}

                />
                <VisualizerManager
                    Title={this.state.Data !== undefined && this.state.Data.Name !== undefined ? this.state.Data.Name.split("(")[0] : ""}
                    Location = {this.state.Location} //{Name, Id, Type}
                    Data = {this.state.Data} // {Id, Type, TotalOrDistribution="total|none|distribution"}
                    Dates = {{StartDate: new Date("2015-01-01T00:00:00.000Z"), EndDate: new Date("2015-01-01T00:00:00.000Z")}}
                />
            </div>
        )
    }
}

export default CreateGraph