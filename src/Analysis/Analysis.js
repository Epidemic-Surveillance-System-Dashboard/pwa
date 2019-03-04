import React, { Component } from 'react';
import { Button, List, Card, Row, Col, Select, Divider, Avatar, Menu, Icon, Dropdown, message } from 'antd'

import './Analysis.css';
import LocationSelector from "../LocationSelector/LocationSelector"
import MetricSelector from "../MetricSelector/MetricSelector"

const Option = Select.Option
var dataDict = {};
for (let i = 0; i < 20; i++) {
    var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    var dataPoint = {
        color: color,
        facility: `facility ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        state: `state ${i}`,
        LGA: `LGA ${i}`,
        ward: `Ward ${i}`
    };
    var dataList = [];
    dataDict[dataPoint.facility + dataPoint.ward + dataPoint.LGA + dataPoint.state] = dataPoint;
}


class Analysis extends Component {

    state = {
        location: null,
        initLoading: false,
        loading: false,
        data: dataDict,
        //state-based stuff below
        showTable: true,
        selectedUser: null,
        dataLoaded: false,
        currentView: "table"

    }

    updateLocation = (location) => {
        this.setState({ location: location })
    }
    handleChange = (value) => {
        console.log("boo" + value);
    }
    addLocation = () => {

    }

    editLocation = (location) => {
        /*
        let newUser = dataSource.find(object => {
            return object.Id === id
        })*/

        this.setState({
            currentView: "existing",
            //selectedUser: newUser
        })

    }
    showTable = () => {
        this.setState(
            { currentView: "table" }
        )
    }
    showHideTableClass = () => {
        return this.state.currentView === "table" ? "" : "displayNone"
    }

    render() {
        const { initLoading, loading, list } = this.state;
        const loadMore = !initLoading && !loading ? (
            <div class="center" >
                <Button onClick={this.addLocation}>Add Location</Button>
            </div>
        ) : null;

        return (
            <div>

                {
                    this.state.currentView === "table" &&
                    <div className="center">
                        <Row className={``} gutter={16}>
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                <Card className="left" size="medium" title="Select Metric">
                                    <MetricSelector parentHandler={this.updateLocation} showData={true}></MetricSelector>
                                    <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange()}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="disabled" disabled>Disabled</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                </Card>
                            </Col>
                        </Row>
                        <Divider />
                        <Row className={``} gutter={16}>
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                                <Card className="left" size="medium" title="Select Location">
                                    <List
                                        itemLayout="horizontal"
                                        size="large"
                                        pagination={{
                                            onChange: (page) => {
                                                console.log(page);
                                            },
                                            pageSize: 4,
                                        }}
                                        dataSource={Object.values(dataDict)}
                                        renderItem={item => (
                                            <List.Item
                                                key={item.facility}
                                                actions={[,
                                                    <Button onClick={() => { this.editLocation(item) }} style={{ marginLeft: 8 }}>
                                                        Edit <Icon type="edit" />
                                                    </Button>
                                                ]}>
                                                <List.Item.Meta
                                                    avatar={<Avatar icon="environment" style={{ backgroundColor: item.color }} />}
                                                    title={<a href="https://ant.design">{item.facility}</a>}
                                                    description={
                                                        item.state + " / " + item.LGA + " / " + item.ward
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }


                {this.state.currentView !== "existing" ?
                    null :
                    <div className="">
                        <LocationSelector
                            parentHandler={this.updateLocation} showLocation={false}
                        />
                    </div>
                }
            </div>
        );
    }
}

export default Analysis;
