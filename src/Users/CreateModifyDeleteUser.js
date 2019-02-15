import React, { Component } from 'react'
import {Button, Form, Input, Select, Row, Col, Divider} from 'antd'

class CreateModifyDeleteUser extends Component {

    componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.user !== newProps.user) {
          this.setState({userInformation: this.computedState(newProps.user)})
        }
    }


    labelStyle = {
        xs:{
            span: 6
        }
    }

    inputStyle = {
        xs:{
            span: 18
        }
    }
    
    state = {
        mode: this.props.mode ? this.props.mode : "view", //View (default unless overridden), create, or edit,
        userInformation: this.computedState(this.props.user),
        user: this.props.user,
        disabled: true
    }

    computedState(user){

        let userState = {}

        let fields = [
            "FirstName",
            "LastName",
            "Email",
            "Phone"
        ]

        if (user == null){
            for (let i = 0; i < fields.length; i++){
                userState[fields[i]] = null
            }
        }else{
            for (let i = 0; i < fields.length; i++){
                if (fields[i] in this.props.user){
                    userState[fields[i]] = this.props.user[fields[i]]
                }else{
                    userState[fields[i]] = null
                }
            }
        }
        return userState
    }

    fieldsEnabled = () =>{
        if (!this.canAccess()) return false
        
        if (this.state.mode === "create" || this.state.mode === "edit") return true
        
        return false
    }

    //Required Auth Functions -- implement later
    canAccess = () =>{
        //If the user is an admin and this user is in their jurisidiction
        //OR if the user is a superadmin
        //OR if the current user is the user in question
        return true
    }

    //If this is the user, then they can change the password.
    //Otherwise, this is an admin, who can reset a password.
    isUser = () =>{
        return true
    }

    passwordFeatures = () =>{
        if (this.props.user != null) return(
            <div>
                <Col className="center">
                    <Button type ="danger">Delete User</Button>
                </Col>

            </div>
        )
        return null
    }   

    upperCaseFirstLetter = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    basicFeatures = () => {
        if (this.props.user != null) return (
            <div>
                <Col {...this.labelStyle}>
                    First Name:
                </Col>
                <Col {...this.inputStyle}>
                    <Input  disabled={this.state.disabled} value = {this.state.userInformation.FirstName}/>
                </Col>
                <Col {...this.labelStyle}>
                    Last Name:
                </Col>
                <Col {...this.inputStyle}>
                    <Input  disabled={this.state.disabled} value = {this.state.userInformation.LastName}/>
                </Col>
                <Col {...this.labelStyle}>
                    Email:
                </Col>
                <Col {...this.inputStyle}>
                    <Input disabled={this.state.disabled} value = {this.state.userInformation.Email}/>
                </Col>
                <Col {...this.labelStyle}>
                    Phone:
                </Col>
                <Col {...this.inputStyle}>
                    <Input disabled={this.state.disabled} value = {this.state.userInformation.Phone}/>
                </Col>
            </div>
        );
        return null
    }

/**
 * Always render basic elements (first name, last name, etc)
 * If current user == user viewed => allow changing password
 * else if currentUser.type == admin || == superAdmin allow resetting password
 * TODO: implement this when auth starts to work.
 */
    render(){
        return(
            <div>
                <Button onClick = {this.props.showTable_f} icon="caret-left">Back</Button>

                <Row>
                    
                    {this.basicFeatures()}
                    <Divider/>
                    {this.passwordFeatures()}
                    
                </Row>
                
            </div>
        )
    }
}

export default CreateModifyDeleteUser;