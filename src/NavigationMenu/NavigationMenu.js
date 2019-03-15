import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'antd';

import './NavigationMenu.css';

/**
 * Navigation Menu Component
 * 
 * Accepts up to three props:
 *  - title
 *  - rightButtonType
 *  - rightButtonAction
 */

class App extends Component {

    rightButtonRenderer = () =>{
        if (this.props.rightButtonAction != null && this.props.rightButtonType != null){
            return (
                <Button type="default" onClick={this.props.rightButtonAction} className="ghost-button">
                    <Icon
                        className="trigger"
                        type={this.props.rightButtonType ? this.props.rightButtonType : "menu-fold"}
                        />
                </Button>
            )
        }else{
            return null
        }
    }

    render() {
        return (
            <div className="navMenu">
            <Row>
                {/* This button opens and closes the drawer */}
                <Col span= {4}>
                    <Button type="default" onClick={this.props.openDrawer_f} className="ghost-button">
                        <Icon
                            className="trigger"
                            type='menu-unfold'
                            />
                    </Button>
                </Col>
                <Col span = {16}>
                    <h2 className = "nowrap center">
                        {this.props.title}
                    </h2>
                </Col>
                <Col span= {4}>
                    {this.rightButtonRenderer()}
                </Col>


            </Row>
            </div>
        );
    }
}

export default App;
