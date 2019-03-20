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
            this.setState({ dataLoaded: true })
        })


    }

    componentWillMount = () => {
        this.populateUsers()
    }

    state = {
        showTable: true,
        selectedUser: null,
        dataLoaded: false,
        currentView: "table"
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
                <Row className="rowVMarginSm" hidden={this.state.dataLoaded}>
                    <Col {...this.colStyle}>

                        <div className="spacing" >
                            <Spin size="large" />
                        </div>
                    </Col>
                </Row>

                {/* Data loaded  */}
                {
                    this.state.currentView === "table" &&
                    <div className="rowVMarginTopSm">

                        <Row className="rowVMarginTopSm" gutter={16}>
                            <Col className="left" xs={{ span: 16, offset: 0 }} sm={{ span: 14, offset: 1 }} md={{ span: 10, offset: 3 }} lg={{ span: 8, offset: 4 }}>
                            </Col>
                            <Col className="right" span={8}>
                                <Button
                                    onClick={this.addUser}
                                    className={this.showHideTableClass()}
                                    icon="user-add"
                                    type="primary"
                                >
                                    Add User
                            </Button>
                            </Col>

                        </Row>
                    </div>

                }

                <Row className="rowVMarginTopSm" gutter={16}>
                    <Col {...this.colStyle}>
                        <Card className="rowVMarginTopSm" >

                            <div className="rowVMarginTopSm">
                                <Table
                                    dataSource={dataSource}
                                    columns={this.columns}
                                    className={this.showHideTableClass()}
                                />

                            </div>

                            {/* Render new component to create a user as required */}
                            {this.state.currentView !== "new" ?
                                null :
                                <div className="rowVMarginTopSm">
                                    <CreateModifyDeleteUser
                                        showTable_f={this.showTable}
                                        user={null}
                                        mode="new"
                                        refreshUsers={this.populateUsers}
                                    />
                                </div>
                            }

                            {/* Render new component to create a user as required */}
                            {this.state.currentView !== "existing" ?
                                null :
                                <div className="rowVMarginTopSm">
                                    <CreateModifyDeleteUser
                                        showTable_f={this.showTable}
                                        user={this.state.selectedUser}
                                        mode="existing"
                                        refreshUsers={this.populateUsers}
                                    />
                                </div>
                            }
                        </Card>

                    </Col>
                </Row>

            </div>

        )
    }
}

export default User;