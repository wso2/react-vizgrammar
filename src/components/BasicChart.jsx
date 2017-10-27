/**
 * Copyright (c) WSO2 Inc. (http://wso2.com) All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

//TODO: Time formatting
//TODO: Browser test IE10 and above, chrome, safari

import React from 'react';
import {
    VictoryChart,
    VictoryGroup,
    VictoryStack,
    VictoryLine,
    VictoryBar,
    VictoryTheme,
    VictoryArea,
    VictoryPortal,
    VictoryTooltip,
    VictoryContainer,
    VictoryVoronoiContainer,
    VictoryLegend,
    VictoryScatter,
    VictoryAxis,
    VictoryLabel
} from 'victory';
import PropTypes from 'prop-types';
import { formatPrefix, timeFormat } from 'd3';

import { getDefaultColorScale } from './helper';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class BasicCharts extends React.Component {

    xRange = [];

    constructor(props) {
        super(props);
        this.state = {
            height: props.height || props.config.height || 450,
            width: props.width || props.config.width || 800,
            dataSets: {},
            chartArray: [],
            initialized: false,
            xScale: 'linear',
            orientation: 'bottom',
            xDomain: [null, null],

        };

        this.handleAndSortData = this.handleAndSortData.bind(this);
    }

    componentDidMount() {
        this.handleAndSortData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.handleAndSortData(nextProps);
    }

    componentWillUnmount() {
        this.setState({});
    }

    /**
     * Handles the sorting of data and populating the dataset
     * @param props
     */
    handleAndSortData(props) {
        let { config, metadata, data } = props;
        let { dataSets, chartArray, initialized, xScale, orientation, xDomain, xRange } = this.state;
        let xIndex = metadata.names.indexOf(config.x);
        xScale = metadata.types[xIndex] === 'time' ? 'time' : xScale;
        config.charts.map((chart, chartIndex) => {
            orientation = orientation === 'left' ? orientation : (chart.orientation || 'bottom');

            let yIndex = metadata.names.indexOf(chart.y);
            if (!initialized) {
                chartArray.push({
                    type: chart.type,
                    dataSetNames: {},
                    mode: chart.mode,
                    orientation: chart.orientation,
                    colorScale: Array.isArray(chart.colorScale) ? chart.colorScale :
                        getDefaultColorScale(),
                    colorIndex: 0,

                });


            }


            data.map((datum) => {
                let dataSetName = metadata.names[yIndex];
                if (chart.color) {
                    let colorIndex = metadata.names.indexOf(chart.color);
                    dataSetName = colorIndex > -1 ? datum[colorIndex] : dataSetName;
                }

                dataSets[dataSetName] = dataSets[dataSetName] || [];



                if (xScale !== 'time') {
                    dataSets[dataSetName].push({ x: datum[xIndex], y: datum[yIndex] });
                } else {
                    dataSets[dataSetName].push({ x: new Date(datum[xIndex]), y: datum[yIndex] });
                }



                if (dataSets[dataSetName].length > config.maxLength) {
                    dataSets[dataSetName].shift();


                }


                let max = Math.max.apply(null, dataSets[dataSetName].map((d) => d.x));
                let min = Math.min.apply(null, dataSets[dataSetName].map((d) => d.x));

                if (xDomain[0] !== null) {
                    if (min > xDomain[0]) {
                        xDomain[0] = min;
                        this.xRange[0] = min;
                    }

                    if (max > xDomain[1]) {
                        xDomain[1] = max;
                        this.xRange[1] = max;
                    }
                } else {
                    xDomain = [min, max];
                    this.xRange = [min, max];
                }

                if (!chartArray[chartIndex].dataSetNames.hasOwnProperty(dataSetName)) {
                    if (chartArray[chartIndex].colorIndex >= chartArray[chartIndex].colorScale.length) {
                        chartArray[chartIndex].colorIndex = 0;
                    }

                    if (chart.colorDomain) {
                        let colorIn = chart.colorDomain.indexOf(dataSetName);
                        chartArray[chartIndex].dataSetNames[dataSetName] = colorIn >= 0 ? (colorIn < chartArray[chartIndex].colorScale.length ? chartArray[chartIndex].colorScale[colorIn] : chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++]) : chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    } else {
                        chartArray[chartIndex].dataSetNames[dataSetName] = chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    }

                    chartArray[chartIndex].dataSetNames[dataSetName] = chart.fill || chartArray[chartIndex].dataSetNames[dataSetName];


                }

            });
        });




        initialized = true;

        this.setState({ dataSets, chartArray, initialized, xScale, orientation, xDomain });

    }


    render() {

        let { config } = this.props;
        let { height, width, chartArray, dataSets, xScale } = this.state;
        let chartComponents = [];
        let legendItems = [];
        let horizontal = false;
        let lineCharts = [];
        let areaCharts = [];
        let barcharts = [];

        chartArray.map((chart, chartIndex) => {
            switch (chart.type) {
                case 'line':
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });
                        lineCharts.push(
                            <VictoryGroup
                                key={`chart-${chartIndex}-${chart.type}-${dataSetName}`}
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                            >
                                <VictoryLine />
                                <VictoryPortal>
                                    <VictoryScatter
                                        labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation='bottom'
                                            />
                                        }
                                        size={(d, a) => {
                                            return a ? 20 : 6;
                                        }}
                                    />
                                </VictoryPortal>
                            </VictoryGroup>
                        );
                    });
                    break;
                case 'area': {
                    let areaLocal = [];
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });

                        areaLocal.push(
                            <VictoryGroup
                                key={`chart-${chartIndex}-${chart.type}-${dataSetName}`}
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                                style={{ data: { fillOpacity: 0.5 } }}
                            >
                                <VictoryArea />
                                <VictoryPortal>
                                    <VictoryScatter
                                        labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation='bottom'
                                            />
                                        }
                                        size={(d, a) => {
                                            return a ? 20 : 6;
                                        }}
                                    />
                                </VictoryPortal>
                            </VictoryGroup>
                        );
                    });

                    if (chart.mode === 'stacked') {
                        areaCharts.push(
                            <VictoryStack>
                                {areaLocal}
                            </VictoryStack>
                        );
                    } else {
                        areaCharts = areaCharts.concat(areaLocal);

                    }

                    break;
                }
                case 'bar': {
                    let localBar = [];

                    horizontal = horizontal ? horizontal : chart.orientation === 'left';

                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });
                        localBar.push(
                            <VictoryBar
                                labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                labelComponent={
                                    <VictoryTooltip
                                        orientation='bottom'
                                    />
                                }
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}

                            />
                        );

                    });

                    if (chart.mode === 'stacked') {
                        barcharts.push(
                            <VictoryStack>
                                {localBar}
                            </VictoryStack>
                        );
                    } else {
                        barcharts = barcharts.concat(localBar);
                    }


                    break;
                }
            }
        });


        if (areaCharts.length > 0) chartComponents = chartComponents.concat(areaCharts);
        if (lineCharts.length > 0) chartComponents = chartComponents.concat(lineCharts);
        if (barcharts.length > 0) {

            let barWidth = (horizontal ? height : width) / (config.maxLength * (barcharts.length > 1 ? barcharts.length : 2)) - 3;

            chartComponents.push(
                <VictoryGroup
                    horizontal={horizontal}
                    offset={barWidth}
                    style={{ data: { width: barWidth } }}
                >
                    {barcharts}
                </VictoryGroup>
            );
        }

        // console.info('xscale :',xScale);
        return (
            <div style={{ overflow: 'hidden', zIndex: 99999 }}>
                <div style={{ float: 'left', width: '80%', display: 'inline' }}>

                    <VictoryChart
                        width={width}
                        height={height}
                        theme={VictoryTheme.material}
                        container={<VictoryVoronoiContainer />}
                        style={{ marginLeft: 1000 }}
                        scale={{ x: xScale === 'linear' ? 'linear' : 'time', y: 'linear' }}
                        domain={{ x: this.state.xDomain[0] ? this.state.xDomain : null }}
                    >
                        <VictoryAxis crossAxis
                            style={{ axisLabel: { padding: 35 }, fill: config.axisLabelColor || '#455A64' }}
                            label={config.x}
                            tickFormat={xScale === 'linear' ?
                                (text) => {
                                    if (text.toString().match(/[a-z]/i)) {
                                        if (text.length > 5) {
                                            return text.substring(0,4) + '...';
                                        } else {
                                            return text;
                                        }
                                    } else {
                                        return formatPrefix(',.2', Number(text));
                                    }
                                } :
                                config.timeFormat ?
                                    (date) => {
                                        return timeFormat(config.timeFormat)(new Date(date));
                                    } : null}
                            standalone={false}
                            tickLabelComponent={
                                <VictoryLabel
                                    angle={config.xAxisTickAngle || 0}
                                    style={{ fill: config.tickLabelColor || 'black' }}
                                />
                            }


                        />
                        <VictoryAxis dependentAxis crossAxis
                            style={{ axisLabel: { padding: 35 }, fill: config.axisLabelColor || '#455A64' }}
                            label={config.charts.length > 1 ? '' : config.charts[0].y}
                            standalone={false}
                            tickFormat={text => formatPrefix(',.0', Number(text))}
                            tickLabelComponent={
                                <VictoryLabel
                                    angle={config.yAxisTickAngle || 0}
                                    style={{ fill: config.tickLabelColor || 'black' }}


                                />
                            }
                        />
                        {chartComponents}

                    </VictoryChart>


                </div>

                <div style={{ width: '20%', display: 'inline', float: 'right' }}>
                    <VictoryLegend
                        containerComponent={<VictoryContainer responsive={true} />}
                        height={this.state.height}
                        width={300}
                        title="Legend"
                        style={{ title: { fontSize: 25 }, labels: { fontSize: 20 } }}
                        data={legendItems.length > 0 ? legendItems : [{
                            name: 'undefined',
                            symbol: { fill: '#333' }
                        }]}
                    />
                </div>
                {config.brush ?
                    <div
                        style={{ width: '80%', height: 40, display: 'inline', float: 'left', right: 10 }}
                    >
                        <div
                            style={{ width: '10%', display: 'inline', float: 'left', left: 20 }}
                        >
                            <button onClick={() => { 
                                console.info(this.xRange);
                                this.setState({ xDomain: this.xRange }); }}>Reset</button>
                        </div>
                        <div
                            style={{ width: '90%', display: 'inline', float: 'right' }}
                        >
                            <Range
                                max={this.xRange[1] || 15}
                                min={this.xRange[0] || 10}
                                defaultValue={this.xRange}
                                value={this.state.xDomain}
                                allowCross={false}
                                onChange={(d)=>{
                                    this.setState({
                                        xDomain:d
                                    });
                                }}
                            />
                        </div>
                    </div> : null
                }

            </div>

        );
    }
}

BasicCharts.propTypes = {
    data: PropTypes.array,
    config: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};
