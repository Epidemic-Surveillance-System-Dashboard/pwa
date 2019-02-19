import React, { Component } from 'react'
import {Button, Input, Row, Col, Divider, Popconfirm, message} from 'antd'
import db from '../Database/database'

const userFields = [
    "FirstName",
    "LastName",
    "Email",
    "Phone",
    "Id"
]

class CreateModifyDeleteUser extends Component {

    componentDidMount(){
        if (this.props.mode === "new") this.enableEditing()
    }

    componentWillMount(){
        this.setState({
            userInfo: this.computedState(this.props.user),
            passedUser: this.props.user
        })
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.user !== newProps.user) {
            this.setState({
                passedUser: this.props.user,
                userInfo: this.computedState(newProps.user)
            })
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

    confirmDelete = async () =>{
        let url = `https://essd-backend-dev.azurewebsites.net/api/users/deleteUser/${this.state.passedUser.Id}`
        //Send Delete HTTP Request
        let deleteRequest = await fetch(url, {method: "delete"})
        deleteRequest.json().then((data) =>{
            db.User.delete(this.state.passedUser.Id).then(() =>{
                message.success("Successfully deleted user.")
                this.props.refreshUsers()
            })
        })
        .catch((error) =>{
            message.error("Sorry, something went wrong.")
        })
    }

    adminFeatures = () =>{
        if (this.props.user != null) return(
            <div>
                <Col className="right">
                    <Popconfirm placement="topRight" title="Are you sure you want to delete this user? This action cannot be reverted." onConfirm={this.confirmDelete} okText="Delete" cancelText="Cancel">
                        <Button type ="danger">Delete User</Button>
                    </Popconfirm>
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
                    value = {this.state.userInfo ? this.state.userInfo[featureNameKey] : ""}
                    disabled={this.state.disabled}
                    key = {i}
                    onChange = {(e) =>{this.inputChanged(featureNameKey,e)}}/>
            )
        }  

        return(
            <Col>
                {array}
            </Col>
        )

    }

    modifyControls = () => {
        if (this.state.disabled) return (
            <div>
                <Button onClick = {this.enableEditing}>Edit</Button>
            </div>
        );
        else return (
            <div>
                <Button hidden = {this.state.mode === "new"} onClick = {this.cancelEditing}>Cancel</Button>
                <Button disabled = {!this.state.userChanged} onClick = {this.save}>Save</Button>
            </div>
        )
    }

    cancelEditing = () =>{
        let user = this.computedState(this.state.passedUser)
        this.setState({
            userInfo: user,
            disabled:true
        })
        this.userInformationChanged()
    }

    enableEditing = () => {
        this.setState({disabled:false})
        this.userInformationChanged()
    }

    userInformationChanged = () =>{
        //Todo: error checking here for valid inputs
        let changed = false
        if (this.props.mode === "new") {
            changed = true
        }else{
            for (let i = 0; i < userFields.length; i++){
                if (this.state.userInfo[userFields[i]] !== this.state.passedUser[userFields[i]]){
                    changed = true
                    break
                }
            }
        }
        this.setState({userChanged: changed})
    }

    save = async () =>{
        let url, successMessage, errorMessage, method = ""
        let successHandler = () => {}
        let userObject = this.state.userInfo

        if (this.state.mode === "new"){
            //Create User
            userObject.UserType = "user" //hardCode for now
            delete userObject.Id
            url = "https://essd-backend-dev.azurewebsites.net/api/users/addUser"
            successMessage = "Successfully added user."
            errorMessage = "Failed to create user. Please try again later."
            method = "POST"
            successHandler = (result) =>{
     
                userObject.Id = result[0].Id
                db.User.add(userObject).then(() =>{
                    message.success(successMessage)
                    this.props.refreshUsers()
                })
        
 
            }
        }else{

            //Update User
            userObject.UserType = "user" //hardCode for now
            url = "https://essd-backend-dev.azurewebsites.net/api/users/updateUser"
            successMessage = "Successfully updated user."
            errorMessage = "Failed to update user. Please try again later."
            method = "PUT"
            successHandler = (result) =>{
                if (result.result === "update success"){                
                    db.User.put(userObject).then(() =>{
                        message.success(successMessage)
                        this.props.refreshUsers()
                    })
                }
            }
        }
        console.log(userObject)
        let request = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userObject),
        })
        console.log(request)
        request.json().then(successHandler)
        .catch((error) =>{
            message.error(errorMessage)
        })

    }

    back = () =>{
        //Remove any changes before executing callback
        this.cancelEditing()
        this.props.showTable_f()
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
                <Row className="rowVMarginSm ">
                    <Col>
                        <Button onClick = {this.back} icon="caret-left">Back</Button>
                    </Col>
                </Row>
                <Row className="rowVMarginSm">
                    <h2>
                        User Details
                    </h2>
                    {this.modifyControls()}
                    {this.basicFeatures()}
                    <Divider/>
                    {this.adminFeatures()}
                    
                </Row>
                
            </div>
        )
    }
}

export default CreateModifyDeleteUser;