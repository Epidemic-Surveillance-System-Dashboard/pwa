import React, { Component } from 'react';

import {Select} from 'antd'

import db from '../Database/database'

const hierarchyLevels = [
    "National",
    "State",
    "LGA",
    "Ward",
    "Facility"
]

const Option = Select.Option;

const style = {
    width: "100%"
}

/**
 * Selects a loction in Nigeria
 * @param {parentHandler} - Function passed in by the parent that takes a LocationObject with props {Id, Name, Type} and updates the parent UI
 * @param {showLocation} - Boolean that shows or hides LocationSelector's built-in selected location text
 * @param {maxScope}: optional - {Id: "188", Level: "State"}
 * @param {initialLocation}
 */
class LocationSelector extends Component {

    findAllLocations = (type) => {
        return new Promise((resolve) =>{
            //Cannot access type via db[type], so we have to do it manually
            let callback = (data) => {
                resolve (data) 
            }

            switch(type){
                case "Facility":
                    db.Facility.toArray(callback)
                break
                case "Ward":
                    db.Ward.toArray(callback)
                break
                case "LGA":
                    db.LGA.toArray(callback)
                break
                case "State":
                    db.State.toArray(callback)
                break
                default:
                    //
                break;
            }
        })
    }

    findLocationByQuery(type, queryParams){
        return new Promise((resolve) =>{
            //Cannot access type via db[type], so we have to do it manually
            let callback = (data) => {
                resolve (data) 
            }
            switch(type){
                case "Facility":
                    db.Facility.where(queryParams).toArray(callback)
                break
                case "Ward":
                    db.Ward.where(queryParams).toArray(callback)
                break
                case "LGA":
                    db.LGA.where(queryParams).toArray(callback)
                break
                case "State":
                    db.State.where(queryParams).toArray(callback)
                break
                default:
                    //
                break;
            }
        })
    }

    state = {

        //Selected locations at each level
        National: "1|Nigeria|National" ,
        State:undefined,
        LGA:undefined,
        Ward:undefined,
        Facility:undefined,

        //Selection lists to show at each level
        StateList: undefined,
        LGAList: undefined,
        WardList:undefined,
        FacilityList:undefined,

        //Enables / disables each list
        enabledDisabledLists:{
            "National"  : false,
            "State"     : false,
            "LGA"       : false,
            "Ward"      : false,
            "Facility"  : false
        },

        selectedLocation: "1|Nigeria|National"
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
        this.setLocations()
    }

    findIndexForLocationType = (locationType) =>{
        return hierarchyLevels.findIndex((el) => {
            return el === locationType
        })
    }

    setLocations = async () =>{
        /**
         * Preconditions:
         *  - initialLocation is within maxScope
         *  - maxScope must be higher or equal to initialLocation
         */
        let maxScope = {
            Type:  this.props.maxScope ? this.props.maxScope.Type : "National",
            Id:     this.props.maxScope ? this.props.maxScope.Id : "1",
        }
        console.log(this.props.initialLocation);
        let initialLocation = {
            Type:  this.props.initialLocation.Type ? this.props.initialLocation.Type : maxScope.Type,
            Id:     this.props.initialLocation.Id ? this.props.initialLocation.Id : maxScope.Id,
        }

        this.setState({
            maxScope: maxScope,
            initialLocation: initialLocation

        }, () =>{
            console.log(this.state);
            let initLocationIndex = this.findIndexForLocationType(initialLocation.Type)

            //Work backwards to define all the locations that the initial location belongs to
    
            let locations = {
                "National"  : "1|Nigeria|National",
                "State"     : undefined,
                "LGA"       : undefined,
                "Ward"      : undefined,
                "Facility"  : undefined
            }
            
            this.getLocationHierarchyForInitLocation(initLocationIndex, initialLocation.Id, this.setLocationState, locations)
        })


    }

    getLocationHierarchyForInitLocation = async (currentIndex, currentLocationId,completionCallback, locations) =>{
        if (currentIndex === 0){
            completionCallback(locations)
            return
        }else{
            console.log(currentLocationId)
            let location = await (this.findLocationByQuery(hierarchyLevels[currentIndex], {Id:currentLocationId}))
            console.log(location)
            location = location[0]
            locations[hierarchyLevels[currentIndex]] = `${location.Id}|${location.Name}|${hierarchyLevels[currentIndex]}`
            this.getLocationHierarchyForInitLocation(currentIndex-1, location.parentId, completionCallback, locations)
        }
    }

    setLocationState = (data) =>{
        this.setState({...data}, () =>{
            this.notifyParent()
            //Then update lists for each level that is defined, plus the first undefined level
            for (let i = 0; i < hierarchyLevels.length; i++){
                this.updateList(hierarchyLevels[i], i, () =>{})
            }
            this.enableDisableLists()
        })
    }

