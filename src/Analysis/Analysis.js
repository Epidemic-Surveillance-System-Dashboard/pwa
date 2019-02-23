import React, { Component } from 'react';
import { Button, List, Card, Row, Col, Select, Divider, Avatar, Menu, Icon, Dropdown, message } from 'antd'

import './Analysis.css';
import LocationSelector from "../LocationSelector/LocationSelector"

const Option = Select.Option
const listData = [];
for (let i = 0; i < 20; i++) {
    var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    listData.push({
        color: color,
        facility: `facility ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        state: `state ${i}`,
        LGA: `LGA ${i}`,
        ward: `Ward ${i}`
    });
}


class Analysis extends Component {

    state = {
        location: null,
        initLoading: false,
        loading: false,
        list: listData,
    }
    handleMenuClick = (location) =>{
        message.info('Click on menu item.');
        console.log('click', location);

    }
    updateLocation = (location) => {
        this.setState({ location: location })
    }
    handleChange = (value) => {
        console.log("boo" + value);
    }
    addLocation = () => {

    }
    render() {
        const { initLoading, loading, list } = this.state;
        const loadMore = !initLoading && !loading ? (
            <div class="center" >
                <Button onClick={this.addLocation}>Add Location</Button>
            </div>
        ) : null;

        return (
            <div className="center">
                <Row className={``} gutter={16}>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                        <Card className="left" size="medium" title="Select Metric">
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
                                dataSource={list}
                                renderItem={item => (
                                    <List.Item
                                        key={item.facility}
                                        actions={[<a>Edit</a>,
                                        <Dropdown overlay={
                                            <Menu onClick={this.handleMenuClick(item.facility)}>
                                                <Menu.Item key="1"><Icon type="edit" />Edit Location</Menu.Item>
                                                <Menu.Item key="2"><Icon type="bg-colors" />Change Colors</Menu.Item>
                                                <Menu.Item key="3"><Icon type="delete" />Delete</Menu.Item>
                                            </Menu>
                                        } trigger={['click']}>
                                            <Button style={{ marginLeft: 8 }}>
                                                Options <Icon type="down" />
                                            </Button>
                                        </Dropdown>
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
        );
    }
}

export default Analysis;
