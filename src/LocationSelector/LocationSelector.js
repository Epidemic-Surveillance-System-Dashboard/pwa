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

//Sample data loaded from backend
const sampleData = {"State":[{"Name":"testUpload","Id":"188"}],"LGA":[{"Name":"za Talata Mafara Local Government Area","LgaId":"134","State":"testUpload"}],"Ward":[{"Name":"za Morai Ward","WardId":"130","LGA":"za Talata Mafara Local Government Area"},{"Name":"za Morkidi Ruwan Bore Ward","WardId":"131","LGA":"za Talata Mafara Local Government Area"}],"Facility":[{"Name":"za Sakarawa Disp","FacilityId":"133","Ward":"za Morai Ward"},{"Name":"za Mirkidi Dispensary","FacilityId":"134","Ward":"za Morkidi Ruwan Bore Ward"}]}

class LocationSelector extends Component {

    state = {
        level: "National",
        maxLevel: this.props.maxLevel, //Todo
        State:undefined,
        LGA:undefined,
        Ward:undefined,
        Facility:undefined,
        StateList: undefined,
        LGAList: undefined,
        WardList:undefined,
        FacilityList:undefined,
        list1:[<Option>asdf</Option>],
        selectedLocation: undefined
    }

    componentDidMount(){
        for(let i = 1; i < levels.length; i++){
            this.updateList(levels[i])
        }
    }

    handleChange = (level, value) =>{
        //Update Select
        this.setState({[level]: value, selectedLocation:value})

        //Find Current Level
        let currentLevelIndex = levels.findIndex((el) => {return el === level}) //Todo: error checking
        let currentLevel = level

        //If value is undefined, then Select was cleared so the current Level is one above this level
        if (value === undefined){
            currentLevel = levels[currentLevelIndex - 1]  
            this.setState({level: currentLevel, selectedLocation:this.state[currentLevel]})
        }
        

        //Whenever the value has changed, all the subordinate options have been invalidated 
        //but we only need to update the one directly below because the others will be null
        for (let i = currentLevelIndex + 1; i < levels.length; i++){
            let statePropertyName = levels[i]
            this.setState({[statePropertyName]: undefined}, () =>{
                this.updateList(statePropertyName)
            })
        }
    }

    updateList = (level) => {
        let list = []
        let listName = `${level}List`
        let levelIndex = levels.findIndex((el) => {return el === level})
        let queryProperty = levels[levelIndex] //eg level = lga, queryProperty = LGA
        //States are special because they don't require a nation lookup
        if (level === "State"){
            console.log("state!")
            list = sampleData.State
            console.log(list)
        }else{
            
            levelIndex = levels.findIndex((el) => {return el === level})

            queryProperty = levels[levelIndex] //eg level = lga, dataProperty = LGA
            let aboveLevel = levels[levelIndex-1]
            if (this.state[aboveLevel] === undefined){
                console.log("terminate cuz undefined")
                this.setState({[listName]: []})
                return
            }else{
                console.log(aboveLevel)
                console.log('filtering for ' + this.state[aboveLevel])
                list = sampleData[queryProperty].filter((el) => {
                    return el[aboveLevel] === this.state[aboveLevel]
                })
                console.log(list)
            }
        }

        let optionsList = []
        let keyPropertyName = `${queryProperty}Id` //e.g. FacilityId
        console.log(keyPropertyName)

        list.forEach((el)=>{
            optionsList.push(
                <Option key = {el[keyPropertyName]} value = {el.Name}>{el.Name}</Option>
            )
        })

        if (optionsList.length > 0){
            this.setState({[listName]: optionsList}, () =>{
                console.log(this.state.StateList)
            })
        }
    }

    render() {
        return (
           <div>
               <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Country"
                    optionFilterProp="children"
                    defaultValue = "nigeria"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    <Option value="Nigeria">Nigeria</Option>
                </Select>
                <br/>
                <Select
                    showSearch
                    allowClear
                    style={{ width: 200 }}
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
                    style={{ width: 200 }}
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
                    style={{ width: 200 }}
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
                    style={{ width: 200 }}
                    placeholder="Facility"
                    optionFilterProp="children"
                    value = {this.state.Facility}
                    onChange={(value) => {this.handleChange("Facility", value)}}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.FacilityList}
                </Select>
                <br/>
                Selected Level: {this.state.level}
                <br/>
                Selected Location: {this.state.selectedLocation}
           </div>
        );
    }
}

export default LocationSelector;
