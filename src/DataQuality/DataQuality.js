import React, { Component } from 'react';
import {Row, Col, Table, Alert} from 'antd'
import LocationSelector from '../LocationSelector/LocationSelector';
import db from '../Database/database'

const columns = [{
    title: 'Location',
    dataIndex: 'Name',
    key: 'Location',
    defaultSortOrder: 'ascend',
    sorter: (a,b) =>{ return a.Name.localeCompare(b.Name, 'en')}
  }, {
    title: 'Data Points',
    dataIndex: 'MetricsReportedInLastYear',
    key: 'Reports',
    sorter: (a,b) =>{ return a.MetricsReportedInLastYear - b.MetricsReportedInLastYear}
  }, {
    title: 'Percent',
    dataIndex: 'Score',
    key: 'Score',
    sorter: (a,b) =>{ return a.MetricsReportedInLastYear - b.MetricsReportedInLastYear}
  }];


class DataQuality extends Component{

    state = {
        ready: false
    }

    setLocation = (locationData) =>{
        this.setState({location: locationData})
        if (locationData.Type === "Ward") this.getQualityOfData(locationData.Id)
    }

    getQualityOfData = (id) =>{
        db.Facility.where({
            parentId: id
        }).toArray().then(arr =>{
            const divisor = 512*12
            arr.forEach(el => {
                el.Score = `${(el.MetricsReportedInLastYear / divisor * 100).toFixed(0)}%`
                el.key = el.Id
            })
            this.setState({
                data: arr,
                ready: true
            })
        })
    }

    render() {
        return (
            <div>
                <Alert message= "This tool reports the amount of data reported in the last year by each facility in a given ward. Use this to identify the facilities that need the most support in the monthly data collection process." banner closable/>
                <Row className = "rowVMarginSm rowVMarginTopSm">
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
                        {this.state.ready &&
                        <Table dataSource = {this.state.data} columns = {columns}></Table>}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DataQuality