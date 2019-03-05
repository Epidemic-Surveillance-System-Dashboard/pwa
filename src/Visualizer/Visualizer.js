import React, { Component } from 'react';

//react-vis for graphs
import '../../node_modules/react-vis/dist/style.css';
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, LineMarkSeries, DiscreteColorLegend, VerticalGridLines, HorizontalBarSeries} from 'react-vis';

const strokeColors = [
    "#2980b9",
    "#27ae60",
    "#34495e",
    "#7f8c8d"
]

const averageColor = "#e74c3c"

let colorCounter = 0

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
"JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
]

class Visualizer extends Component {

    getNextColor = () =>{
        let color = strokeColors[colorCounter]
        colorCounter = (colorCounter + 1) % strokeColors.length
        return color
    }

    resetColor = () => {
        colorCounter = 0
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
            legend: null,
            lineData: null
        }

        //Create Common and Uncommon keys
        /**
         * Basically we are trying to identify "Male" and "Female" as the uncommon keys
         * from "Male Vaccinations ..." and "Female Vaccinations ..."
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
                    //Create Legend based on extracted "uncommon" words
                    uncommonKeys.push({title: word.replace(commonKey, ""),color: this.getNextColor()})
                }
            }
        }

        //Generate Bar Series using Common Keys
        this.resetColor()

        let sum = 0
        let count = 0
        
        for (let i = 0; i < data.length; i++) {
            let formattedData = []
            for (let j = 0; j < data[i].length; j++){
                formattedData.push({y: commonKeys[j],x: data[i][j].Value})
                sum += data[i][j].Value
                count++
            }
            result.barSeries.push(<HorizontalBarSeries key={i} data={formattedData} color = {this.getNextColor()} />)
        }

        //Create Average Line 
        let average = count > 0 ? sum / count : 0
        let averageLineData = []
        for (let i = 0; i < commonKeys.length; i++){
            averageLineData.push({
                y: commonKeys[i],
                x: average
            })
        }

        //Add Average to legend
        uncommonKeys.push({title: "Average", color: averageColor})

        result.averageLine = <LineSeries data = {averageLineData} strokeDasharray = {[7,5]} color = {averageColor}/>
        result.legend = <DiscreteColorLegend orientation="horizontal" items={uncommonKeys} />

        return result
    }

    MultipleBar() {

        let data = this.createMultipleBarSeries()

        return (
            <div className="center">
                <FlexibleWidthXYPlot yType="ordinal" height={this.defaults.height} margin={{left:this.defaults.barChartLeftMargin}}>
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    {data.barSeries}
                    {data.averageLine}
                </FlexibleWidthXYPlot>
                {data.legend}
            </div>

        )
    }

    createHistogramData(){
        let rawData = this.props.data
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
            <div className="center">
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
        let sum = 0
        let count = 0

        let data = this.props.data.data || this.mockMetric.data

        if (data[0].hasOwnProperty("Date") === false){
            console.log('adding dates')
            data.forEach(el =>{
                el.Date = new Date(el.Time)
                el.Value = Number.parseInt(el.Value)
            })

            data.sort((a,b)=>{
                return a.Date - b.Date
            })
        }

        let currentYear = null 

        //Create a transparent line series with the correct month order
        //to initialize the x-axis. This is necessary because sometimes
        // the data has no values for consecutive months.

        let blankData = []
        for (let i = 0; i < monthNames.length; i++){
            blankData.push({
                x: monthNames[i],
                y: 0
            })
        }
        let blankDataSeries =  <LineMarkSeries key={-1} data={blankData} color="transparent" colorType="literal"/>
        elements.series.push(blankDataSeries)

        //Create a LineMarkSeries for each year.

        for (let i = 0; i < data.length; i++) {

            if (currentYear === null){
                currentYear = data[i].Date.getUTCFullYear()
            }

            //Create data for the year
            dataForYear.push({
                x: monthNames[data[i].Date.getUTCMonth()],
                y: data[i].Value
            })

            //Add to Average Calculation
            sum += data[i].Value
            count++

            //With 12 data points OR at end of data set, create a LineMarkSeries
            if (i === (data.length - 1) || data[(i + 1)].Date.getUTCFullYear() !== currentYear) {
                let color = this.getNextColor()

                elements.series.push(
                    <LineMarkSeries key={i} data={dataForYear} color={color} colorType="literal"/>
                )

                let title = `${currentYear}`

                //Add legend entry for LineMarkSeries
                legend.push({
                    title: title,
                    color: color
                })

                //Reset
                dataForYear = []
                if (i !== (data.length -1)) currentYear = data[(i + 1)].Date.getUTCFullYear()
            }
        }
        
        //Add Average line
        let marks = []
        let average = count > 0 ? sum / count : 0
        for (let i = 0; i < monthNames.length; i++){
            marks.push({
                x: monthNames[i],
                y: average
            })
        }
        
        //Add legend entry for Average
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
            <div className="center">
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
            case "Group":
                graph = this.MultipleBar()
                break
            case "Set":
                graph = this.Histogram()
                break
            case "Metric":
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
        barChartLeftMargin: 175
    }

    render() {

        if (this.props.show === false) return null

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
