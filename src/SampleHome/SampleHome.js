import React, { Component } from 'react';

import {Row, Col} from 'antd'
import './SampleHome.css';
import LocationSelector from "../LocationSelector/LocationSelector"

class App extends Component {

    state = {
        location:null
    }

    updateLocation = (location) =>{
        this.setState({location: location})
    }

    render() {
        return (
            <div className="sampleApp">
                {/* <header className="sampleApp-header">
                    <p>
                        This is the Home Page
                    </p>
                    <h4>{this.state.location ? this.state.location.Name : ""}</h4>
                    <LocationSelector parentHandler = {this.updateLocation} showLocation = {false}></LocationSelector>
                </header> */}
                <Row>
                    <Col>
                    <h4>{this.state.location ? this.state.location.Name : ""}</h4>
                    <LocationSelector parentHandler = {this.updateLocation} showLocation = {true}  maxScope = {{Id:"188", Level :"State"}}></LocationSelector>
                    </Col>
                </Row>
                   
            </div>
        );
    }
}

export default App;
