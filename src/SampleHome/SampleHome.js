import React, { Component } from 'react';

import {Row, Col} from 'antd'
import './SampleHome.css';
import MetricSelector from "../MetricSelector/MetricSelector"

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
                    <MetricSelector parentHandler = {this.updateLocation} showData = {true}></MetricSelector>
                    </Col>
                </Row>
                   
            </div>
        );
    }
}

export default App;
