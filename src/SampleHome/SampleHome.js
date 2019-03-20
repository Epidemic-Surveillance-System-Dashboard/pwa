import React, { Component } from 'react';

import './SampleHome.css';
import Login from "../Login/Login"
import userService from '../Services/User'

class App extends Component {

    componentWillMount(){
        //If there is a user, automatically redirect to dashboard
        userService.user().then((userObj) => {
            if (userObj !== null){
                this.props.history.replace('/dashboard')
            }
        });
    }

    render() {
        return (
            <Login updateDrawer = {this.props.updateDrawer}></Login>
        );
    }
}

export default App;
