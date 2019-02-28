import React, { Component } from 'react';

//antd for ui components
import { Button, Icon, Row, Col, Timeline} from 'antd'

//db
import db from '../Database/database'

class Sync extends Component {

    state = {
        showProgress : false,
        DataDownloads: []
    }

    startDownload = () =>{
        let rootURL = "https://essd-backend-dev.azurewebsites.net/api"
        let downloads = [
            {
                //Todo: scope the user requests as per the user's roles
                dataName:"user",
                callback: (data) =>{
                    return new Promise ((resolve) =>{
                        db.User.clear().then(()=>{
                            db.User.bulkAdd(data).then(() =>{
                                resolve(true)
                            }).catch((e) => {
                                console.log(e)
                                resolve(false)
                            })
                        })
                    })
                },
                url: `${rootURL}/users/temp/allUsers`
            },
            {
                //Todo: Scope the location request as per the user's authorized locations
                dataName:"location",
                callback: (data) =>{
                    return new Promise ((resolve) =>{
                        Promise.all([db.State.clear(),db.LGA.clear(),db.Ward.clear(),db.Facility.clear()]).then(
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
                dataName:"metric values",
                callback: (data) =>{
                    return new Promise ((resolve) =>{
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
                url: `${rootURL}/data/location?state=TEXAS&lga=AUSTIN&ward=HOUSTON&facility=WAYNE Health Clinic`
            },
            {
                dataName:"metric names",
                callback: (data) =>{
                    return new Promise ((resolve) =>{
                        Promise.all([db.Groups.clear(),db.Sets.clear(),db.Metrics.clear()]).then(
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
        for (let i = 0; i < downloads.length; i++){
            let dl_i = downloads[i]
            dl.push(
                <DataProgress key = {i} dataName = {dl_i.dataName} url = {dl_i.url }callback = {dl_i.callback}></DataProgress>
            )
        }
        this.setState({
            DataDownloads: dl,
            showProgress: true
        })
    }

	render() {
		return (
            <div>
                <Row>
                    <Col>
                        <p>Please Note: You must have an internet connection.</p>
                        <Button type="primary" onClick = {this.startDownload}>Start Sync</Button>
                    </Col>
                    <Col hidden = {!this.state.showProgress}>
                        <Timeline>
                            {this.state.DataDownloads}
                        </Timeline>
                    </Col>
                </Row>
            </div>
		)
	}
}

/**
 * Pass a callback that returns a promise that resolves to true or false
 * so the dataProgress knows if it succeeded or failed
 */
class DataProgress extends Component{

    state = {
        pending: true,
        failed: false
    }

    Icon = () => {
        if (this.state.pending === true) return this.pendingIcon
        if (this.state.failed === true ) return this.failedIcon
        return this.completeIcon
    }    

    pendingIcon = <Icon type="sync" spin/>

    completeIcon = <Icon type="check-circle"/>

    failedIcon = <Icon type = "close-circle"/>

    Message = () =>{
        if (this.state.pending === true) return this.pendingMessage
        if (this.state.failed === true ) return this.failedMessage
        return this.completeMessage
    }

    pendingMessage = `Downloading ${this.props.dataName} data`

    failedMessage = `Failed to download ${this.props.dataName} data. Please try again later`

    completeMessage = `Successfully updated ${this.props.dataName} data`

    componentDidMount(){
        this.get(this.props.url, this.props.callback)
    }

    get = async (url, callback) =>{
        let promise = await fetch(url)
        promise.json().then(data =>{
            callback(data).then((result =>{
                if (result){
                    this.setState({
                        pending: false,
                        failed: false
                    })
                }else{
                    this.setState({
                        pending: false,
                        failed: true
                    })
                }
            }))
        })
    }

    render(){
        return (
            <Timeline.Item 
            dot = {this.Icon()}
            >
                {this.Message()}
            </Timeline.Item>)
    }
}
export default Sync;
