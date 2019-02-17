import React, { Component } from 'react'
import {Button, Input, Row, Col, Divider} from 'antd'


const userFields = [
    "FirstName",
    "LastName",
    "Email",
    "Phone",
    "Id"
]

class CreateModifyDeleteUser extends Component {

    componentWillMount(){
        this.setState({userInfo: this.computedState(this.props.user)})
        this.setState({passedUser: this.props.user})
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.user !== newProps.user) {
            this.setState({passedUser: this.props.user})
            this.setState({userInfo: this.computedState(newProps.user)})
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

    inputLabelTab = (text) =>{
        return(
            <div style={{minWidth: "90px", textAlign:"right"}}>
                {text}
            </div>
        )
    }
    
    state = {
        mode: this.props.mode ? this.props.mode : "view", //View (default unless overridden), create, or edit,
        userChanged: false,
        disabled: true

        //userInfo holds current computed properties (including modifications)
        //passedUser holds the original user information
    }

    computedState(user){

        let userState = {}

        if (user == null){
            for (let i = 0; i < userFields.length; i++){
                userState[userFields[i]] = null
            }
        }else{
            for (let i = 0; i < userFields.length; i++){
                if (userFields[i] in this.props.user){
                    userState[userFields[i]] = this.props.user[userFields[i]]
                }else{
                    userState[userFields[i]] = null
                }
            }
        }
        return userState
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

    ///Todo: generate function to update state

    inputChanged = (stateName,e) =>{
        let user = this.state.userInfo
        user[stateName] = e.target.value
        this.setState({userInfo: user})
        this.userInformationChanged()
    }

    basicFeatures = () => {

        let basicFeatures = [
            "First Name",
            "Last Name",
            "Email",
            "Phone"
        ]

        let array = []

        for (let i = 0; i < basicFeatures.length; i++){
            let featureName = basicFeatures[i]
            let featureNameKey = featureName.replace(" ","")   //e.g. "First Name" -> user.FirstName
            array.push(
                <Input addonBefore = {this.inputLabelTab(featureName)}
                    value = {this.state.userInfo[featureNameKey]}
                    disabled={this.state.disabled}
                    key = {i}
                    onChange = {(e) =>{this.inputChanged(featureNameKey,e)}}/>
            )
        }  

        if (this.props.user != null) return (
            <Col>
                {array}
            </Col>
        )

        return null
    }

    modifyControls = () => {
        if (this.state.disabled) return (
            <div>
                <Button onClick = {this.enableEditing}>Edit</Button>
            </div>
        );
        else return (
            <div>
                <Button onClick = {this.cancelEditing}>Cancel</Button>
                <Button disabled = {!this.state.userChanged}>Save</Button>
            </div>
        )
    }

    cancelEditing = () =>{
        let user = this.computedState(this.state.passedUser)
        this.setState({userInfo: user})
        this.setState({disabled:true})
        this.userInformationChanged()
    }

    enableEditing = () => {
        this.setState({disabled:false})
        this.userInformationChanged()
    }

    userInformationChanged = () =>{
        let changed = false
        for (let i = 0; i < userFields.length; i++){
            if (this.state.userInfo[userFields[i]] !== this.state.passedUser[userFields[i]]){
                changed = true
                break
            }
        }
        this.setState({userChanged: changed})
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
                <Row className="rowVMarginSm rowVMarginTopSm">
                    <Col>
                        <Button onClick = {this.props.showTable_f} icon="caret-left">Back</Button>
                    </Col>
                </Row>
                <Row className="rowVMarginSm">
                    <h2>
                        User Details
                    </h2>
                    {this.modifyControls()}
                    {this.basicFeatures()}
                    <Divider/>
                    {this.passwordFeatures()}
                    
                </Row>
                
            </div>
        )
    }
}

export default CreateModifyDeleteUser;