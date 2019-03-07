import React, { Component } from 'react';

//react-vis for graphs
import '../../node_modules/react-vis/dist/style.css';

import {Empty, Spin} from 'antd'

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
 * @param LocationId: String
 * @param LocationType: String "National" | "State" | "LGA" | "Ward" | "Facility"
 * @param DataId: String
 * @param DataType: String "Metric" | "Set" | "Group"
 * @param StartDate: Date
 * @param EndDate: Date (if applicable)
 */
class VisualizerManager extends Component {

    state = {
        ready: false,
        data: null
    }

    checkInputs = () => {
        let valid = true
        let validInputs = {
            "LocationId": value => {return value !== undefined && value !== null},
            "LocationType": value => {return ["National", "State", "LGA", "Ward", "Facility"].includes(value)},
            "DataId": value => {return value !== undefined && value !== null},
            "DataType": value => {return ["Metric", "Set", "Group"].includes(value)},
            "StartDate": value => {return Object.prototype.toString.call(value) === '[object Date]'},
            "EndDate": value => {return Object.prototype.toString.call(value) === '[object Date]'}, 
        }

        for (var key in validInputs){
            if (validInputs[key](this.props[key]) === false){
                valid = false
                console.log(key)
                console.log(this.props[key])
                break
            }
        }
        if (valid) console.log('inputs passed')
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
        //Simple data is only Facility, Metric 
        //All other data requires aggregation and therefore will be queried from the database.
        console.log(this.props.LocationType)
        console.log(this.props.DataType)
        if (this.props.LocationType !== "Facility") return false
        if (this.props.DataType !== "Metric") return false
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
     * Preconditions:
     * locationType === "Facility"
     * dataType === "Metric"
     */
    getSimpleData = () =>{
        db.Data.where(
            ["FacilityId", "MetricId", 'Time']
        ).between(
            [this.props.LocationId, this.props.DataId, this.formatDate(this.props.StartDate)],
            [this.props.LocationId, this.props.DataId, this.formatDate(this.props.EndDate)],
            true,
            true
        )
        .toArray((arr) =>{
            this.setState({
                data: {
                    data: arr
                },
                graphType :"Metric",
                ready: true
            })
        })
    }

    /**
     * 1. Try to find data from local store
     * 2. If not possible, try to find data from internet
     *     - If exists, cache
     * 3. If not, some error message
     */
    getComplexData = () =>{
        db.DashboardData.toArray().then(arr =>{
            
            //If doesn't exist, then get data from url
            if (arr.length === 0){
                this.queryComplexData()
            }
        })
    }

    formatDateForRemoteQuery = (date) =>{
        return `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth()+1)).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}`
    }

    queryComplexData = () =>{
        return new Promise (resolve =>{

            //Build Query URL
            let period = "month"
            
            if (this.props.StartDate.getUTCFullYear() !== this.props.EndDate.getUTCFullYear()) period = "year"
            let rootURL = `https://essd-backend-dev.azurewebsites.net/api/data/query?`
            let url = rootURL + 
                    "LocationId=" + this.props.LocationId
                +   "&LocationType=" + this.props.LocationType
                +   "&DataId=" + this.props.DataId
                +   "&DataType=" + this.props.DataType
                +   "&StartDate=" + this.formatDateForRemoteQuery(this.props.StartDate)
                +   "&EndDate=" + this.formatDateForRemoteQuery(this.props.EndDate)
                +   "&Period=" + period
                +   "&Distribution=" + this.props.DataPresentation

            console.log(url)

            //Data comes back as an array
            fetch(url,{}).then(stream => stream.json().then(result =>{

                if (period === "year"){
                    console.log('Year')
                    //TODO: Switch to vertical bar graph in the future
                    result.forEach(el =>{
                        el.Value = Number.parseFloat(el.Total)
                        el.Metric = el.Yr
                    })

                    result.sort((a,b) =>{
                        return a.Yr - b.Yr
                    })

                    if (this.props.DataPresentation === "none" || this.props.DataPresentation === "total"){ //== total
                        this.setState({
                            ready: true,
                            data: {
                                data: result,
                                name: this.props.Title
                            },
                            graphType: "Set",

                        })
                    }else{

                    }
                }else{
                    console.log('Month')
                    //Period === month

                    result.forEach(el => {
                        let d = new Date(this.props.StartDate)
                        d.setUTCMonth(el.Month - 1)
                        el.Date = d
                        el.Value = Number.parseInt(el.Total)
                        el.Metric = el.MetricName
                    })

                    let graphType = this.props.DataPresentation === "distribution" ? "Set" : "Metric"

                    console.log(graphType)
                    
                    this.setState({
                        ready: true,
                        graphType: graphType,
                        data: {
                            data: result,
                            name: this.props.Title
                        }
                    })

                }

                //TODO: store data locally
            }))
        })
    }

    componentDidMount = () =>{
        this.run()
    }

    componentDidUpdate(){
        console.log('did update')
        console.log(this.props)
        // <VisualizerManager
        // Title="Hi"
        // LocationName={this.state.Location? this.state.Location.Name : undefined}
        // LocationId = {this.state.Location? this.state.Location.Id : undefined}
        // LocationType={this.state.Location? this.state.Location.Type : undefined}
        // DataId = {this.state.Data ? this.state.Data.Id : undefined}
        // DataType = {this.state.Data ? this.state.Data.Type : undefined}
        // StartDate = {new Date("2015-01-01T00:00:00.000Z")}
        // EndDate = {new Date("2015-12-01T00:00:00.000Z")}
        // DataPresentation = {this.state.Data? this.state.Data.TotalOrDistribution : undefined}
    }



    // componentWillReceiveProps(nextProps) {
    //     // You don't have to do this check first, but it can help prevent an unneeded render
    //     this.run()
    // }

    // componentDidUpdate(prevState, nextState){
    //     this.run()
    //     console.log(nextState)
    // }

    run = () => {
        if (this.checkInputs()){
            if (this.isSimpleData()){
                console.log('simple data')
                this.getSimpleData()
            }else{
                console.log('complex data')
                this.getComplexData()
            }
        }
    }

    render() {

        if (this.checkInputs()){
            return (
                <div>
                    {
                        this.state.ready === false && 
                        <div className="graphPlaceholder">
                            <Spin></Spin>
                        </div>
                        
                    }
                    {
                        this.state.ready === true && 
                        <Visualizer 
                            type = {this.state.graphType}
                            show = {this.props.show}
                            data = {this.state.data}
                        />
                    }
                </div>
            )
        }else{
            return(
                <div className="graphPlaceholder">
                    <Empty
                        description="Something went wrong. Please check your VisualizerManager inputs."
                    />
                </div>)
        }
    }
}

export default VisualizerManager;
