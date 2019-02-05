import React, { Component } from 'react';

import './Visualizer.css';
//react-vis for graphs
import '../../node_modules/react-vis/dist/style.css';
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, LineMarkSeries, DiscreteColorLegend, VerticalGridLines, VerticalBarSeries, HorizontalBarSeries} from 'react-vis';

const strokeColors = [
    "#001f3f",
    "#2ECC40",
    "#FF851B",
    "#85144b",
    "#111111",
    "#0074D9",
    "#3D9970",
    "#B10DC9",
    "#39CCCC",
]

const averageColor = "#FFDC00"

let colorCounter = 0

class Visualizer extends Component {

    getNextColor = () =>{
        let color = strokeColors[colorCounter]
        colorCounter = (colorCounter + 1) % strokeColors.length
        return color
    }

    startDate = null

    mockMetric = {
        name: "Male Vaccinations Ages 0-19",
        location: {
            state:"Ex",
            lga:"Ex",
            ward:"Ex",
            facility:"Ex",
        },
        data: [
            {
                Month: 'JAN',
                Year: 2017,
                Value: Math.floor(Math.random() * 10)
            },
            { Month: 'FEB', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'MAR', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'APR', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'MAY', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'JUN', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'JUL', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'AUG', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'SEP', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'OCT', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'NOV', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'DEC', Year: 2017, Value: Math.floor(Math.random() * 10) },
            { Month: 'JAN', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'FEB', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'MAR', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'APR', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'MAY', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'JUN', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'JUL', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'AUG', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'SEP', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'OCT', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'NOV', Year: 2018, Value: Math.floor(Math.random() * 10) },
            { Month: 'DEC', Year: 2018, Value: Math.floor(Math.random() * 10) },
        ]
    }

    mockSet = {
        name: "Male Vaccinations",
        startDate: "",
        endDate: "",
        location: {
            state:"Ex",
            lga:"Ex",
            ward:"Ex",
            facility:"Ex",
        },
        data: [
            {
                Value: Math.floor(Math.random() * 10),
                Metric: "Male Vaccinations 0-10"
            },
            { Value: Math.floor(Math.random() * 10), Metric: "Male Vaccinations 10-40" },
            { Value: Math.floor(Math.random() * 10), Metric: "Male Vaccinations 40-80" },
            { Value: Math.floor(Math.random() * 10), Metric: "Male Vaccinations 80+" },
        ]
    }

    mockGroup = {
        name: "Vaccinations",
        startDate: "",
        endDate: "",
        location: {
            state:"Ex",
            lga:"Ex",
            ward:"Ex",
            facility:"Ex",
        },
        data: [
            [
                { Value: Math.floor(Math.random() * 10), Metric: "Male Vaccinations 0-10" },
                { Value: Math.floor(Math.random() * 10), Metric: "Male Vaccinations 10-40" },
                { Value: Math.floor(Math.random() * 10), Metric: "Male Vaccinations 40-80" },
                { Value: Math.floor(Math.random() * 10), Metric: "Male Vaccinations 80+" },
            ],
            [
                { Value: Math.floor(Math.random() * 10), Metric: "Female Vaccinations 0-10" },
                { Value: Math.floor(Math.random() * 10), Metric: "Female Vaccinations 10-40" },
                { Value: Math.floor(Math.random() * 10), Metric: "Female Vaccinations 40-80" },
                { Value: Math.floor(Math.random() * 10), Metric: "Female Vaccinations 80+" },
            ]
        ]
    }

    /**
     * Return the generated series of BarSeries for a doubleBarSeries
     */
    createMultipleBarSeries() {
        let data = this.mockGroup.data
        let result = {
            barSeries: [],
            legend: null
        }

        //Create Common and Uncommon keys
        /**
         * Basically we are trying to identify "Male" and "Female" as the different keys
         * in this mock data
         */
        let commonKeys = []
        let uncommonKeys = []

        for (let i = 0; i < data[0].length; i++) {
            //Assumes all strings have been trimmed
            //Assumes data.length >=2
            let set1 = data[0][i].Metric.split(" ")
            let set2 = data[1][i].Metric.split(" ")

            let wordBounds = Math.min(set1.length, set2.length)
            let matchingWords = 0

            let commonKey = []
            while ((matchingWords < wordBounds) && (set1[set1.length - matchingWords] === set2[set2.length - matchingWords])) {
                commonKey.unshift(set1[set1.length - matchingWords])
                matchingWords++
            }

            commonKey = commonKey.join(" ").trim()
            commonKeys.push(commonKey)

            if (i === 0) {
                for (let j = 0; j < data.length; j++) {
                    let word = data[j][i].Metric
                    uncommonKeys.push({title: word.replace(commonKey, "")})
                }
            }

        }

        //Generate Bar Series using Common Keys
        for (let i = 0; i < data.length; i++) {
            let formattedData = data[i].map((element, id) => {
                return { x: commonKeys[id], y: element.Value }
            })
            result.barSeries.push(<VerticalBarSeries key={i} data={formattedData} />)
        }

        result.legend = <DiscreteColorLegend orientation="horizontal" items={uncommonKeys} />

        return result
    }

