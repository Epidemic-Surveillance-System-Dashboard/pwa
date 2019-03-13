import React, { Component } from 'react'
import { Button, Input, Row, Col, Divider, Popconfirm, message, Select } from 'antd'

import LocationSelector from "../LocationSelector/LocationSelector"

import db from '../Database/database'
import user from '../Services/User'

const userFields = [
    "FirstName",
    "LastName",
    "Phone",
    "Email",
    "Id",
    "LocationId",
    "LocationType",
    "UserType",
    "LocationName"
]

class CreateModifyDeleteUser extends Component {

    componentDidMount() {
        if (this.props.mode === "new")
            this.enableEditing()
        
            user.user().then((result) => {
                this.setState({
                    ready: true,
                    loggedInUser: result
                })
            })
        
    }

    componentWillMount() {
        this.setState({
            userInfo: this.computedState(this.props.user),
            passedUser: this.props.user
        })
    }
    

    componentDidUpdate(oldProps) {
        const newProps = this.props
        if (oldProps.user !== newProps.user) {
            this.setState({
                passedUser: this.props.user,
                userInfo: this.computedState(newProps.user)
            })
        }

    }

    inputLabelTab = (text) => {
        return (
            <div style={{ minWidth: "90px", textAlign: "right" }}>
                {text}
            </div>
        )
    }

    state = {
        mode: this.props.mode ? this.props.mode : "view", //View (default unless overridden), create, or edit,
        userChanged: false,
        disabled: true,
        locationDisabled: true,
        loggedInUser: null
        //userInfo holds current computed properties (including modifications)
        //passedUser holds the original user information
    }

    computedState(user) {

        let userState = {}

        if (user == null) {
            for (let i = 0; i < userFields.length; i++) {
                userState[userFields[i]] = null
            }
        } else {
            for (let i = 0; i < userFields.length; i++) {
                if (userFields[i] in this.props.user) {
                    userState[userFields[i]] = this.props.user[userFields[i]]
                } else {
                    userState[userFields[i]] = null
                }
            }
        }
        return userState
    }

    //If this is the user, then they can change the password.
    //Otherwise, this is an admin, who can reset a password.
    isUser = () => {
        return true
    }

    confirmDelete = async () => {
        let url = `https://essd-backend-dev.azurewebsites.net/api/users/deleteUser/${this.state.passedUser.Id}`
        //Send Delete HTTP Request
        let deleteRequest = await fetch(url, { method: "delete" })
        deleteRequest.json().then((data) => {
            db.User.delete(this.state.passedUser.Id).then(() => {
                message.success("Successfully deleted user.")
                this.props.refreshUsers()
            })
        })
            .catch((error) => {
                message.error("Sorry, something went wrong.")
            })
    }

    adminFeatures = () => {
        //Only show delete this is a secondary view (ie showTable_f exists)
        if (this.props.user != null && this.props.showTable_f !== null) return (
            <div>
                <Col className="right">
                    <Popconfirm placement="topRight" title="Are you sure you want to delete this user? This action cannot be reverted." onConfirm={this.confirmDelete} okText="Delete" cancelText="Cancel">
                        <Button type="danger">Delete User</Button>
                    </Popconfirm>
                </Col>

            </div>
        )
        return null
    }

    ///Todo: generate function to update state

    inputChanged = (stateName, e) => {
        let user = this.state.userInfo
        user[stateName] = e.target.value
        this.setState({ userInfo: user })
        this.userInformationChanged()
    }

    handleUserTypeSelect(value) {
        let user = this.state.userInfo
        user["UserType"] = value
        this.setState({ userInfo: user },() => {console.log(this.state.userInfo)})
        //this.userInformationChanged()
    }

    basicFeatures = () => {
        console.log(this.state.mode);
        let basicFeatures = [
            "First Name",
            "Last Name",
            "Phone",
            "Email"
            
        ]

        let array = []

        for (let i = 0; i < basicFeatures.length; i++) {
            let featureName = basicFeatures[i]
            let featureNameKey = featureName.replace(" ", "")   //e.g. "First Name" -> user.FirstName
            array.push(
                <Input addonBefore={this.inputLabelTab(featureName)}
                    value={this.state.userInfo ? this.state.userInfo[featureNameKey] : ""}
                    disabled={this.state.disabled || (featureName == "Email" && this.state.mode == "existing")}
                    key={i}
                    onChange={(e) => { this.inputChanged(featureNameKey, e) }} />
            )
        }

        let allUserTypeOptions = [];

        switch (this.state.userInfo.UserType) {
            case "superadmin":
                allUserTypeOptions = [
                    <Select.Option key={1} value="superadmin">Super Admin</Select.Option>,
                    <Select.Option key={2} value="admin">Admin</Select.Option>,
                    <Select.Option key={3} value="user">User</Select.Option>
                ];
                break;
            case "admin":
                allUserTypeOptions = [
                    <Select.Option key={2} value="admin">Admin</Select.Option>,
                    <Select.Option key={3} value="user">User</Select.Option>
                ];
                break;
            case "user":
                allUserTypeOptions = [
                    <Select.Option key={3} value="user">User</Select.Option>
                ];
                break;
        }

        if(this.state.mode == "new"){
            switch (this.state.loggedInUser.UserType) {
                case "superadmin":
                    allUserTypeOptions = [
                        <Select.Option key={2} value="admin">Admin</Select.Option>,
                        <Select.Option key={3} value="user">User</Select.Option>
                    ];
                    break;
                case "admin":
                    allUserTypeOptions = [
                        <Select.Option key={3} value="user">User</Select.Option>
                    ];
                    break;
            }
        }
        

        return (
            <div>{this.state.ready && <Col>
                <Divider />
                {array}
                <Select style={{ width: "100%" }} defaultValue={this.state.userInfo.UserType != null? this.state.userInfo.UserType : "user"} placeholder="User Type" onChange={(e)=>{this.handleUserTypeSelect(e)}} disabled={this.state.loggedInUser.Id == this.state.userInfo.Id ? true : this.state.disabled}>
                    {allUserTypeOptions}
                </Select>
                <Divider />
                {/* Location */}
                <p>Location</p>
                {/* Todo: add max scope depending on admin rights*/}
                <LocationSelector
                    parentHandler={this.updateLocation}
                    showLocation={true}
                    initialLocation={{ Id: this.state.userInfo.LocationId, Type: this.state.userInfo.LocationType }}
                    disabled={this.state.loggedInUser.Id == this.state.userInfo.Id ? true : this.state.disabled}
                    maxScope={{Type: this.state.loggedInUser.LocationType, Id: this.state.loggedInUser.LocationId}}/>
            </Col>
            }
            </div>
        )

    }

