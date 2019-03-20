import React, { Component } from 'react'
import { Row, Col, Input, Button, Card } from 'antd'
import UserService from '../Services/User';
import { withRouter } from 'react-router-dom'

class Login extends Component {

    state = {
        Email: null,
        Password: null
    }

    handleInput = (value, property) => {
        this.setState({ [property]: value })
    }

    preTab = (text) => {
        return (
            <div style={{ minWidth: "90px", textAlign: "right" }}>
                {text}
            </div>
        )
    }

    login = () => {
        UserService.login(this.state.Email, this.state.Password).then((success) => {
            if (success) {
                //redirect
                this.props.updateDrawer().then((result) => {
                    this.props.history.push('/sync');
                });
            }
            else {
                //failed to login
            }
        })
    }

    
    colStyle = {
        xs: { span: 24, offset: 0 },
        sm: { span: 22, offset: 1 },
        md: { span: 16, offset: 4 },
        lg: { span: 10, offset: 7 }
    }


    render() {
        return (
            <Card>
                <Row>
                    <Col {...this.colStyle}>
                        <Input
                            addonBefore={this.preTab("Email")}
                            type="email"
                            onChange={(e) => {
                                this.handleInput(e.target.value, "Email")
                            }}
                            placeholder="Email" />
                        <Input.Password
                            addonBefore={this.preTab("Password")}
                            onChange={(e) => {
                                this.handleInput(e.target.value, "Password")
                            }}
                            placeholder="Password" />
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col {...this.colStyle} className = "center">
                        <Button type="primary"
                            onClick={this.login}>
                            Login
                        </Button>
                    </Col>
                </Row>

            </Card>
        )
    }
}

export default withRouter(Login);