import React, { Component } from 'react';

import {Select} from 'antd'

import db from '../Database/database'

const levels = [
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
 * @param {parentHandler} - function that takes a Location Object {id,name,level} and updates the parent
 * @param {showLocation} - boolean that show/hides LocationSelector's builtin location text 
 * @param {maxScope}: optional - {Id: "188", Level: "State"}
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
        National: "1|Nigeria|National" ,
        State:undefined,
        LGA:undefined,
        Ward:undefined,
        Facility:undefined,
        StateList: undefined,
        LGAList: undefined,
        WardList:undefined,
        FacilityList:undefined,
        enabledDisabledLists:{
            "National"  : false,
            "State"     : false,
            "LGA"       : false,
            "Ward"      : false,
            "Facility"  : false
        },
        selectedLocation: "1|Nigeria|National" //E.g. {Id: 123, Name: "ABC"}
    }

    componentDidMount = async () => {
        //Set selectedLocation to maxScope (default = national)
        let maxScope = {
            Level:  this.props.maxScope ? this.props.maxScope.Level : "National",
            Id:     this.props.maxScope ? this.props.maxScope.Id : "1",
        }

        let levelIndex = levels.findIndex((el)=>{return el === maxScope.Level})

        if (maxScope.Level !== "National"){
            let locationObj = (await this.findLocationByQuery(maxScope.Level, {Id:maxScope.Id}))[0]
            this.setInitialLocation(levelIndex,maxScope.Id, () =>{
                this.setState({selectedLocation:`${locationObj.Id}|${locationObj.Name}|${maxScope.Level}`}, () =>{
                    //Update first list that is not disabled
                    if (levelIndex+1 < levels.length) this.updateList(levels[levelIndex+1], levelIndex+1)

                    //Notify parent
                    this.notifyParent(this.parseLocation(this.state.selectedLocation))
                })
            })

        }else{
            this.notifyParent(this.parseLocation(this.state.selectedLocation))    
            if (levelIndex+1 < levels.length) this.updateList(levels[levelIndex+1], levelIndex+1)
        }

        //Cache the enabled/disabledLists
        let disabled = true
        let enabledDisabledLists = {}
        for (let i = 0; i < levels.length; i++){
            //Disable all levels above maxScope.Level, including maxScope
            enabledDisabledLists[levels[i]] = disabled

            //Enable all levels after maxScope.Level
            if (levels[i] === maxScope.Level) disabled = false
        }
        this.setState({enabledDisabledLists: enabledDisabledLists})
        

    }

    setInitialLocation = async (levelIndex, Id, callback) => {
        if (levelIndex === 0){
            callback()
            return
        }else{
            //Set State / LGA / etc
        
            //Find object
            const location = (await this.findLocationByQuery(levels[levelIndex], {Id:Id}))[0]
            let locationText = `${location.Id}|${location.Name}|${levels[levelIndex]}`

            //Cretae option list (of 1 option for selected location value
            let option = [<Option key = {0} value = {locationText}>{location.Name}</Option>]
            let optionListName = `${levels[levelIndex]}List`

            //Set the location and list
            this.setState({
                [levels[levelIndex]]: `${location.Id}|${location.Name}|${levels[levelIndex]}`,
                [optionListName]    : option
            }, () =>{
                this.setInitialLocation(levelIndex-1, location.parentId, callback)
            })
        }
    }

    handleChange = (level, value) =>{
        //Find Current Level
        let currentLevelIndex = levels.findIndex((el) => {return el === level}) //Todo: error checking
        let currentLevel = level

        //If value is undefined, then Select was cleared so the current Level is one above this level
        if (value === undefined || this.parseLocation(value).Id === "-1"){
            currentLevel = levels[currentLevelIndex - 1]  
            this.setState({[level]: undefined, selectedLocation:this.state[currentLevel]}, () =>{
                this.notifyParent(this.parseLocation(this.state[currentLevel]))
            })
        }else{
            //Update Select
            this.setState({[level]: value, selectedLocation:value},  () =>{
                this.notifyParent(this.parseLocation(this.state[currentLevel]))
            })
        }
        
        //Whenever the value has changed, all the subordinate options have been invalidated 
        for (let i = currentLevelIndex + 1; i < levels.length; i++){
            let statePropertyName = levels[i]
            const x = i
            this.setState({[statePropertyName]: undefined}, () =>{
                this.updateList(statePropertyName, x)
            })
        }
    }

    updateList = async (level, levelIndex) => {
        let list = []
        let listName = `${level}List`   //E.g. We will be updating this.state.FacilityList
        let queryProperty = levels[levelIndex] //eg level = lga but we need 'LGA' for data.LGA

        //States are special because they don't require a nation lookup
        if (level === "State"){
            list = await this.findAllLocations(level)
            console.log(list)
        }else{
            levelIndex = levels.findIndex((el) => {return el === level})

            queryProperty = levels[levelIndex] //eg level = lga, dataProperty = LGA
            let aboveLevel = levels[levelIndex-1]
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
    }

    parseLocation (value) {
        if (value === undefined) return {
            Id:"",Name:"",Level:""
        }
        let valueArr = value.split("|")
        return{
            Id:     valueArr[0],
            Name:   valueArr[1],
            Level:  valueArr[2]
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
                    allowClear
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
                    allowClear
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
                    allowClear
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
                    allowClear
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
                        Selected Level: {this.state.selectedLocation ? this.parseLocation(this.state.selectedLocation).Level : ""}
                    </p>
                    <br/>
                    <p>
                        Selected Location: {this.state.selectedLocation ? this.parseLocation(this.state.selectedLocation).Name : ""}
                    </p>
                </div>
               
           </div>
        );
    }
}

export default LocationSelector;
