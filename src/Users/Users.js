import React, { Component } from 'react'

import { Row, Col, Table, Spin } from 'antd'
import { Button } from 'antd/lib/radio';

import CreateModifyDeleteUser from './CreateModifyDeleteUser'

import db from '../Database/database'

let dataSource = []

class User extends Component {

    populateUsers = () =>{
        db.User.toArray((array) =>{
            array.forEach((element) =>{
                //Create additional properties as required
                element.key = element.Id
                element.name = `${element.FirstName} ${element.LastName}`
                element.permissionLevel = "National"
            })
            dataSource = array
            this.setState({dataLoaded:true})

        })
    }

    componentWillMount = () =>{ 
        this.populateUsers()        
    }

    state = {
        showTable: true,
        selectedUser: null,
        dataLoaded:false
    }

    columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },  {
        title: 'Scope',
        dataIndex: 'permissionLevel',
        filters: [{
            text: 'Ward',
            value: 'Ward',
        }, {
            text: 'Facility',
            value: 'Facility',
        }, {
            text: 'LGA',
            value: 'LGA',
        }, {
            text: 'State',
            value: 'State',
        }, {
            text: 'National',
            value: 'National',
        }],
        onFilter: (value, record) => record.permissionLevel === value,
        filterMultiple: true,
    
        key: 'permissionLevel',
    }, {
        title: "Location",
        dataIndex: "location",
        key: "location"
    },  {
        title:"Action",
        key: "action",
        render: (text, record) => <Button onClick = {() =>{this.editUser(record.key)}}>View</Button>

    }];

    editUser = (id) =>{
        this.setState({
            showTable: false, 
            selectedUser: dataSource.find(object =>{
                return object.Id === id
            })
        })
    }

    showHideTableClass = () =>{
        return this.state.showTable === true ? "" : "displayNone"
    }

    showHideDetailViewClass = () =>{
        return this.state.showTable === true ? "displayNone" : ""
    }

    showTable = () =>{
        this.setState({showTable: true})
    }

    

    render() {
        return (
            <Row>
                <Col xs={{ span: 24, offset: 0 }} sm = {{span: 22, offset:1}} md={{ span: 18, offset: 3 }} lg = {{span: 16, offset: 4}}>
                <div className = "spacing" hidden = {this.state.dataLoaded}>
                    <Spin size="large" hidden = {this.state.dataLoaded} />
                </div>
                <div hidden = {!this.state.dataLoaded}>
                    <Table dataSource={dataSource} columns={this.columns} className = {this.showHideTableClass()}/>
                    <div className = {this.showHideDetailViewClass()}>
                        <CreateModifyDeleteUser showTable_f = {this.showTable} user = {this.state.selectedUser} mode = "create" refreshUsers ={this.populateUsers}></CreateModifyDeleteUser>
                    </div>
                </div>        
                </Col>      
            </Row>
        )
    }
}

export default User;