import React, { Component } from 'react';
import {Row, Col, Table} from 'antd'
import LocationSelector from '../LocationSelector/LocationSelector';
import db from '../Database/database'

const columns = [{
    title: 'Location',
    dataIndex: 'Name',
    key: 'Location',
  }, {
    title: 'Metrics Reported',
    dataIndex: 'MetricsReportedInLastYear',
    key: 'R',
  }, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  }];


class DataQuality extends Component{

    state = {
        
    }

    setLocation = (locationData) =>{
        this.setState({location: locationData})
        if (locationData.Type === "Ward") this.getQualityOfData(locationData.Id)
        console.log(locationData)
    }

    getQualityOfData = (id) =>{
        db.Facility.where({
            parentId: id
        }).toArray().then(arr =>{
            console.log(arr)
        })
    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <LocationSelector
                            parentHandler = {this.setLocation}
                            initialLocation = {{
                                Type: "Ward",
                                Id: "386"
                            }}
                        />
                    </Col>
                </Row>
                
                <Row>
                    <Col>

                    </Col>
                </Row>
            </div>
        )
    }
}

export default DataQuality