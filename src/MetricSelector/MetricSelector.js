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

    componentWillMount = () =>{
        this.setData()
    }

    findIndexForLocationType = (locationType) =>{
        return hierarchyLevels.findIndex((el) => {
            return el === locationType
        })
    }

    setData = async () =>{
        /**
         * Preconditions:
         *  - initialData is within maxScope
         */

        let initialData = {
            Type:  this.props.initialData ? this.props.initialData.Type : "Group",
            Id:     this.props.initialData ? this.props.initialData.Id : "1191",
        }

        this.setState({
            initialData: initialData

        }, () =>{

            let initLocationIndex = this.findIndexForLocationType(initialData.Type)

            //Work backwards to define all the locations that the initial location belongs to
    
            let locations = {
                "Group"  : undefined,
                "Set"     : undefined,
                "Metric"   : undefined,
            }
            
            this.getLocationHierarchyForInitLocation(initLocationIndex, initialData.Id, this.setDataState, locations)
        })


    }

    getLocationHierarchyForInitLocation = async (currentIndex, currentLocationId,completionCallback, locations) =>{

        let location = await (this.findByQuery(hierarchyLevels[currentIndex], {Id:currentLocationId}))
        location = location[0]
        locations[hierarchyLevels[currentIndex]] = `${location.Id}|${location.Name}|${hierarchyLevels[currentIndex]}`
        if (currentIndex === 0){
            completionCallback(locations)
        }else{
            this.getLocationHierarchyForInitLocation(currentIndex-1, location.parentId, completionCallback, locations)
        }
    }

    setDataState = (data) =>{
        this.setState({...data}, () =>{
            //Then update lists for each level that is defined, plus the first undefined level
            for (let i = 0; i < hierarchyLevels.length; i++){
                this.updateList(hierarchyLevels[i], i, () =>{})

                //Set the selected location to the parent of the first undefined location
                //or the facility level

                let selectedData = undefined

                if (data[hierarchyLevels[i]] === undefined){
                    selectedData =  data[hierarchyLevels[i-1]]
                }else if (i === hierarchyLevels.length-1){
                    selectedData =  data[hierarchyLevels[i]]
                }

                if (selectedData !== undefined){
                    let callback = () =>{
                        this.notifyParent(this.parseData(this.state.selectedData))
                    }

                    this.setState({
                        selectedData: selectedData
                    }, callback)
                    break
                }

            }
            this.enableDisableLists()
        })
    }

    enableDisableLists = () =>{

        let enabledDisabledLists = {}

        //Disable all fields if global state is disabled
        if (this.props.disabled === true){
            for (let i = 0; i < hierarchyLevels.length; i++){
                enabledDisabledLists[hierarchyLevels[i]] = true
            }
        }else{
            for (let i = 0; i < hierarchyLevels.length; i++){
                enabledDisabledLists[hierarchyLevels[i]] = false
            }
        }
        this.setState({enabledDisabledLists: enabledDisabledLists})
    }

    handleChange = (level, value) =>{
        //Find Current Level
        let currentLevelIndex = this.findIndexForLocationType(level)
        let currentLevel = level

        //If value is undefined, then Select was cleared so the current Level is one above this level
        if (value === undefined || this.parseData(value).Id === "-1"){
            currentLevel = hierarchyLevels[currentLevelIndex - 1]  
            this.setState({[level]: undefined, selectedData:this.state[currentLevel]}, () =>{
                this.notifyParent(this.parseData(this.state[currentLevel]))
            })
        }else{
            //Update Select
            this.setState({[level]: value, selectedData:value},  () =>{
                this.notifyParent(this.parseData(this.state[currentLevel]))
            })
        }
        
        //Whenever the value has changed, all the subordinate options have been invalidated 
        for (let i = currentLevelIndex + 1; i < hierarchyLevels.length; i++){
            let statePropertyName = hierarchyLevels[i]
            const x = i
            this.setState({[statePropertyName]: undefined}, () =>{
                this.updateList(statePropertyName, x)
            })
        }
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
                <Option key = {-1} value = {`-2|${totalString}|${aboveLevel}`}>{totalString}</Option>
            )
            let distributionString = `All ${this.state[aboveLevel].split("|")[1]} (Distribution)`
            optionsList.push(
                <Option key = {-1} value = {`-3|${distributionString}|${aboveLevel}`}>{distributionString}</Option>
            )
        }

        //If the Set Above includes a Total or Distribution, then there are no metrics to show
        if (level === "Metric"){
            if (this.state[aboveLevel].split("|")[0] < 0){
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

    notifyParent = (locationObject) =>{
        if (this.props.parentHandler !== undefined && this.props.parentHandler !== null){
            this.props.parentHandler(locationObject)
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
                <div hidden = {!this.props.showData}>
                    <p>
                        Selected data: {`${this.parseData(this.state.selectedData).Name} (${this.parseData(this.state.selectedData).Type})`}
                    </p>
                </div>
               
           </div>
        );
    }
}

export default MetricSelector;
