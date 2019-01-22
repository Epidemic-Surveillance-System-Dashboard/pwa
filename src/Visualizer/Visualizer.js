import React, { Component } from 'react';

//antd for ui components
import { DatePicker } from 'antd';

//react-vis for graphs
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, FlexibleWidthXYPlot, VerticalBarSeriesCanvas, XAxis, YAxis, HorizontalGridLines, RadialChart, ChartLabel , LineSeriesCanvas, LineMarkSeries, DiscreteColorLegend, VerticalGridLines} from 'react-vis';


class Visualizer extends Component {

    startDate = null

    mockMetric = {
        name: "Male Deaths Ages 0-19",
        data: [
            {
                Month: 'JAN',
                Year: 2017,
                Value: Math.floor(Math.random() * 10)
            },
            { Month: 'FEB', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'MAR', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'APR', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'MAY', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'JUN', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'JUL', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'AUG', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'SEP', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'OCT', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'NOV', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'DEC', Year: 2017, Value: Math.floor(Math.random() * 10)},
            { Month: 'JAN', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'FEB', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'MAR', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'APR', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'MAY', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'JUN', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'JUL', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'AUG', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'SEP', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'OCT', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'NOV', Year: 2018, Value: Math.floor(Math.random() * 10)},
            { Month: 'DEC', Year: 2018, Value: Math.floor(Math.random() * 10)},
        ]
    }

    mockSet = {
        name: "Male Deaths",
        month: 'JAN',
        year: 2018,
        data:[
            {
                Value: Math.floor(Math.random() * 10),
                Metric: "Male Deaths 0-10"
            },
            { Value: Math.floor(Math.random() * 10), Metric: "Male Deaths 10-40"},
            { Value: Math.floor(Math.random() * 10), Metric: "Male Deaths 40-80"},
            { Value: Math.floor(Math.random() * 10), Metric: "Male Deaths 80+"},
        ]
    }

    mockGroup = {

    }

    /**
     * Data Transform Utilities. Transforms DB JSON output into a usable format for the relevant graph type.
     * Because we haven't integrated the tool to extract JSON from the DB yet, we are making some assumptions
     * here about what the JSON will look like. As a result, these utiltiies are subject to change, though
     * the graphs are unlikely to.
     */

    MetricOverTime() {
        /**
         * Input Format:
         *      sortedData = {[
         *              {metric:"metricName", dateTime: "unix timestamp", value: numberValue}
         *              ]}
         * 
         * 
         * Example:
         * 
         * 
         *         let barData = [
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,0,1).getTime()/1000, value: Math.random() * 1000},
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,1,1).getTime()/1000, value: Math.random() * 1000},
            {metric: "Vaccines Given Per Month", dateTime: new Date(2018,2,1).getTime()/1000, value: Math.random() * 1000}
        ]

         */

        let series = []
        let name = ""
        for (let i = 0; i < this.props.data.length; i++) {
            let dataPoint = this.props.data[i]
            if (i == 0) name = dataPoint.metric
            let date = new Date(dataPoint.dateTime * 1000)
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            series.push({
                x: `${months[date.getMonth()]} ${date.getFullYear()}`,
                y: dataPoint.value
            })
        }
        return { name: name, series: series }
    }

    BarChart(defaults) {

        let data = this.MetricOverTime()

        return (
            <FlexibleWidthXYPlot xType="ordinal" height={defaults.height} xDistance={defaults.xDistance}>
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeriesCanvas data={data.series} />
            </FlexibleWidthXYPlot>
        )
    }

    PieChart(defaults) {
        return (
            <RadialChart data={this.props.data} showLabels={true} />
        )
    }

    createBarSeries(){
        let data = this.mockSet.data
        return data.map(element =>{
            return {x: element.Metric, y: element.Value}
        })
    }

