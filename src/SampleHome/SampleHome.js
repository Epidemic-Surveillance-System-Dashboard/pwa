import React, { Component } from 'react';

import {Row, Col} from 'antd'
import './SampleHome.css';
import MetricSelector from "../MetricSelector/MetricSelector"
import LocationSelector from "../LocationSelector/LocationSelector"
import Login from "../Login/Login"
import userService from '../Services/User'

class App extends Component {

    state = {
        location:null,
        user: {FirstName: "hi"}
    }

    updateLocation = (location) =>{
        this.setState({location: location})
    }

    componentWillMount(){
        userService.login().then(user =>{
            this.setState({user: user})
        })
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
                    User Name is {this.state.user.FirstName}
                </Row>
                <Row>
                    <Col>
                    <h4>{this.state.location ? this.state.location.Name : ""}</h4>
                    <MetricSelector parentHandler = {this.updateLocation} showData = {true}></MetricSelector>
                    </Col>
                </Row>
                <Login>
                    
                </Login>
            </div>
        );
    }
}

export default App;
