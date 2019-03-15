import React, { Component } from 'react'
import CreateModifyDeleteUser from '../Users/CreateModifyDeleteUser'
import user from '../Services/User'
import { Card, Row, Col } from 'antd'

class Account extends Component {

    state = {
        user: null
    }

    componentDidMount = () => {
        user.user().then((u) => {
            this.setState({
                user: u
            })
        })
    }

    render() {
        return (
            <div>
                {this.state.user &&
                    <Row className="rowVMarginTopSm" gutter={16}>
                        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                            <Card className="rowVMarginTopSm" >

                                <CreateModifyDeleteUser
                                    showTable_f={null}
                                    user={this.state.user}
                                    mode="existing"
                                    refreshUsers={() => { }
                                    }
                                />
                            </Card>

                        </Col>
                    </Row>
                }
            </div>


        )
    }
}

export default Account;