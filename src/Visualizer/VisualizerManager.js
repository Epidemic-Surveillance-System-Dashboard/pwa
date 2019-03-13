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
        data: null,
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
            if (validInputs[key](this.state[key]) === false){
                valid = false
                break
            }
        }
        return valid
    }

    // getData = () =>{

    //     if (this.isSimpleData()){
    //         this.getSimpleData()
    //     }else{
    //         this.getComplexData()
    //     }

    // }

    isSimpleData = () =>{
        //Simple data is only Facility, Metric 
        //All other data requires aggregation and therefore will be queried from the database.
        if (this.state.LocationType !== "Facility") return false
        if (this.state.DataType !== "Metric") return false
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
        console.log("**************");
        console.log(this.state.Data);
        console.log("**************");
        db.Data.where(
            ["FacilityId", "MetricId", 'Time']
        ).between(
            [this.state.LocationId, this.state.DataId, this.formatDate(this.state.StartDate)],
            [this.state.LocationId, this.state.DataId, this.formatDate(this.state.EndDate)],
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
        console.log(this.props)
        console.log(this.props.RawData)
        if (this.props.RawData){
            console.log(this.props.Data)

            let graphType = "Metric"

            if (this.props.Data.MetricValue !== undefined && this.props.Data.MetricValue.charAt(0)!== "-") graphType = "Metric" 
            else if (this.props.Data.SetValue !== undefined) graphType = "Set"
            else graphType = "Group"
            
            this.setState({
                ready: true,
                data:{
                    data: this.props.RawData,
                    name: this.props.Title
                },
                graphType: graphType
            })
        }else{
            this.queryComplexData()
        }
    }

    formatDateForRemoteQuery = (date) =>{
        return `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth()+1)).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}`
    }

    queryComplexData = () =>{
    
        //Build Query URL
        let period = "month"
        
        if (this.state.StartDate.getUTCFullYear() !== this.state.EndDate.getUTCFullYear()) period = "year"
        let rootURL = `https://essd-backend-dev.azurewebsites.net/api/data/query?`
        let url = rootURL + 
                "LocationId=" + this.state.LocationId
            +   "&LocationType=" + this.state.LocationType
            +   "&DataId=" + this.state.DataId
            +   "&DataType=" + this.state.DataType
            +   "&StartDate=" + this.formatDateForRemoteQuery(this.state.StartDate)
            +   "&EndDate=" + this.formatDateForRemoteQuery(this.state.EndDate)
            +   "&Period=" + period
            +   "&Distribution=" + this.state.DataPresentation

        console.log(url)

        //Data comes back as an array
        fetch(url,{}).then(stream => stream.json().then(result =>{

            if (period === "year"){

                //TODO: Switch to vertical bar graph in the future
                result.forEach(el =>{
                    el.Value = Number.parseFloat(el.Total)
                    el.Metric = el.Yr
                })

                result.sort((a,b) =>{
                    return a.Yr - b.Yr
                })

                if (this.state.DataPresentation === "none" || this.state.DataPresentation === "total"){ //== total
                    this.setState({
                        ready: true,
                        data: {
                            data: result,
                            name: this.state.Title
                        },
                        graphType: "Set",

                    })
                }else{

                }
            }else{
                //Period === month
                let graphType = this.state.DataPresentation === "distribution" ? "Set" : "Metric"

                let groupName = "MetricName"
                if (result.length > 0) groupName = result[0].hasOwnProperty("MetricName") ? "MetricName" : "SetName"

                let titleIndex = undefined

                for (let i = 0; i < result.length; i++){
                    let d = new Date(this.state.StartDate)
                    d.setUTCMonth(result[i].Month - 1)
                    result[i].Date = d
                    result[i].Value = Number.parseInt(result[i].Total)
                    if (graphType === "Set"){
                        if (result[i][groupName] === this.state.Title) titleIndex = i
                        result[i].Metric = result[i][groupName].replace(`${this.state.Title}, `, "")
                    }else{
                        result[i].Metric = result[i][groupName]
                    }
                }

                if (titleIndex !== undefined){
                    result.splice(titleIndex,1)
                }
                
                this.setState({
                    ready: true,
                    graphType: graphType,
                    data: {
                        data: result,
                        name: this.state.Title
                    }
                })

            }

            if (this.props.ParentHandler) this.props.ParentHandler(result)

            //TODO: store data locally
        }))
    
    }

    componentDidUpdate(prevProps){
        if (prevProps.Location !== this.props.Location || prevProps.Data !== this.props.Data || prevProps.Dates !== this.props.Dates){
            this.setStateFromProps(this.run)
        }
    }

    setStateFromProps = (callback) =>{
        this.setState({
            Title: this.props.Title,
            LocationName: this.props.Location ? this.props.Location.Name : undefined,
            LocationId: this.props.Location ? this.props.Location.Id : undefined,
            LocationType: this.props.Location ? this.props.Location.Type : undefined,
            DataId: this.props.Data ? this.props.Data.Id : undefined,
            DataType: this.props.Data ? this.props.Data.Type : undefined,
            DataPresentation: this.props.Data ? this.props.Data.TotalOrDistribution : undefined,
            StartDate: this.props.Dates ? this.props.Dates.StartDate : undefined,
            EndDate: this.props.Dates ? this.props.Dates.EndDate : undefined,
        }, () =>{
            if (callback) callback()
        })
    }

    run = () => {
        if (this.checkInputs()){
            if (this.isSimpleData()){
                console.log('simple data')
                this.getSimpleData()
            }else{
                this.getComplexData()
            }
        }
    }   

    componentDidMount(){
        this.setStateFromProps(this.run)
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
                        <div>
                            <Visualizer 
                                type = {this.state.graphType}
                                show = {this.props.show}
                                data = {this.state.data}
                            />

                        </div>

                    }
                </div>
            )
        }else{
            return(
                <div className="graphPlaceholder">
                    <Empty
                        description="We can't display a graph with these inputs."
                    />
                </div>)
        }
    }
}

export default VisualizerManager;
