import React, { Component } from 'react'
import {Button, message} from 'antd'

import db from '../Database/database'

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
        db.Dashboard.toCollection().last().then(object =>{
            let key = 0
            if (object){
                key = object.Id + 1
            }
            //Prepare Save Object
            let newGraph = {
                Id:key,
                Title: this.props.Title,
                
                Locations: this.props.Locations,
                Dates: this.props.Dates,
                Data: this.props.Data,
                RawData: this.props.RawData
                
            }

            db.Dashboard.put(newGraph).then(() =>{
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