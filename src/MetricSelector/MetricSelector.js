import React, { Component } from 'react';

import {Select} from 'antd'

import db from '../Database/database'

const hierarchyLevels = [
    "Group",
    "Set",
    "Metric",
]

const Option = Select.Option;

const style = {
    width: "100%"
}

/**
 * Selects a loction in Nigeria
 * @param {parentHandler} - Function passed in by the parent that takes a LocationObject with props {Id, Name, Type} and updates the parent UI
 * @param {showData} - Boolean that shows or hides LocationSelector's built-in selected location text
 * @param {initialData}
 */
class MetricSelector extends Component {

    findAll = (type) => {
        return new Promise((resolve) =>{
            //Cannot access type via db[type], so we have to do it manually
            let callback = (data) => {
                resolve (data) 
            }

            switch(type){
                case "Metric":
                    db.Metrics.toArray(callback)
                break
                case "Set":
                    db.Sets.toArray(callback)
                break
                case "Group":
                    db.Groups.toArray(callback)
                break
                default:
                    //
                break;
            }
        })
    }

    findByQuery(type, queryParams){
        return new Promise((resolve) =>{
            //Cannot access type via db[type], so we have to do it manually
            let callback = (data) => {
                resolve (data) 
            }
            switch(type){
                case "Metric":
                    db.Metrics.where(queryParams).toArray(callback)
                break
                case "Set":
                    db.Sets.where(queryParams).toArray(callback)
                break
                case "Group":
                    db.Groups.where(queryParams).toArray(callback)
                break
                default:
                    //
                break;
            }
        })
    }

    state = {

        //Selected values at each level
        Group:undefined,
        Set:undefined,
        Metric:undefined,

        //Selection lists to show at each level
        GroupList: undefined,
        SetList: undefined,
        MetricList:undefined,      

        //Enables / disables each list
        enabledDisabledLists:{
            "Group"  : false,
            "Set"     : false,
            "Metric"       : false,
        },

        selectedData: undefined
    }

    componentDidUpdate = async (oldProps) => {
        
        if (oldProps.disabled !== this.props.disabled) this.enableDisableLists()

        //No need to update for maxScope; this should not change unless the admin user has changed

        //In the future, this can be updated to also change the user shown
        //when the prop changes to allow React to persist a LocationSelector
        //in the DOM, but this is tricky because it also requires LocationSelector
        //to revert the selected location when editing is cancelled.
    }

    componentDidMount = () =>{
        this.setInitialDataState()
    }

    findIndexForLocationType = (locationType) =>{
        return hierarchyLevels.findIndex((el) => {
            return el === locationType
        })
    }

    setInitialDataState = () =>{
        this.enableDisableLists()
        if (this.props.initialData === undefined){
            //If undefined, then only update Group List
            this.updateList("Group", 0, null)
            this.notifyParent()
        }else{
            this.setState({
                Group:  this.props.initialData.GroupValue.length > 0    ? this.props.initialData.GroupValue     : undefined,
                Set:    this.props.initialData.SetValue.length > 0      ? this.props.initialData.SetValue       : undefined,
                Metric: this.props.initialData.MetricValue.length > 0   ? this.props.initialData.MetricValue    : undefined,
            }, () =>{
                this.notifyParent()
                this.updateList("Group", 0, null)
                this.updateList("Set", 0, null)
                this.updateList("Metric", 0, null)
            })
        }
    }

    enableDisableLists = () =>{

        let enabledDisabledLists = {}

        let disabled = this.props.disabled !== undefined ? this.props.disabled : false
        //Disable all fields if global state is disabled
        for (let i = 0; i < hierarchyLevels.length; i++){
            enabledDisabledLists[hierarchyLevels[i]] = disabled
        }
        this.setState({enabledDisabledLists: enabledDisabledLists})
    }

    handleChange = (level, value) =>{
        //Find Current Level
        let currentLevelIndex = this.findIndexForLocationType(level)    

        //If value is undefined, then Select was cleared so the current Level is one above this level
        if (value === undefined || this.parseData(value).Id === "-1"){
            this.setState({[level]: undefined}, () =>{
                this.createLocationObject()
                this.notifyParent()
            })
        }else{
            //Update Select
            this.setState({[level]: value, selectedData:value},  () =>{
                this.createLocationObject()
                this.notifyParent()
            })
        }
        
        //Whenever the value has changed, all the subordinate options have been invalidated 
        for (let i = currentLevelIndex + 1; i < hierarchyLevels.length; i++){
            let statePropertyName = hierarchyLevels[i]
            const x = i
            this.setState({[statePropertyName]: undefined}, () =>{
                this.updateList(statePropertyName, x)
                this.createLocationObject()
            })
        }

    }