    Histogram(defaults) {

        let data = this.createBarSeries()

        return(
            <FlexibleWidthXYPlot xType="ordinal" height={defaults.height}>
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeriesCanvas data={data} />
            </FlexibleWidthXYPlot>
        )
    }

    createLineSeriesWithLegend(){
        //Transform data into multiple series, as required
        //Proof of concept; data may look different as it arrives from the DB

        // let numSeries = Math.ceil(this.mockMetric.data.length / 12)
        // console.log(numSeries)
        // let LineMarkSeriesSet = []

        let strokeColors = [
            "#001f3f",
            "#39CCCC",
            "#2ECC40",
            "#FF851B",
            "#85144b",
            "#111111",
            "#0074D9",
            "#3D9970",
            "#FFDC00",
            "#B10DC9",
        ]

        let elements = {
            legend:null,
            series:[]
        }
        let dataForYear = []
        let currentYear = 0
        let legend = []
        let yearStartIndex = 0
        for (let i = 0; i < this.mockMetric.data.length; i++){
            //Create data for the year
            let dataPoint = {
                x: this.mockMetric.data[i].Month,
                y: this.mockMetric.data[i].Value
            }
            dataForYear.push(dataPoint)

            //With 12 data points OR at end of data set, create a LineMarkSeries
            if (i === (this.mockMetric.data.length-1) || (i + 1) % 12 === 0 ){
                let color = strokeColors[currentYear % strokeColors.length]
                let _d = dataForYear.slice()
                elements.series.push(
                    <LineMarkSeries key ={i} data = {_d} color={color} colorType="literal"  />
                )

                let title = `${this.mockMetric.data[yearStartIndex].Month} ${this.mockMetric.data[yearStartIndex].Year}-${this.mockMetric.data[i].Month} ${this.mockMetric.data[i].Year}`

                legend.push({
                    title: title,
                    color: color
                })

                //Reset
                dataForYear = []
                currentYear++
                yearStartIndex = (i+1)
            }
        }

        //Create legend

        let legendElement = <DiscreteColorLegend orientation="horizontal" items={legend} />
        elements.legend = legendElement

        return elements

    }

    Line(defaults) {

        let elements = this.createLineSeriesWithLegend()

        return(
            <div>
                <FlexibleWidthXYPlot xType="ordinal" height={defaults.height}>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <XAxis />
                    <YAxis />
                    {elements.series}
                </FlexibleWidthXYPlot>
                {elements.legend}
            </div>
        )
    }

    /**
     * Types:
     *      LineChart([Metric Over Time])
     *      BarChart(Set of Metrics @ 1 time)
     *      PieChart(Set of Metrics @ 1 time)
     *      DoubleBarChart(Set of Sets)
     */


    setStartDate = (moment, dateString) =>{
        try{
            this.startDate = moment._d
        }catch(e){
            //sometimes moment._d is null for some reason
        }

        //TODO: (async) update data to reflect start date selected
    }

    render() {

        const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

        //Define Defaults
        let defaults = {
            width: 350,
            height: 350,
            xDistance: 100,
            title: "Graph"
        }

        //Override Defaults where appropriate
        Object.keys(defaults).forEach((key) => {
            if (this.props[key] !== undefined) defaults[key] = this.props[key]
        });

        let graph = null

        switch (this.props.type) {
            case "barchart":
                graph = this.BarChart(defaults)
                break;
            case "piechart":
                graph = this.PieChart(defaults)
                break;
            case "histogram":
                graph = this.Histogram(defaults)
                break;
            case "line":
                graph = this.Line(defaults)
                break;
        }

        if (graph !== null) {
            return (
                <div className="Visualizer">
                    <span>
                        <h2>{this.props.title}</h2>
                    </span>
                    <div>
                        <MonthPicker placeholder="From" onChange={this.setStartDate} />                      
                    </div>
                    {graph}
                </div>
            )
        } else {
            return (
                <div className="Visualizer">
                    Sorry, something went wrong.
            </div>)
        }

    }
}

export default Visualizer;
