import React, { Component } from 'react'
import {Row, Col, Input, Button} from 'antd'
import db from '../Database/database'
import UserService from '../Services/User';
import { withRouter } from 'react-router-dom'

class Login extends Component {

    state = {
        Email: null,
        Password: null
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
        UserService.login(this.state.Email,this.state.Password).then((success) => {
            if(success){
                //redirect
                this.props.updateDrawer().then((result) => {
                    this.props.history.push('/dashboard');
                });
            }
            else{
                //failed to login
            }
        })
    }

    render(){
        return (
            <div>
                <Row>
                    <Col>
                        <Input 
                            addonBefore={this.preTab("Username")}
                            onChange = {(e) =>{
                                this.handleInput(e.target.value, "Email")
                            }}/>

                        <Input 
                            addonBefore={this.preTab("Password")}
                            onChange = {(e) =>{
                                this.handleInput(e.target.value, "Password")
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

export default withRouter(Login);