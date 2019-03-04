import React, { Component } from 'react';

//react-vis for graphs
import '../../node_modules/react-vis/dist/style.css';

import {Empty} from 'antd'

import Visualizer from './Visualizer'

import db from '../Database/database'

/**
 * Types of Graphs Generated:
 * 
 * Data: Metric
 * Location: Any (Note: Location is always ANY because we're not going to show breakdown by location; too many locations)
 * Time Period: Any
 *      -> Line Graph
 *      -> X-Axis is monthly if startDate.year == endDate.year; otherwise yearly
 * 
 * Data: Set or Group
 * Location: Any
 * Time Period: Any
 * Period: Any
 * Type: Distribution
 *      -> Show Horizontal Bar Graph of the set or the group
 * 
 * Data: Set or Group
 * Location: Any
 * Time Period: Any
 * Period: Any
 * Type: Total
 *      -> Show Line Graph of the Set or Group
 * 
 */

/**
 * PROPS:
 * @param locationId: String
 * @param locationType: String "National" | "State" | "LGA" | "Ward" | "Facility"
 * @param dataId: String
 * @param dataType: String "Metric" | "Set" | "Group"
 * @param startDate: Date
 * @param endDate: Date (if applicable)
 */
class VisualizerManager extends Component {

    state = {
        ready: false,
        data: null
    }

    checkInputs = () => {
        let valid = true
        let validInputs = {
            "locationId": value => {return value !== undefined && value !== null},
            "locationType": value => {return ["Nation", "State", "LGA", "Ward", "Facility"].includes(value)},
            "dataId": value => {return value !== undefined && value !== null},
            "dataType": value => {return ["Metric", "Set", "Group"].includes(value)},
            "startDate": value => {return Object.prototype.toString.call(value) === '[object Date]'},
            "endDate": value => {return Object.prototype.toString.call(value) === '[object Date]'}, 
        }

        for (var key in validInputs){
            if (validInputs[key](this.props[key]) === false){
                valid = false
                break
            }
        }

        return valid
    }

    getData = () =>{
        let data = []
        if (this.isSimpleData()){
            data = this.getSimpleData()
        }else{
            data = this.getComplexData()
        }
        if (data.length > 0){
            // Good to go
        }
    }

    isSimpleData = () =>{
        //Simple data is only Facility, Metric and over the course of 1 year.
        //All other data requires aggregation and therefore will be queried from the database.
        if (this.props.locationType !== "facility") return false
        if (this.props.dataType !== "Metric") return false
        if (this.props.endDate.getFullYear() !== this.props.startDate.getFullYear()) return false
        return true
    }

    /**
     * @param date Date object
     */
    formatDate = (date) =>{
        //Format into YYYY-MM-DDT:00:00:00.000Z
        let dateString = `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth()+1)).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}T00:00:00.000Z`
        return dateString
    }


/**
 * PROPS:
 * @param locationId: String
 * @param locationType: String "National" | "State" | "LGA" | "Ward" | "Facility"
 * @param dataId: String
 * @param dataType: String "Metric" | "Set" | "Group"
 * @param startDate: Date
 * @param endDate: Date (if applicable)
 */
    /**
     * Preconditions:
     * locationType === "Facility"
     * dataType === "Metric"
     */
    getSimpleData = () =>{
        console.log('Simple Data')
        db.Data.where(
            ["FacilityId", "MetricId", 'Time']
        ).between(
            [this.props.locationId, this.props.dataId, this.formatDate(this.props.startDate)],
            [this.props.locationId, this.props.dataId, this.formatDate(this.props.endDate)],
            true,
            true
        )
        .toArray((arr) =>{
            this.setState({
                data: arr,
                ready: true
            })
        })

    }

    getComplexData = () =>{

    }

    getMetric = () =>{
        return new Promise (resolve =>{
      
            console.log(this.props.locationId)
            console.log(this.props.dataId)
            console.log(this.formatDate(this.props.startDate, true))
            console.log(this.formatDate(this.props.endDate, false))
            db.Data.where(
                    ["FacilityId", "MetricId", 'Time']
                ).between(
                    [this.props.locationId, this.props.dataId, this.formatDate(this.props.startDate, true)],
                    [this.props.locationId, this.props.dataId, this.formatDate(this.props.endDate, false)],
                    true,
                    true
                )
                .toArray((arr) =>{
                console.table(arr)
                this.setState({
                    data: arr,
                    ready: true
                }, () =>{
                    console.log()
                })
                resolve(arr)
            })
        })
    }



    componentDidMount = () =>{
        if (this.checkInputs()) this.getSimpleData()
    }

    render() {
        if (this.checkInputs()){
            return (
                <div>
                    {
                        this.state.ready === false && "not ready"
                    }
                    {
                        this.state.ready === true && 
                        <Visualizer 
                            type = "metric"
                            show = {true}
                            data = {this.state.data}
                        // <Visualizer type = "set" show = {true} data = {this.state.tempGraphData}></Visualizer>
                        />
                    }
                </div>
            )
        }else{
            return(
                <Empty
                description="Something went wrong :( Please check your VisualizerManager inputs."
                />
            )
        }
    }
}

export default VisualizerManager;
