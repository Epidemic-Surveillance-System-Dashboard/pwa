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

class LocationSelector extends Component {

    state = {
        maxLevel: this.props.maxLevel, //Todo
        State:undefined,
        LGA:undefined,
        Ward:undefined,
        Facility:undefined,
        StateList: undefined,
        LGAList: undefined,
        WardList:undefined,
        FacilityList:undefined,
        selectedLocation: "1|Nigeria|National" //E.g. {Id: 123, Name: "ABC"}
    }

    componentDidMount(){
        //Generate Initial Lists
        for(let i = 1; i < levels.length; i++){
            this.updateList(levels[i])
        }
    }

    handleChange = (level, value) =>{
        //Find Current Level
        let currentLevelIndex = levels.findIndex((el) => {return el === level}) //Todo: error checking
        let currentLevel = level

        //If value is undefined, then Select was cleared so the current Level is one above this level
        if (value === undefined){
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
        //Precondition: value not null
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
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.FacilityList}
                </Select>
                <br/>
                <div hidden = {!this.props.showLocation}>
                Selected Level: {this.state.selectedLocation ? this.parseLocation(this.state.selectedLocation).Level : ""}
                <br/>
                Selected Location: {this.state.selectedLocation ? this.parseLocation(this.state.selectedLocation).Name : ""}
                </div>
               
           </div>
        );
    }
}

export default LocationSelector;
