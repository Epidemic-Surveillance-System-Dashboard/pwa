import React, { Component } from 'react';
import { DatePicker} from 'antd';
import moment from 'moment';

const {MonthPicker} = DatePicker

class RangeSelector extends Component {

    state = {
        Dates: {
            StartDate: this.props.initialData.Dates.StartDate,
            EndDate: this.props.initialData.Dates.EndDate
        }
    }

    startDateOnChange(date, dateString) {
        var endDate = this.state.Dates.EndDate;
        this.setState({
            Dates: { StartDate: new Date(`${dateString}T00:00:00.000Z`), EndDate: endDate }
        }, () => { 
            this.notifyParent();
        })
    }

    endDateOnChage(date, dateString) {
        var startDate = this.state.Dates.StartDate;
        this.setState({
            Dates: { StartDate: startDate, EndDate: new Date(`${dateString}T00:00:00.000Z`) }
        }, () => { 
            this.notifyParent();
        })
    }
    notifyParent = () =>{
        if (this.props.parentHandler !== undefined && this.props.parentHandler !== null){
            this.props.parentHandler(this.state.Dates);
        }
    }


    plusOne = (num) => {
        return num + 1;
    }

    dateToString = (date) => {
        let str = date.getFullYear() + "-" +
            this.plusOne(date.getMonth()) + "-" +
            this.plusOne(date.getDay());
        return str;
    }

    render() {
        return (
            <div className="center">
                <MonthPicker defaultValue={moment(this.dateToString(this.state.Dates.StartDate), 'YYYY-MM-DD')} placeholder="Start Date" onChange={(date, dateString) => { this.startDateOnChange(date, dateString) }} />
                <MonthPicker defaultValue={moment(this.dateToString(this.state.Dates.EndDate), 'YYYY-MM-DD')} placeholder="End Date" onChange={(date, dateString) => { this.endDateOnChage(date, dateString) }} />
                {/* <DatePicker defaultValue={moment(this.dateToString(this.state.Dates.StartDate), 'YYYY-MM-DD')} placeholder="Start Date" onChange={(date, dateString) => { this.startDateOnChange(date, dateString) }} /> */}
                {/* <DatePicker defaultValue={moment(this.dateToString(this.state.Dates.EndDate), 'YYYY-MM-DD')} placeholder="End Date" onChange={(date, dateString) => { this.endDateOnChage(date, dateString) }} /> */}
            </div>
        )
    };

}

export default RangeSelector;
