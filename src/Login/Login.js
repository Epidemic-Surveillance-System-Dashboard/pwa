import React, { Component } from 'react'
import {Row, Col, Input, Button} from 'antd'
import db from '../Database/database'

class Login extends Component {

    state = {
        username: null,
        password:null
    }

    handleInput = (value, property) =>{
        this.setState({[property]: value})
    }

    preTab = (text) =>{
        return(
            <div style={{minWidth: "90px", textAlign:"right"}}>
                {text}
            </div>
        )
    }

    login = () => {
        //POST this.state.username and this.state.password
        //return user information
    }

    render(){
        return (
            <div>
                <Row>
                    <Col>
                        <Input 
                            addonBefore={this.preTab("Username")}
                            onChange = {(e) =>{
                                this.handleInput(e.target.value, "username")
                            }}/>

                        <Input 
                            addonBefore={this.preTab("Password")}
                            onChange = {(e) =>{
                                this.handleInput(e.target.value, "password")
                            }}/>
                            
                        <Button type="primary"
                            onClick = {this.login}>
                            Login
                        </Button>
                    </Col>
                    <Col>

                    </Col>
                </Row>

            </div>
        )
    }
}

export default Login;