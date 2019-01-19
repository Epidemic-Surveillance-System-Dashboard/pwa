import React, { Component } from 'react';
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, VerticalBarSeriesCanvas, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, RadialChart, ChartLabel , LineSeriesCanvas} from 'react-vis';


class Visualizer extends Component {


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
            <XYPlot xType="ordinal" width={defaults.width} height={defaults.height} xDistance={defaults.xDistance}>
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeriesCanvas data={data.series} />
            </XYPlot>
        )
    }

    PieChart(defaults) {
        return (
            <RadialChart data={this.props.data} width={defaults.width} height={defaults.height} showLabels={true} />
        )
    }

    Histogram(defaults) {

        let data = this.MetricOverTime()

        return(
            <XYPlot xType="ordinal" width={defaults.width} height={defaults.height} xDistance={defaults.xDistance}>
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeriesCanvas data={data.series} />
            </XYPlot>
        )
    }

    /**
     * Types:
     *      LineChart([Metric Over Time])
     *      BarChart(Set of Metrics @ 1 time)
     *      PieChart(Set of Metrics @ 1 time)
     *      DoubleBarChart(Set of Sets)
     */

    render() {

        //Define Defaults
        let defaults = {
            width: 500,
            height: 500,
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
        }

        if (graph !== null) {
            return (
                <div className="Visualizer">
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
