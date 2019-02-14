/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { VictoryScatter, VictoryTooltip } from 'victory';
import _ from 'lodash';
import { scaleLinear } from 'd3';
import BaseChart from './BaseChart';
import VizGError from '../VizGError';
import ChartContainer from './ChartContainer';
import LegendComponent from './LegendComponent';
import lightTheme from './resources/themes/victoryLightTheme';
import darkTheme from './resources/themes/victoryDarkTheme';

/**
 * Class to handle visualization of scatter plots.
 */
export default class ScatterPlot extends BaseChart {
    constructor(props) {
        super(props);
        this.state = {
            dataSets: {},
            chartArray: [],
            xScale: 'linear',
            yDomain: [0, 1],     // Range of y axis
            xDomain: [0, 1],     // Range of x axis values
            isOrdinal: false,    // x Axsis Ordinality
            domainPadding: 50,
        };

        this.sortDataBasedOnConfig = this.sortDataBasedOnConfig.bind(this);
        this.handleMouseClickEvent = this.handleMouseClickEvent.bind(this);
    }

    sortDataBasedOnConfig(props) {
        const { config, data, metadata } = props;
        let { dataSets, chartArray, xScale, yDomain, xDomain, isOrdinal } = this.state;
        if (chartArray.length === 0) chartArray = BaseChart.generateChartArray(config.charts);

        chartArray.forEach((chart, i) => {
            const xIndex = _.indexOf(metadata.names, chart.x);
            const yIndex = _.indexOf(metadata.names, chart.y);
            const sizeIndex = _.indexOf(metadata.names, chart.size);
            const colorIndex = _.indexOf(metadata.names, chart.colorCategoryName);

            xScale = BaseChart.getXScale(metadata.types[xIndex]);
            if (xIndex === -1) throw new VizGError('ScatterPlot', `x axis name '${chart.x}' is not found among metadata.`);
            if (yIndex === -1) throw new VizGError('ScatterPlot', `y axis name '${chart.y}' is not found among metadata.`);
            if (chart.colorCategoryName && colorIndex === -1) throw new VizGError('ScatterPlot', `color dimension name '${chart.colorCategoryName}' is not found among metadata.`);
            if (chart.size && sizeIndex === -1) throw new VizGError('ScatterPlot', `Size dimension name '${chart.size}' not found among metadata`);

            // Forming the dataSet by mapping the dataset
            dataSets[chart.y] = dataSets[chart.y] || [];
            const dataSet = data.map(datum => ({
                x: datum[xIndex],
                y: datum[yIndex],
                color: datum[colorIndex],
                amount: datum[sizeIndex],
                chartIndex: i,
            }));

            // DataSet would not be added to DataSets if DataSets already include that.
            if (_.isEmpty(dataSets) || !_.isEqual(_.sortBy(dataSets[chart.y]), _.sortBy(dataSet))) {
                dataSet.forEach((element) => {
                    dataSets[chart.y].push(element);
                });
            }
            if (chart.colorCategoryName && metadata.types[colorIndex] === 'ordinal') {
                const distinctColorValues = _.uniq(dataSet.map(record => record.color));
                _.difference(distinctColorValues, _.keys(chart.dataSetNames)).forEach((key) => {
                    const colorDomIn = _.indexOf(chart.colorDomain, key);
                    if (chart.colorIndex >= chart.colorScale.length) {
                        chart.colorIndex = 0;
                    }
                    if (colorDomIn < 0) {
                        chart.dataSetNames[key] = chart.colorScale[chart.colorIndex++];
                    } else if (colorDomIn > chart.colorScale.length) {
                        chart.dataSetNames[key] = chart.colorScale[0];
                    } else {
                        chart.dataSetNames[key] = chart.colorScale[colorDomIn];
                    }
                });
                if (_.isEmpty(dataSets)) {
                    _.mergeWith(dataSets, dataSet, (objValue, srcValue) => {
                        if (_.isArray(objValue)) {
                            return objValue.concat(srcValue);
                        }
                    });
                }
            } else {
                chart.dataSetNames[chart.y] = chart.colorScale[0];
            }
            if (config.charts[chart.id].maxLength) {
                const maxLength = config.charts[chart.id].maxLength;
                _.keys(chart.dataSetNames).forEach((key) => {
                    const lengthDiff = dataSets[key].length - maxLength;
                    dataSets[key].splice(0, lengthDiff);
                });
            }
            /**
             * Setting up y range
             * Fix Reason - if there are only one y value in the chart,
             *  it will make the y axis tick points contain decimal values
             */
            if (metadata.types[yIndex] === 'linear') {
                const yRange = { min: null, max: null };
                Object.values(dataSets).forEach((dataSetElement, index) => {
                    const yValueSet = dataSetElement.map(val => val.y);
                    if (index === 0) {
                        yRange.min = _.min(yValueSet);
                        yRange.max = _.max(yValueSet);
                    } else {
                        yRange.min = _.min([yRange.min, _.min(yValueSet)]);
                        yRange.max = _.max([yRange.max, _.max(yValueSet)]);
                    }
                    yDomain = [yRange.min, yRange.max];
                    if (yRange.min === yRange.max) { yDomain = [yRange.min - (yRange.min / 2), yRange.max + (yRange.max / 2)]; }
                });
            }
            /**
             * Setting up x range
             * Fix Reason - if there are only one x value in the chart it will make the y axis tick points contain decimal values
             */
            if (metadata.types[xIndex] === 'linear') {
                const xRange = { min: null, max: null };
                Object.values(dataSets).forEach((dataSetElement, i) => {
                    const xValueSet = dataSetElement.map(val => val.x);
                    if (i === 0) {
                        xRange.min = _.min(xValueSet);
                        xRange.max = _.max(xValueSet);
                    } else {
                        xRange.min = _.min([xRange.min, _.min(xValueSet)]);
                        xRange.max = _.max([xRange.max, _.max(xValueSet)]);
                    }
                    xDomain = [xRange.min, xRange.max];
                    if (xRange.min === xRange.max) { xDomain = [xRange.min - (xRange.min / 2), xRange.max + (xRange.max / 2)]; }
                });
            } else {
                xDomain = null;
            }

            // checking whether x Axis contain ordinal data
            isOrdinal = metadata.types[xIndex] === 'ordinal';
        });

        this.setState({ chartArray, dataSets, xScale, yDomain, xDomain, isOrdinal });
    }