    updateLocation = (location) => {
        let userInfo = this.state.userInfo
        userInfo.LocationId = location.Id
        userInfo.LocationType = location.Type
        this.setState({
            userInfo: userInfo
        })
    }

    modifyControls = () => {
        if (this.state.disabled) return (
            <div>
                <Button onClick={this.enableEditing}>Edit</Button>
            </div>
        );
        else return (
            <div>
                <Button hidden={this.state.mode === "new"} onClick={this.cancelEditing}>Cancel</Button>
                <Button disabled={!this.state.userChanged} onClick={this.save}>Save</Button>
            </div>
        )
    }

    cancelEditing = () => {
        let user = this.computedState(this.state.passedUser)
        this.setState({
            userInfo: user,
            disabled: true,
            locationDisabled: true,
        })
        this.userInformationChanged()
    }

    enableEditing = () => {
        user.user().then(u => {
            if (u.userType === "admin") {
                this.setState({
                    disabled: false,
                    locationDisabled: false,
                })
            } else {
                this.setState({
                    disabled: false,
                    locationDisabled: true,
                })
            }
            this.userInformationChanged()
        })
    }

    userInformationChanged = () => {
        //Todo: error checking here for valid inputs
        let changed = false
        if (this.props.mode === "new") {
            changed = true
        } else {
            for (let i = 0; i < userFields.length; i++) {
                if (this.state.userInfo[userFields[i]] !== this.state.passedUser[userFields[i]]) {
                    changed = true
                    break
                }
            }
        }
        this.setState({ userChanged: changed })
    }

    save = async () => {
        let url, successMessage, errorMessage, method = ""
        let successHandler = () => { }
        let userObject = this.state.userInfo
        
        if(userObject.UserType == null) 
            userObject.UserType = "user"

        if (this.state.mode === "new") {
            //Create User
            //userObject.UserType = "user" //hardCode for now
            delete userObject.Id
            url = "https://essd-backend-dev.azurewebsites.net/api/users/register"
            successMessage = "Successfully added user."
            errorMessage = "Failed to create user. Please try again later."
            method = "POST"
            successHandler = (result) => {
                if ("Id" in result) {
                    userObject.Id = result.Id
                    db.User.add(userObject).then(() => {
                        message.success(successMessage)
                        this.props.refreshUsers()
                        this.cancelEditing()
                    })
                } else {
                    console.log('throwing an error')
                    throw new Error(result.error)
                }

            }
        } else {

            //Update User
            //userObject.UserType = "user" //hardCode for now
            url = "https://essd-backend-dev.azurewebsites.net/api/users/updateUser"
            successMessage = "Successfully updated user."
            errorMessage = "Failed to update user. Please try again later."
            method = "PUT"
            successHandler = (result) => {
                if (result.result === "Update successful") {
                    if(this.state.loggedInUser.Id == userObject.Id){
                        db.LocalUser.put(userObject).then(() => {
                            message.success(successMessage)
                            this.props.refreshUsers()
                            //this.cancelEditing()
                            this.setState({
                                user: userObject,
                                disabled: true,
                                locationDisabled: true,
                            })
                        })
                    }
                    else{
                        db.User.put(userObject).then(() => {
                            message.success(successMessage)
                            this.props.refreshUsers()
                            //this.cancelEditing()
                            this.setState({
                                user: userObject,
                                disabled: true,
                                locationDisabled: true,
                            })
                            this.passedUser = userObject;
                        })
                    }
                    
                }
            }
        }

        let request = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userObject),
        })

        request.json().then(successHandler)
            .catch((error) => {
                console.log(error)
                message.error(errorMessage)
            })

    }

    back = () => {
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
    render() {
        return (
            <div>
                {
                    this.state.ready &&
                    <div>
                        {
                            this.props.showTable_f &&
                            <Row className="rowVMarginSm ">
                                <Col>
                                    <Button onClick={this.back} icon="caret-left">Back</Button>
                                </Col>
                            </Row>
                        }
                        <Row className="rowVMarginSm">
                            <h3>User Details</h3>
                            {this.modifyControls()}
                            {this.basicFeatures()}
                            <Divider />
                            {this.adminFeatures()}
                        </Row>

                    </div>
                }


            </div>
        )
    }
}

export default CreateModifyDeleteUser;