import React, { Component } from 'react';

import {Select} from 'antd'

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

//Sample data loaded from backend
const locationData = {"State":[{"Name":"testUpload","Id":"188"}],"LGA":[{"Name":"za Talata Mafara Local Government Area","Id":"134","parentId":"188"}],"Ward":[{"Name":"za Morai Ward","Id":"130","parentId":"134"},{"Name":"za Morkidi Ruwan Bore Ward","Id":"131","parentId":"134"}],"Facility":[{"Name":"za Sakarawa Disp","Id":"133","parentId":"130"},{"Name":"za Mirkidi Dispensary","Id":"134","parentId":"131"}]}


/**
 * Selects a loction in Nigeria
 * @param {parentHandler} - function that takes a Location Object {id,name,level} and updates the parent
 * @param {showLocation} - boolean that show/hides LocationSelector's builtin location text 
 * @param {maxScope} - {Id: "188", Level: "State"}
 */
class LocationSelector extends Component {

    state = {
        // maxLevel: this.props.maxLevel, //Todo
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
            "State"     : true,
            "LGA"       : true,
            "Ward"      : true,
            "Facility"  : true
        },
        selectedLocation: "1|Nigeria|National" //E.g. {Id: 123, Name: "ABC"}
    }

    componentDidMount(){
        
        //Set selectedLocation to maxScope (default = national)
        if (this.props.maxScope && this.props.maxScope.Level !== "National"){
            let locationObj = locationData[this.props.maxScope.Level].find((el) =>{return el.Id === this.props.maxScope.Id})
            let levelIndex = levels.findIndex((el)=>{return el === this.props.maxScope.Level})
            this.setInitialLocation(levelIndex,this.props.maxScope.Id, () =>{
                this.setState({selectedLocation:`${locationObj.Id}|${locationObj.Name}|${this.props.maxScope.Level}`}, () =>{
                    //Update first list that is not disabled
                    if (levelIndex+1 < levels.length) this.updateList(levels[levelIndex+1], levelIndex+1)

                    //Notify parent
                    this.notifyParent(this.parseLocation(this.state.selectedLocation))
                })
            })

        }else{
            this.notifyParent(this.parseLocation(this.state.selectedLocation))    
        }

        //Cache the enabled/disabledLists
        let disabled = true
        let enabledDisabledLists = {}
        for (let i = 0; i < levels.length; i++){
            //Disable all levels above maxScope.Level, including maxScope
            enabledDisabledLists[levels[i]] = disabled

            //Enable all levels after maxScope.Level
            if (levels[i] === this.props.maxScope.Level) disabled = false
        }
        
        this.setState({enabledDisabledLists: enabledDisabledLists})

    }

    setInitialLocation(levelIndex, Id, callback){
        if (levelIndex === 0){
            callback()
            return
        }else{
            //Set State / LGA / etc
        
            //Find object
            const location = locationData[levels[levelIndex]].find((el) => { return el.Id === Id})
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

    updateList = (level, levelIndex) => {
        let list = []
        let listName = `${level}List`   //E.g. We will be updating this.state.FacilityList
        let queryProperty = levels[levelIndex] //eg level = lga but we need 'LGA' for data.LGA

        //States are special because they don't require a nation lookup
        if (level === "State"){
            list = locationData.State
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
                list = locationData[queryProperty].filter((el) => {
                    return el.parentId === aboveLevelId
                })
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
