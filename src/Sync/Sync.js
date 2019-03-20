import React, { Component } from 'react';

//antd for ui components
import { Card, Button, Icon, Row, Col, Timeline } from 'antd'

//db
import db from '../Database/database'
import user from '../Services/User'

class Sync extends Component {

    state = {
        showProgress: false,
        DataDownloads: []
    }

    startDownload = () => {
        let rootURL = "https://essd-backend-dev.azurewebsites.net/api"
        //let rootURL = "http://localhost:9000/api"
        let downloads = [
            {
                //Todo: scope the user requests as per the user's roles
                dataName: "user",
                callback: (data) => {
                    return new Promise((resolve) => {
                        db.User.clear().then(() => {
                            db.User.bulkAdd(data.users).then(() => {
                                resolve(true)
                            }).catch((e) => {
                                console.log(e)
                                resolve(false)
                            })
                        })
                    })
                },
                url: `${rootURL}/users/getAllUsers/${this.state.user.Id}`
            },
            {
                //Todo: Scope the location request as per the user's authorized locations
                dataName: "location",
                callback: (data) => {
                    return new Promise((resolve) => {
                        Promise.all([db.State.clear(), db.LGA.clear(), db.Ward.clear(), db.Facility.clear()]).then(
                            Promise.all([
                                db.State.bulkAdd(data.State),
                                db.LGA.bulkAdd(data.LGA),
                                db.Ward.bulkAdd(data.Ward),
                                db.Facility.bulkAdd(data.Facility),
                            ]).then(
                                resolve(true)
                            ).catch(
                                resolve(false)
                            )
                        ).catch(
                            resolve(false)
                        )
                    })
                },
                url: `${rootURL}/locationsHierarchy`
            },
            {
                dataName: "metric values",
                callback: (data) => {
                    return new Promise((resolve) => {
                        Promise.all([db.Data.clear()]).then(
                            Promise.all([
                                db.Data.bulkAdd(data.Data)
                            ]).then(
                                resolve(true)
                            ).catch(
                                resolve(false)
                            )
                        ).catch(
                            resolve(false)
                        )
                    })
                },
                //TODO: Scope URL to user 
                url: `${rootURL}/data/location?state=Zamfara&lga=Anka&ward=Bagega`
            },
            {
                dataName: "metric names",
                callback: (data) => {
                    return new Promise((resolve) => {
                        Promise.all([db.Groups.clear(), db.Sets.clear(), db.Metrics.clear()]).then(
                            Promise.all([
                                db.Groups.bulkAdd(data.Groups),
                                db.Sets.bulkAdd(data.Sets),
                                db.Metrics.bulkAdd(data.Metrics),
                            ]).then(
                                resolve(true)
                            ).catch(
                                resolve(false)
                            )
                        ).catch(
                            resolve(false)
                        )
                    })
                },
                url: `${rootURL}/data/hierarchy`
            }
        ]
        let dl = []
        for (let i = 0; i < downloads.length; i++) {
            let dl_i = downloads[i]
            dl.push(
                <DataProgress key={i} dataName={dl_i.dataName} url={dl_i.url} callback={dl_i.callback}></DataProgress>
            )
        }

        //Download or upload dashboard data
        if (!this.state.downloadDashboard) {
            let url = `${rootURL}/dashboard/updateDashboard`
            let params = {
                method: "PUT",
                // body:JSON.stringify({
                //     UserId: this.state.user.Id,
                //     DashboardJson: this.state.dashboardData
                // })
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserId: this.state.user.Id,
                    DashboardJson: JSON.stringify(this.state.dashboardData)
                })
            }
            let callback = (info) => {
                return new Promise(resolve => {
                    resolve(true)
                })
            }
            dl.push(
                <DataProgress key={dl.length} dataName="dashboard information" url={url} callback={callback} params={params} />
            )
        } else {
            let url = `${rootURL}/dashboard/${this.state.user.Id}`
            let callback = (_dashboard) => {
                return new Promise(resolve => {
                    //The naming scheme needs to be cleaned up a bit here...
                    let dashboard = _dashboard.dashboard
                    db.Dashboard.clear().then(() => {
                        if (!dashboard.hasOwnProperty("error")) {
                            let data = JSON.parse(dashboard.DashboardJson)
                            db.Dashboard.bulkAdd(data.dashboards).then(() => {
                                resolve(true)
                            })
                        } else {
                            //User has no dashboard
                            resolve(true)
                        }
                    })
                })

            }
            dl.push(
                <DataProgress key={dl.length} dataName="dashboard information" url={url} callback={callback} />
            )
        }

        this.setState({
            DataDownloads: dl,
            showProgress: true
        })
    }

    componentDidMount() {
        db.Dashboard.toArray().then(dashboards => {
            if (dashboards.length === 0) {
                user.user().then(u => {
                    this.setState({
                        user: u,
                        ready: true,
                        downloadDashboard: true
                    })
                })
            } else {
                user.user().then(u => {
                    this.setState({
                        user: u,
                        ready: true,
                        downloadDashboard: false,
                        dashboardData: {
                            dashboards: dashboards
                        }
                    })
                })
            }

        })

    }

    render() {
        return (
            <div className="center">
                <Card className="rowVMarginTopSm" >
                    <Row className="rowVMarginTopSm">
                        <Col xs={24} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 2 }} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                            <p>
                                <Icon
                                    type="wifi" />&nbsp;
                    Please note: you must have an internet connection.
                        </p>
                            {
                                this.state.ready &&
                                <Button type="primary" onClick={this.startDownload}>Start Sync</Button>
                            }

                        </Col>
                    </Row>
                    <Row>
                        <Col hidden={!this.state.showProgress} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 12, offset: 6 }} lg={{ span: 10, offset: 7 }} xl={{ span: 8, offset: 8 }}>
                            <Timeline className="rowVMarginTopSm">
                                {this.state.DataDownloads}
                            </Timeline>
                        </Col>

                    </Row>
                </Card>
            </div>
        )
    }
}

/**
 * Pass a callback that returns a promise that resolves to true or false
 * so the dataProgress knows if it succeeded or failed
 */
class DataProgress extends Component {

    state = {
        pending: true,
        failed: false
    }

    Icon = () => {
        if (this.state.pending === true) return this.pendingIcon
        if (this.state.failed === true) return this.failedIcon
        return this.completeIcon
    }

    pendingIcon = <Icon type="sync" spin />

    completeIcon = <Icon type="check-circle" className="override-background" />

    failedIcon = <Icon type="close-circle" />

    Message = () => {
        if (this.state.pending === true) return this.pendingMessage
        if (this.state.failed === true) return this.failedMessage
        return this.completeMessage
    }

    pendingMessage = `Downloading ${this.props.dataName} data`

    failedMessage = `Failed to download ${this.props.dataName} data. Please try again later`

    completeMessage = `Successfully updated ${this.props.dataName} data`

    componentDidMount() {
        if (this.props.params) {
            this.get(this.props.url, this.props.callback, this.props.params)
        } else {
            this.get(this.props.url, this.props.callback)
        }

    }

    get = async (url, callback, params) => {
        let promise = await fetch(url, params)
        promise.json().then(data => {
            callback(data).then((result => {
                if (result) {
                    this.setState({
                        pending: false,
                        failed: false
                    })
                } else {
                    this.setState({
                        pending: false,
                        failed: true
                    })
                }
            }))
        })
    }

    render() {
        return (
            <Timeline.Item
                dot={this.Icon()}
            >
                {this.Message()}
            </Timeline.Item>)
    }
}
export default Sync;
