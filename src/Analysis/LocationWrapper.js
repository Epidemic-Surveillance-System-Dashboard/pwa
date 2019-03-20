import React, { Component } from 'react';

import {  Button, Divider, Row, Col } from 'antd'
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
                <LocationSelector parentHandler={this.updateLocation} showLocation={false} initialLocation={
                    {
                        Id: "1215",
                        Type: "Facility"
                    }
                }//this.state.location}>
                ></LocationSelector>
                <Divider />
                <Row>
                    <Col span = {12}> <Button type = "primary" onClick={this.saveLocation}>Add</Button></Col>
                    <Col className = "right" span = {12}> <Button onClick={this.cancelLocation}>Cancel</Button></Col>
                </Row>
               
                

            </div>
        )
    }
}
export default LocationWrapper;
