import React, { Component } from 'react'

import { Table } from 'antd'
import { Button } from 'antd/lib/radio';

import CreateModifyDeleteUser from './CreateModifyDeleteUser'

const dataSource = [{
    key: '0',
    name: 'Mike LastName',
    permissionLevel: 'Ward', //locationType
    location: "Example Ward",
    email:"mike!"
}, {
    key: '1',
    name: 'John Something',
    permissionLevel: 'National',
    location: "Nigeria",
    email:"John!"
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
        this.setState({showTable: false, selectedUser: dataSource[id]})
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
            <div>
                <Table dataSource={dataSource} columns={this.columns} className = {this.showHideTableClass()}/>
                <div className = {this.showHideDetailViewClass()}>
                    <CreateModifyDeleteUser showTable_f = {this.showTable} user = {this.state.selectedUser} mode = "create"></CreateModifyDeleteUser>
                </div>
              
            </div>
        )
    }
}

export default User;