    MultipleBar() {

        let data = this.createMultipleBarSeries()

        return (
            <div>
                <FlexibleWidthXYPlot xType="ordinal" height={this.defaults.height} colorRange={['#ffffff', '#000000']}>
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    {data.barSeries}
                </FlexibleWidthXYPlot>
                {data.legend}
            </div>

        )
    }

    createHistogramData(){
        let rawData = this.mockSet
        let barSeriesData = this.createBarSeriesData(rawData)
        return {
            barSeries: barSeriesData.barSeries,
            legend: barSeriesData.legend,
            averageLine: this.createBarSeriesAverage(rawData)
        }
    }

    createBarSeriesData = (rawData) =>{
        let color = this.getNextColor()
        let map = rawData.data.map(element => {
            return { y: element.Metric, x: element.Value }
        })

        return ({
            barSeries:<HorizontalBarSeries data = {map} color = {color}/>,
            legend: <DiscreteColorLegend orientation="horizontal" items={[{title: rawData.name, color: color}, {title: "Average", color: averageColor}]} />
        })
    }

    createBarSeriesAverage = (rawData) => {
        let sum = 0
        let count = 0
        for (let i = 0; i < rawData.data.length; i++){
            sum+=rawData.data[i].Value
            count++
        }
        let average = count > 0 ? sum/count : 0
        let lineData = rawData.data.map(element =>{
            return {y: element.Metric, x: average}
        })
        return (<LineSeries data = {lineData} strokeDasharray = {[7,5]} color = {averageColor}/>)
    }

    Histogram() {

        // let data = this.createBarSeriesData(this.mockSet.data)

        let data = this.createHistogramData()

        return (
            <div>
                <FlexibleWidthXYPlot yType="ordinal" height={this.defaults.height} margin = {{left: this.defaults.barChartLeftMargin}}>
                    <HorizontalGridLines />
                    <VerticalGridLines/>
                    <XAxis />
                    <YAxis />
                    {data.barSeries}
                    {data.averageLine}
                </FlexibleWidthXYPlot>
                {data.legend}
            </div>
        )
    }

    /**
     * Return an object containing an array of LineSeries (max 12 months)
     * and one legend 
     */
    createLineSeriesWithLegend() {

        let elements = {
            legend: null,
            series: []
        }

        let dataForYear = []
        let legend = []
        let yearStartIndex = 0
        let sum = 0
        let count = 0

        for (let i = 0; i < this.mockMetric.data.length; i++) {
            //Create data for the year
            let dataPoint = {
                x: this.mockMetric.data[i].Month,
                y: this.mockMetric.data[i].Value
            }
            dataForYear.push(dataPoint)

            //Add to Average Calculation
            sum += this.mockMetric.data[i].Value
            count++

            //With 12 data points OR at end of data set, create a LineMarkSeries
            if (i === (this.mockMetric.data.length - 1) || (i + 1) % 12 === 0) {
                let color = this.getNextColor()
                let _d = dataForYear.slice()
                elements.series.push(
                    <LineMarkSeries key={i} data={_d} color={color} colorType="literal"/>
                )

                let title = `${this.mockMetric.data[yearStartIndex].Month} ${this.mockMetric.data[yearStartIndex].Year}-${this.mockMetric.data[i].Month} ${this.mockMetric.data[i].Year}`

                legend.push({
                    title: title,
                    color: color
                })

                //Reset
                dataForYear = []
                yearStartIndex = (i + 1)
            }
        }
        
        //Add Average line
        let numMonths = Math.min(this.mockMetric.data.length,12)
        let marks = []
        let average = count > 0 ? sum / count : 0
        for (let i = 0; i < numMonths; i++){
            marks.push({
                x:this.mockMetric.data[i].Month,
                y: average
            })
        }
        
        //Add Average to Legend
        legend.push({
            title: "Average",
            color: averageColor
        })

        elements.series.push(<LineSeries key = {elements.length+1} data = {marks} strokeDasharray={[7,5]} color = {averageColor} colorType = "literal"/>)

        //Create legend

        let legendElement = <DiscreteColorLegend orientation="horizontal" items={legend}/>
        elements.legend = legendElement

        return elements

    }

    Line() {

        let elements = this.createLineSeriesWithLegend()

        return (
            <div>
                <FlexibleWidthXYPlot xType="ordinal" height={this.defaults.height} >
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

    renderGraph = () =>{
        let graph = null
        switch (this.props.type) {
            case "group":
                graph = this.MultipleBar()
                break
            case "set":
                graph = this.Histogram()
                break
            case "metric":
                graph = this.Line()
                break
            default:
                graph = null
                break
        }
        return graph
    }

    defaults = {
        width: 350,
        height: 350,
        xDistance: 100,
        barChartLeftMargin: 150
    }

    render() {
        colorCounter = 0
        //Override Defaults where appropriate
        Object.keys(this.defaults).forEach((key) => {
            if (this.props[key] !== undefined) this.defaults[key] = this.props[key]
        });

        let graph = this.renderGraph()

        if (graph !== null) {
            return graph

        } else {
            return (
                <div>
                    Sorry, something went wrong.
                </div>
            )
        }

    }
}

export default Visualizer;
