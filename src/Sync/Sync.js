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

    getData = async () =>{
        //Get Data
        console.log('Getting Users')
        let promise = await fetch("https://essd-backend-dev.azurewebsites.net/api/users/getAllUsers/123")
        promise.json().then(data =>{
            db.User.bulkAdd(data.users).then(()=>{
                console.log('Finished')
            }).catch((e) =>{
                console.log(e)
            })
        })   
    }

    startDownload = () =>{
        let downloads = [
            {
                dataName:"Users",
                callback: (data) =>{
                    return new Promise ((resolve) =>{
                        db.User.bulkAdd(data.users).then(() =>{
                            resolve(true)
                        }).catch((e) => {
                            console.log(e)
                            resolve(false)
                        })
                    })
                },
                url: "https://essd-backend-dev.azurewebsites.net/api/users/getAllUsers/123"
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

    completeMessage = `Successfully downloaded ${this.props.dataName} data`

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