    createLocationObject = () =>{

        let type = undefined, name = undefined, split = undefined

        if (this.state.Metric !== undefined){
            split = this.state.Metric.split("|")
            type = split[2]
            name = split[1]
        }else if (this.state.Set !== undefined){
            split = this.state.Set.split("|")
            type = split[2]
            name = split[1]
        }else if (this.state.Group !== undefined){
            split = this.state.Group.split("|")
            type = split[2]
            name = split[1]
        }
        
        let typeID = type !== undefined ? split[0] : undefined

        let totalOrDistribution = "Total" // Default to total

        if (type !== "Metric"){
            //If this is not a metric and has a total or distribution, we need to find out which one it is
            let nextType = hierarchyLevels[this.findIndexForLocationType(type) + 1]

            if (this.state[nextType] !== undefined){
                let nextType = typeID.split("-")
                typeID = nextType[2]            //Get the ID of the above Set or Group without the -# prefix
                if (nextType[1] === "2"){
                    totalOrDistribution = "Total"
                }else{
                    totalOrDistribution = "Distribution"
                }
            }
        }else{
            totalOrDistribution = "None"
        }

        let result = {
            Type: type,
            Id: typeID,
            Name: name,
            TotalOrDistribution: totalOrDistribution,
            GroupValue: this.state.Group,
            SetValue: this.state.Set,
            MetricValue: this.state.Metric
        }
        
        return result
    }

    updateList = async (level, levelIndex, callBack) => {
        
        let list = []
        let listName = `${level}List`                       //E.g. We will be updating this.state.FacilityList
        let queryProperty = hierarchyLevels[levelIndex]      //eg level = lga but we need 'LGA' for data.LGA\
        let aboveLevel = undefined

        //States are special because they don't require a nation lookup
        if (level === "Group"){
            list = await this.findAll(level)
        }else{
            levelIndex = hierarchyLevels.findIndex((el) => {return el === level})
            queryProperty = hierarchyLevels[levelIndex] //eg level = lga, queryProperty = LGA
            aboveLevel = hierarchyLevels[levelIndex-1]
            if (this.state[aboveLevel] === undefined){
                //Short circuit if the above level is undefined
                this.setState({[listName]: []})
                return
            }else{
                let aboveLevelId = this.parseData(this.state[aboveLevel]).Id
                list = await this.findByQuery(queryProperty,{parentId: aboveLevelId})
            }
        }

        let optionsList = []

         //Add a clear option to the front of the array (mobile users won't see the clear button)
        optionsList.push(
            <Option key = {-1} value = "-1||"><em>Clear Selection</em></Option>
        )

        //Add total and distribution of the above group or set
        if (level === "Set" || level === "Metric"){
            let totalString = `All ${this.state[aboveLevel].split("|")[1]} (Total)`
            optionsList.push(
                <Option key = {-1} value = {`-2-${this.state[aboveLevel].split("|")[0]}|${totalString}|${aboveLevel}`}>{totalString}</Option>
            )
            let distributionString = `All ${this.state[aboveLevel].split("|")[1]} (Distribution)`
            optionsList.push(
                <Option key = {-1} value = {`-3-${this.state[aboveLevel].split("|")[0]}|${distributionString}|${aboveLevel}`}>{distributionString}</Option>
            )
        }

        //If the Set Above includes a Total or Distribution, then there are no metrics to show
        if (level === "Metric"){
            if (this.state[aboveLevel].split("|")[0].charAt(0)  === "-"){
                this.setState({
                    [listName]: []
                })
                return
            }
        }

        let aboveName = aboveLevel === undefined ? null : this.state[aboveLevel].split("|")[1]
        //Add the remaining objects
        list.forEach((el)=>{
            //Add to list unless the name is the same as the one above
            if (aboveName !== el.Name){
                optionsList.push(
                    <Option key = {el.Id} value = {`${el.Id}|${el.Name}|${level}`}>{el.Name}</Option>
                )
            }

        })
        
        if (optionsList.length > 0){
            this.setState({[listName]: optionsList})
        }

        if (callBack) callBack()
    }

    parseData (value) {
        if (value === undefined) return {
            Id:"",Name:"",Type:""
        }
        let valueArr = value.split("|")
        return{
            Id:     valueArr[0],
            Name:   valueArr[1],
            Type:  valueArr[2]
        }
    }

    notifyParent = () =>{
        if (this.props.parentHandler !== undefined && this.props.parentHandler !== null){
            this.props.parentHandler(this.createLocationObject())
        }
    }

    render() {
        return (
           <div>
                <Select
                    showSearch
                    style={style}
                    placeholder="Group"
                    optionFilterProp="children"
                    value = {this.state.Group}
                    onChange={(value) => {this.handleChange("Group", value)}}
                    disabled = {this.state.enabledDisabledLists.Group}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.GroupList}
                </Select>
                <br/>
                <Select
                    showSearch
                    style={style}
                    placeholder="Set"
                    optionFilterProp="children"
                    value = {this.state.Set}
                    onChange={(value) => {this.handleChange("Set", value)}}
                    disabled = {this.state.enabledDisabledLists.Set}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.SetList}
                </Select>
                <br/>
                <Select
                    showSearch
                    style={style}
                    placeholder="Metric"
                    optionFilterProp="children"
                    value = {this.state.Metric}
                    onChange={(value) => {this.handleChange("Metric", value)}}
                    disabled = {this.state.enabledDisabledLists.Metric}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.MetricList}
                </Select>
            
                <br/>
                <div hidden = {this.props.showLabel !== undefined ? !this.props.showLabel : false}>
                    <p>
                        Selected Data: {`${this.createLocationObject().Name} (${this.createLocationObject().Type})`}
                    </p>
                </div>
               
           </div>
        );
    }
}

export default MetricSelector;
