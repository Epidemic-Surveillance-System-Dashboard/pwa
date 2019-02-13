import React, { Component } from 'react'
import {Button, Form, Input, Select, Row, Col} from 'antd'

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
        user: this.props.user
    }

    computedState(user){
        let userState = {}

        let fields = [
            "firstName",
            "lastName",
            "email",
            "scope",
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
                <Col {...this.labelStyle}>
                    User Type:
                </Col>
                <Col {...this.inputStyle}>
                    <Input value = {this.state.userInformation.userType}/>
                </Col>
            </div>
        )
        return null
    }   

    upperCaseFirstLetter = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    adminFeatures = () =>{

        //If not admin return null

        //Disable select options that the admin doesn't have access to.
        let adminScope = "state"
        let selectOptions = []
        let scopes = ["facility", "ward", "lga", "state", "national"]
        let scopeLevel = scopes.indexOf(adminScope)
        if (scopeLevel >= 0){
            for (let i = 0; i < scopes.length; i++){
                if (i > scopeLevel){
                    selectOptions.push(
                        <Select.Option disabled value={scopes[i]} key = {i}>{this.upperCaseFirstLetter(scopes[i])}</Select.Option>
                    )
                } else{
                    selectOptions.push(
                        <Select.Option value={scopes[i]} key = {i}>{this.upperCaseFirstLetter(scopes[i])}</Select.Option>
                    )
                }
            }
        }
        
        else return null

        return(
            <div>
                <Col {...this.labelStyle}>
                    Scope:
                </Col>
                <Col {...this.inputStyle}>
                    <Select defaultValue={this.state.scope}>
                        {selectOptions}
                    </Select>
                </Col>
                <Col {...this.labelStyle}>
                    Location:
                </Col>
                <Col {...this.inputStyle}>
                    This will be a tree scoped to the above location
                </Col>
            </div>
        )
    }

    basicFeatures = () => {
        if (this.props.user != null) return (
            <div>
                <Col {...this.labelStyle}>
                    First Name:
                </Col>
                <Col {...this.inputStyle}>
                    <Input value = {this.state.userInformation.firstName}/>
                </Col>
                <Col {...this.labelStyle}>
                    Last Name:
                </Col>
                <Col {...this.inputStyle}>
                    <Input value = {this.state.userInformation.lastName}/>
                </Col>
                <Col {...this.labelStyle}>
                    Email:
                </Col>
                <Col {...this.inputStyle}>
                    <Input value = {this.state.userInformation.email}/>
                </Col>
                <Col {...this.labelStyle}>
                    Phone:
                </Col>
                <Col {...this.inputStyle}>
                    <Input value = {this.state.userInformation.phone}/>
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
                <Button onClick = {this.props.showTable_f}>Back</Button>
                <Row>
                    <Form>
                    {this.basicFeatures()}
                    {this.passwordFeatures()}
                    {this.adminFeatures()}
                    </Form>
                </Row>
                
            </div>
        )
    }
}

export default CreateModifyDeleteUser;