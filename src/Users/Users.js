import React, { Component } from 'react'

import { Table } from 'antd'
import { Button } from 'antd/lib/radio';

import CreateModifyDeleteUser from './CreateModifyDeleteUser'

const dataSource = [{
    key: '1',
    name: 'Mike LastName',
    permissionLevel: 'Ward', //locationType
    location: "Example Ward"
}, {
    key: '2',
    name: 'John Something',
    permissionLevel: 'National',
    location: "Nigeria"
}];

class User extends Component {

    state = {
        showTable: true,
        selectedUser: null
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
        console.log("start editing user" + id)
        this.setState({showTable: false, selectedUser: id})
    }

    showHideTableClass = () =>{
        console.log(this.state.showTable)
        return this.state.showTable === true ? "" : "displayNone"
    }

    showHideDetailViewClass = () =>{
        console.log(this.state.showTable)
        console.log(this.state.showTable === true ? "displayNone" : "")
        return this.state.showTable === true ? "displayNone" : ""
    }

    showTable = () =>{
        this.setState({showTable: true})
    }

    render() {
        return (
            <div>
                <Table dataSource={dataSource} columns={this.columns} className = {this.showHideTableClass()}/>
                <div className = {this.showHideDetailViewClass()}>
                    <CreateModifyDeleteUser showTable_f = {this.showTable} user = {{firstName:"jack", lastName: "smith",scope:"ward"}} mode = "create"></CreateModifyDeleteUser>
                </div>
              
            </div>
        )
    }
}

export default User;