import React, { Component } from 'react'
import {Button, message} from 'antd'

import db from '../Database/database'
import user from '../Services/User'

class SaveGraph extends Component{

    //For a graph:

    /**
     * 
     * Locations[associativearray] of Location
     * Data
     * Dates: {StartDate, EndDate}
     * RawData
     */

    saveGraph = () =>{
        //Get Number of Dashboards Currently
        db.Dashboard.count().then(key =>{

            //Prepare Save Object
            let object = {
                Id:key,
                Title: this.props.Title,
                
                Locations: this.props.Locations,
                Dates: this.props.Dates,
                Data: this.props.Data,
                RawData: this.props.RawData
                
            }

            db.Dashboard.put(object).then(() =>{
                message.success("Successfully saved to dashboard.")
                if (this.props.ParentHandler) this.props.ParentHandler()
            })
        })
    }

    render() {
        return (
            <div>
                <Button icon="save" onClick={this.saveGraph}>Save Graph</Button>
            </div>
        )
    }

}

export default SaveGraph