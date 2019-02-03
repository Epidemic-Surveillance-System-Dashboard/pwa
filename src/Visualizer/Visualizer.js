import React, { Component } from 'react';

//antd for ui components
import { DatePicker } from 'antd';

//react-vis for graphs
import '../../node_modules/react-vis/dist/style.css';
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries, DiscreteColorLegend, VerticalGridLines, VerticalBarSeries} from 'react-vis';


class Visualizer extends Component {

    startDate = null

    mockMetric = {
        name: "Male Vaccinations Ages 0-19",
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
        month: 'JAN',
        year: 2018,
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
        month: 'Jan',
        year: 2018,
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
            if (i === 0) name = dataPoint.metric
            let date = new Date(dataPoint.dateTime * 1000)
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            series.push({
                x: `${months[date.getMonth()]} ${date.getFullYear()}`,
                y: dataPoint.value
            })
        }
        return { name: name, series: series }
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

    MultipleBar(defaults) {

        let data = this.createMultipleBarSeries()

        return (
            <div>
                <FlexibleWidthXYPlot xType="ordinal" height={defaults.height}>
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    {data.barSeries}
                </FlexibleWidthXYPlot>
                {data.legend}
            </div>

        )
    }

    /**
     * Return an array of elements {x: "bar name", y: bar value}
     */
    createBarSeriesData() {
        let data = this.mockSet.data
        return data.map(element => {
            return { x: element.Metric, y: element.Value }
        })
    }

    Histogram(defaults) {

        let data = this.createBarSeriesData()

        return (
            <FlexibleWidthXYPlot xType="ordinal" height={defaults.height}>
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeries data={data} />
            </FlexibleWidthXYPlot>
        )
    }

    /**
     * Return an object containing an array of LineSeries (max 12 months)
     * and one legend 
     */
    createLineSeriesWithLegend() {
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
            legend: null,
            series: []
        }

        let dataForYear = []
        let currentYear = 0
        let legend = []
        let yearStartIndex = 0

        for (let i = 0; i < this.mockMetric.data.length; i++) {
            //Create data for the year
            let dataPoint = {
                x: this.mockMetric.data[i].Month,
                y: this.mockMetric.data[i].Value
            }
            dataForYear.push(dataPoint)

            //With 12 data points OR at end of data set, create a LineMarkSeries
            if (i === (this.mockMetric.data.length - 1) || (i + 1) % 12 === 0) {
                let color = strokeColors[currentYear % strokeColors.length]
                let _d = dataForYear.slice()
                elements.series.push(
                    <LineMarkSeries key={i} data={_d} color={color} colorType="literal" />
                )

                let title = `${this.mockMetric.data[yearStartIndex].Month} ${this.mockMetric.data[yearStartIndex].Year}-${this.mockMetric.data[i].Month} ${this.mockMetric.data[i].Year}`

                legend.push({
                    title: title,
                    color: color
                })

                //Reset
                dataForYear = []
                currentYear++
                yearStartIndex = (i + 1)
            }
        }

        //Create legend

        let legendElement = <DiscreteColorLegend orientation="horizontal" items={legend} />
        elements.legend = legendElement

        return elements

    }

    Line(defaults) {

        let elements = this.createLineSeriesWithLegend()

        return (
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

    setStartDate = (moment, dateString) => {
        try {
            this.startDate = moment._d
        } catch (e) {
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
            case "multiplebar":
                graph = this.MultipleBar(defaults)
                break
            case "histogram":
                graph = this.Histogram(defaults)
                break
            case "line":
                graph = this.Line(defaults)
                break
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
