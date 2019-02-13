import React, { Component } from 'react';

//antd for ui components
import { Button, Icon, Row, Col } from 'antd'

//db
import db from '../Database/database'

class Sync extends Component {

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

	render() {
		return (
            <div>
                <Row>
                    <Col>
                        You need to be connected to the internet or this won't work!
                        <Button type="primary" onClick = {this.getData}>Get Data!</Button>
                    </Col>
                </Row>
            </div>
		)
	}
}

export default Sync;