    enableDisableLists = () =>{

        let maxScope = this.state.maxScope
        let enabledDisabledLists = {}

        //Disable all fields if global state is disabled
        if (this.props.disabled === true){
            for (let i = 0; i < hierarchyLevels.length; i++){
                enabledDisabledLists[hierarchyLevels[i]] = true
            }
        }else{
            let disabled = true
            for (let i = 0; i < hierarchyLevels.length; i++){
                //Disable all levels above maxScope.Level, including maxScope
                enabledDisabledLists[hierarchyLevels[i]] = disabled
    
                //Enable all levels after maxScope.Level
                if (hierarchyLevels[i] === maxScope.Type) disabled = false
            }
        }
        this.setState({enabledDisabledLists: enabledDisabledLists})
    }

    handleChange = (level, value) =>{
        //Find Current Level
        let currentLevelIndex = this.findIndexForLocationType(level)
        let currentLevel = level

        //If value is undefined, then Select was cleared so the current Level is one above this level
        if (value === undefined || this.parseLocation(value).Id === "-1"){
            currentLevel = hierarchyLevels[currentLevelIndex - 1]  
            this.setState({[level]: undefined, selectedLocation:this.state[currentLevel]}, () =>{
                this.notifyParent()
            })
        }else{
            //Update Select
            this.setState({[level]: value, selectedLocation:value},  () =>{
                this.notifyParent()
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
        let queryProperty = hierarchyLevels[levelIndex]      //eg level = lga but we need 'LGA' for data.LGA

        //States are special because they don't require a nation lookup
        if (level === "State"){
            list = await this.findAllLocations(level)
        }else{
            levelIndex = hierarchyLevels.findIndex((el) => {return el === level})

            queryProperty = hierarchyLevels[levelIndex] //eg level = lga, queryProperty = LGA
            let aboveLevel = hierarchyLevels[levelIndex-1]
            if (this.state[aboveLevel] === undefined){
                //Short circuit if the above level is undefined
                this.setState({[listName]: []})
                return
            }else{
                let aboveLevelId = this.parseLocation(this.state[aboveLevel]).Id
                list = await this.findLocationByQuery(queryProperty,{parentId: aboveLevelId})
            }
        }

        let optionsList = []
         //Add a clear option to the front of the array (mobile users won't see the clear button)

        optionsList.push(
            <Option key = {-1} value = "-1||"><em>Clear Selection</em></Option>
        )

        //Add the remaining objects
        list.forEach((el)=>{
            optionsList.push(
                <Option key = {el.Id} value = {`${el.Id}|${el.Name}|${level}`}>{el.Name}</Option>
            )
        })
        
        if (optionsList.length > 0){
            this.setState({[listName]: optionsList})
        }

        if (callBack) callBack()
    }

    parseLocation (value) {
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
            let location = undefined
            for (let i = hierarchyLevels.length-1; i >=0 ; i--){
                if (this.state[hierarchyLevels[i]] !== undefined){
                    location = this.state[hierarchyLevels[i]]
                    break
                }
            }
            this.props.parentHandler(this.parseLocation(location))
        }
    }

    render() {
        return (
           <div>
               <Select
                    style={style}
                    placeholder="Country"
                    optionFilterProp="children"
                    defaultValue = "Nigeria"
                    disabled
                >
                    <Option value="Nigeria">Nigeria</Option>
                </Select>
                <br/>
                <Select
                    showSearch
                    style={style}
                    placeholder="State"
                    optionFilterProp="children"
                    value = {this.state.State}
                    onChange={(value) => {this.handleChange("State", value)}}
                    disabled = {this.state.enabledDisabledLists.State}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.StateList}
                </Select>
                <br/>
                <Select
                    showSearch
                    style={style}
                    placeholder="LGA"
                    optionFilterProp="children"
                    value = {this.state.LGA}
                    onChange={(value) => {this.handleChange("LGA", value)}}
                    disabled = {this.state.enabledDisabledLists.LGA}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.LGAList}
                </Select>
                <br/>
                <Select
                    showSearch
                    style={style}
                    placeholder="Ward"
                    optionFilterProp="children"
                    value = {this.state.Ward}
                    onChange={(value) => {this.handleChange("Ward", value)}}
                    disabled = {this.state.enabledDisabledLists.Ward}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.WardList}
                </Select>
                <br/>
                <Select
                    showSearch
                    style={style}
                    placeholder="Facility"
                    optionFilterProp="children"
                    value = {this.state.Facility}
                    onChange={(value) => {this.handleChange("Facility", value)}}
                    disabled = {this.state.enabledDisabledLists.Facility}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.FacilityList}
                </Select>
                <br/>
                <div hidden = {!this.props.showLocation}>
                    <p>
                        Selected Location: {`${this.parseLocation(this.state.selectedLocation).Name} (${this.parseLocation(this.state.selectedLocation).Type})`}
                    </p>
                </div>
               
           </div>
        );
    }
}

export default LocationSelector;
