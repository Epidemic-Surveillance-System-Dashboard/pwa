import React, { Component } from 'react';

import { Select, Button } from 'antd'
import LocationSelector from "../LocationSelector/LocationSelector"



/**
 * Saves the the location selected
 * @param {parentHandler} - Function passed in by the parent that takes a LocationObject with props {Id, Name, Type} and updates the parent UI
 * @param {initialLocation}
 */

class LocationWrapper extends Component {

    state = {
        location: this.props.initialLocation
    }
    componnentDidMount = () => {
        this.setState({
            location: this.props.initialLocation
        });
    }
    notifyParent = (save) => {
        if (this.props.parentHandler !== undefined && this.props.parentHandler !== null) {
            this.props.parentHandler(this.state.location, save);
        }
    }
    updateLocation = (location) => {
        this.setState({ location: location })
    }
    saveLocation = () => {
        this.notifyParent(true);
    }
    cancelLocation = () => {
        this.notifyParent(false);
    }

    render() {
        return (
            <div>
                <Button onClick={this.saveLocation}>Save</Button>
                <Button onClick={this.cancelLocation}>Cancel</Button>
                <LocationSelector parentHandler={this.updateLocation} showLocation={false} initialLocation={this.state.location}></LocationSelector>
            </div>
        )
    }
}
export default LocationWrapper;