    handleMouseClickEvent(props) {
        const { onClick } = this.props;

        const chartInfo = this.state.chartArray[props.datum.chartIndex];

        const data = {};

        data[chartInfo.x] = props.datum.x;
        data[chartInfo.y] = props.datum.y;
        data.colorCategory = props.datum.color;
        data.size = props.datum.amount;

        return onClick && onClick(data);
    }

    render() {
        const { config, metadata, theme, width, height } = this.props;
        const { chartArray, dataSets, xScale, isOrdinal } = this.state;
        const chartComponents = [];
        const legendComponents = [];
        const currentTheme = theme === 'light' ? lightTheme : darkTheme;

        chartArray.forEach((chart) => {
            const colorIndex = _.indexOf(metadata.names, chart.colorCategoryName);

            _.keys(dataSets).forEach((key) => {
                /**
                 * Adding a null record if scatter plot dataset contains single data
                 *
                 * #Fix For - If the a dataset contain single record Victory has an issue,
                 * which is not being able to compare two values in the dataset
                 *
                 */
                if (_.uniq(dataSets[key].map(record => record.amount)).length === 1) {
                    if (isOrdinal) {
                        const changedRecord = { ...dataSets[key][0] };
                        changedRecord.amount = null;
                        dataSets[key].unshift(changedRecord);
                    } else {
                        dataSets[key].unshift({ x: null, y: null, color: null, amount: null });
                    }
                }
                // Adding Legend records
                _.keys(chart.dataSetNames).forEach((colorColumn) => {
                    legendComponents.push({ name: colorColumn, symbol: { fill: chart.dataSetNames[colorColumn] } });
                });
                chartComponents.push((
                    <VictoryScatter
                        key={'scatter-plot-' + chart.id}
                        data={dataSets[key]}
                        bubbleProperty='amount'
                        maxBubbleSize={15}
                        minBubbleSize={5}
                        style={{
                            data: {
                                fill: (() => {
                                    if (colorIndex > -1 && metadata.types[colorIndex] === 'linear') {
                                        return (d) => {
                                            return scaleLinear()
                                                .range([chart.colorScale[0], chart.colorScale[1]])
                                                .domain([
                                                    _.min(dataSets[key].map(obj => obj.color)),
                                                    _.max(dataSets[key].map(obj => obj.color))])(d.color);
                                        };
                                    } else if (colorIndex > -1) {
                                        return d => chart.dataSetNames[d.color];
                                    } else {
                                        return null;
                                    }
                                })(),
                            },
                        }}
                        labels={
                            (d) => {
                                let text = `${config.charts[chart.id].x} : ${d.x}\n` +
                                    `${config.charts[chart.id].y} : ${d.y}\n`;
                                if (config.charts[chart.id].size) {
                                    text += `${config.charts[chart.id].size} : ${d.amount}\n`;
                                }

                                if (config.charts[chart.id].color) {
                                    text += `${config.charts[chart.id].color} : ${d.color}`;
                                }

                                return text;
                            }
                        }
                        labelComponent={
                            <VictoryTooltip
                                orientation='top'
                                pointerLength={4}
                                cornerRadius={2}
                                flyoutStyle={{
                                    fill: currentTheme.tooltip.style.flyout.fill,
                                    fillOpacity: currentTheme.tooltip.style.flyout.fillOpacity,
                                    strokeWidth: currentTheme.tooltip.style.flyout.strokeWidth
                                }}
                                style={{ fill: currentTheme.tooltip.style.labels.fill }}
                            />
                        }
                        events={[{
                            target: 'data',
                            eventHandlers: {
                                onClick: () => {
                                    return [{ target: 'data', mutation: this.handleMouseClickEvent }];
                                },
                            },
                        }]}
                        animate={config.animate ? { onEnter: { duration: 100 } } : null}
                    />
                ));
            });
        });

        return (
            <ChartContainer
                width={this.props.width || width || 800}
                height={this.props.height || height || 800}
                config={config}
                xScale={xScale}
                yDomain={this.state.yDomain}
                xDomain={this.state.xDomain}
                dataSets={dataSets}
                theme={theme}
                isOrdinal={this.state.isOrdinal}
                domainPadding={this.state.domainPadding}
            >
                {chartComponents}
                {
                    config.legend ?
                        <LegendComponent
                            height={height}
                            width={width}
                            legendItems={legendComponents}
                            interaction={() => { }}
                            config={config}
                        /> : null
                }
            </ChartContainer>
        );
    }
}
