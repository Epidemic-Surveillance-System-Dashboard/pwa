import React, { Component } from 'react';

import {Row, Col} from 'antd'
import './SampleHome.css';
import MetricSelector from "../MetricSelector/MetricSelector"
import LocationSelector from "../LocationSelector/LocationSelector"
import Login from "../Login/Login"
import userService from '../Services/User'
import CreateGraph from '../Graph/CreateGraph';

class App extends Component {

    state = {
        location:null,
        user: null
    }

    updateLocation = (location) =>{
        console.log(location)
        this.setState({location: location})
    }

    componentWillMount(){
        userService.user().then((userObj) => {
            console.log("hello123");
            console.log(userObj);
            this.setState({user: userObj});
        });
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

                {
                    this.state.user == null? <Login updateDrawer = {this.props.updateDrawer}></Login> :  
                    <React.Fragment>
                        <MetricSelector 
                            parentHandler = {this.updateLocation} 
                            showLabel = {true}
                            // disabled = {true}
                            initialData = {{
                                Type: "Group", 
                                Id: "1191",
                                TotalOrDistribution:"Total", //Total | Distribution | None. Applicable if Type === Group or Set.
                                GroupValue: "1191|Facility Attendance|Group",
                                SetValue: "2094|Facility Attendance Male|Set",
                                MetricValue:"-3-2094|All Facility Attendance Male (Distribution)|Set"
                                //This means Group = 1191, and Total for Group
                            }}>
                        </MetricSelector>
                        <Row> User Name is {this.state.user.FirstName} </Row>
                        <Row>
                            <Col>
                            <h4>{this.state.location ? this.state.location.Name : ""}</h4>
                            </Col>
                        </Row>
                    </React.Fragment>
                } */}

                {/* <CreateGraph/> */}
            </div>
        );
    }
}

export default App;
