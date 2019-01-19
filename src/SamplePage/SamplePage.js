import React, { Component } from 'react';
import '../../node_modules/react-vis/dist/style.css';
import './SamplePage.css';
import Visualizer from '../Visualizer/Visualizer'
import {XYPlot, VerticalBarSeriesCanvas, XAxis, YAxis, HorizontalGridLines} from 'react-vis';

let metric = {
    name: "Hello",
    value: 10,
    date: new Date ("November 1, 2018 00:00:00 GMT"),
}

class SamplePage extends Component {

    transform(rawData){
        let data = [
            {x: rawData.name, y: rawData.value},
        ]
        return data
    }

    render() {

        let barData = [
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,0,1).getTime()/1000, value: Math.random() * 1000},
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,1,1).getTime()/1000, value: Math.random() * 1000},
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,2,1).getTime()/1000, value: Math.random() * 1000},
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,3,1).getTime()/1000, value: Math.random() * 1000}
        ]

        let pieData = [
            {angle:50, label: "term 1", subLabel: "50%"},
            {angle:40, label: "term 2"},
            {angle:30, label: "term 3"},
            {angle:20, label: "term 4"},
            {angle:10, label: "term 5"},

        ]
        // let width = this.props.width ? this.props.width : 500
        // let height = this.props.height ? this.props.height : 500
        // let xDistance = this.props.xDistance ? this.props.xDistance : 100

        return (
            <div className="sampleApp">
                <p>
                    This contains sample graphs. 
                    You can pass width, height, xInterval, type, and -- of course -- data to these Visualizer components.
                </p>
                <Visualizer data={barData} title = "Sample Bar Graph" type = "barchart"></Visualizer>
                <Visualizer data={pieData} title = "Sample Pie Graph" type = "piechart"></Visualizer>
                <Visualizer data={barData} title = "Sample Line Graph" type = "histogram"></Visualizer>
            </div>
        );
    }
}

export default SamplePage;
