import React, { Component } from 'react'

import { Card, Row, Col, Table, Spin, Button } from 'antd'

import CreateModifyDeleteUser from './CreateModifyDeleteUser'

import db from '../Database/database'

let dataSource = []

class User extends Component {

    populateUsers = () => {
        db.User.toArray((array) => {
            array.forEach((element) => {
                //Create additional properties as required
                element.key = element.Id
                element.name = `${element.FirstName} ${element.LastName}`
                element.permissionLevel = element.LocationType.charAt(0).toUpperCase() + element.LocationType.slice(1)
            })

            dataSource = array.sort((a, b) => {
                //Sort by last name, then first name
                try {
                    let lastNameCompare = a.LastName.localeCompare(b.LastName)
                    if (lastNameCompare === 0) {
                        return a.FirstName.localeCompare(b.FirstName)
                    } else {
                        return lastNameCompare
                    }

                } catch (e) {
                    return -1
                }
            })
            //Show Table once data is loaded
            this.setState({
                currentView: "table"
            })     
        })


    }

    componentWillMount = () => {
        this.populateUsers()
    }

    state = {
        showTable: true,
        selectedUser: null,
        currentView: "loading"
    }

    columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        defaultSortOrder: 'descend',
        sorter: (a, b) => { return a.name.localeCompare(b.name, 'en') }
    }, {
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
        dataIndex: "LocationName",
        key: "LocationName",
        defaultSortOrder: 'descend',
        sorter: (a, b) => { return a.LocationName.localeCompare(b.LocationName, 'en') }
    }, {
        title: "Action",
        key: "action",
        render: (text, record) => <Button onClick={() => { this.editUser(record.key) }}>View</Button>

    }];

    editUser = (id) => {
        let newUser = dataSource.find(object => {
            return object.Id === id
        })

        this.setState({
            currentView: "existing",
            selectedUser: newUser
        })

    }

    showWhenCurrentViewIs = (viewType, classNames) => {
        //Hide this class when the current view matches the view type
        if (this.state.currentView === viewType) return classNames
        return `${classNames} displayNone`
    }

    showHideTableClass = () => {
        return this.state.currentView === "table" ? "" : "displayNone"
    }

    showHideViewClass = () => {
        return this.state.currentView === "existing" ? "" : "displayNone"
    }

    showTable = () => {
        this.setState(
            { currentView: "table" }
        )
    }

    addUser = () => {
        this.setState({
            currentView: "new"
        })
    }

    tableHidden = () => {
        return this.state.currentView !== "table"
    }

    colStyle = {
        xs: { span: 24, offset: 0 },
        sm: { span: 22, offset: 1 },
        md: { span: 18, offset: 3 },
        lg: { span: 16, offset: 4 }
    }

    render() {

        return (
            <div>
                {/* Data not yet loaded  */}
                <Row className={this.showWhenCurrentViewIs("loading", "rowVMarginSm")}>
                    <Col {...this.colStyle}>
                        <div className="spacing" >
                            <Spin size="large" />
                        </div>
                    </Col>
                </Row>

                {/* Data loaded  */}
                <div className={this.showWhenCurrentViewIs("table", "")}>
                    <Row className="rowVMarginTopSm" gutter={16}>
                        <Col className="left" xs={{ span: 16, offset: 0 }} sm={{ span: 14, offset: 1 }} md={{ span: 10, offset: 3 }} lg={{ span: 8, offset: 4 }}>
                        </Col>
                        <Col className="right" span={8}>
                            <Button
                                onClick={this.addUser}
                                icon="user-add"
                                type="primary">
                                Add User
                            </Button>
                        </Col>
                    </Row>
                    <Row className="rowVMarginTopSm">
                        <Col {...this.colStyle}>
                            <Table
                                dataSource={dataSource}
                                columns={this.columns}
                                className={this.showWhenCurrentViewIs("table", "")}
                            />
                        </Col>
                    </Row>
                </div>

                {/* UI to create a new user */}
                <div className = {this.showWhenCurrentViewIs("new", "")}>
                    <Row className="rowVMarginTopSm" gutter={16}>
                        <Col {...this.colStyle}>
                            <div>
                                <CreateModifyDeleteUser
                                    showTable_f={this.showTable}
                                    user={null}
                                    mode="new"
                                    refreshUsers={this.populateUsers}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* UI to edit an existing user */}
                <div className = {this.showWhenCurrentViewIs("existing", "")}>
                    <Row className="rowVMarginTopSm" gutter={16}>
                        <Col {...this.colStyle}>
                            <div>
                                <CreateModifyDeleteUser
                                    showTable_f={this.showTable}
                                    user={this.state.selectedUser}
                                    mode="existing"
                                    refreshUsers={this.populateUsers}
                                />
                            </div>
                        
                        </Col>
                    </Row>
                </div>
            </div>

        )
    }
}

export default User;