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
import { VictoryBar, VictoryGroup, VictoryStack, VictoryTooltip } from 'victory';
import { timeFormat } from 'd3';
import _ from 'lodash';
import BaseChart from './BaseChart';
import ChartContainer from './ChartContainer';
import LegendComponent from './LegendComponent';
import darkTheme from './resources/themes/victoryDarkTheme';
import lightTheme from './resources/themes/victoryLightTheme';
import Constants from './util/Constants';

/**
 * Class to handle visualization of Bar charts.
 */
export default class BarChart extends BaseChart {

    constructor(props) {
        super(props);
        this.handleMouseEvent = this.handleMouseEvent.bind(this);
        this.handleLegendInteraction = this.handleLegendInteraction.bind(this);
        this.getBarChartComponent = this.getBarChartComponent.bind(this);
    }

    /**
     * Check if the chart is horizontal.
     * @param {Object} config - chart configuration provided by the user.
     * @returns {Boolean} - true in the case of the chart alignment is horizontal false if not.
     */
    static isHorizontal(config) {
        return _.find(config.charts, { orientation: 'left' });
    }

    /**
     * Generate the chart components in the case where there's only Bar charts defined in the chart config.
     * @param {Array} chartArray - Array containing objects that has the information to visualize each area chart.
     * @param {String} xScale - xAxis scale to be used in the charts.
     * @param {Object} dataSets - object containing arrays of data after classification.
     * @param {Object} config - object containing user provided chart configuration
     * @param {Function} onClick - function to be executed on click event
     * @param {Array} ignoreArray - array that contains dataSets to be ignored in rendering the components.
     * @returns {{chartComponents: Array, legendComponents: Array}}
     */
    getBarChartComponent(chartArray, dataSets, config, onClick, xScale, ignoreArray, currentTheme) {
        const chartComponents = [];
        const legendComponents = [];
        let dataSetLength = 1;

        chartArray.forEach((chart, chartIndex) => {
            const localSet = [];
            _.keys(chart.dataSetNames).forEach((dsName) => {
                legendComponents.push({
                    name: dsName,
                    symbol: { fill: _.indexOf(ignoreArray, dsName) > -1 ? '#d3d3d3' : chart.dataSetNames[dsName] },
                    chartIndex,
                });

                if (dataSetLength < dataSets[dsName].length) dataSetLength = dataSets[dsName].length;
                if ((_.indexOf(ignoreArray, dsName)) === -1) {
                    localSet.push((
                        BarChart.getComponent(config, chartIndex, xScale, dataSets[dsName],
                            chart.dataSetNames[dsName], onClick, currentTheme)
                    ));
                }
            });

            if (chart.mode === 'stacked') {
                this.state.stacked = true;
                chartComponents.push((
                    <VictoryStack
                        key={`victoryStackGroup-${chart.id}`}
                        name="blacked"
                    >
                        {localSet}
                    </VictoryStack>
                ));
            } else {
                chartComponents.push(...localSet);
            }
        });

        const found0 = _.findIndex(_.values(dataSets), (o) => {
            if (o.length > 0) {
                return o[0].x === 0;
            } else {
                return false;
            }
        });

        if (found0 > -1 && !BarChart.isHorizontal(config)) {
            dataSetLength += 1;
        }

        return { chartComponents, legendComponents, dataSetLength };
    }

    /**
     * Generate a single Area chart component to be visualized.
     * @param {Object} config - Chart configuration provided by the user.
     * @param {Number} chartIndex - Index of the chart definition in the chart Array.
     * @param {String} xScale - Scale to be used in the xAxis when plotting the chart.
     * @param {Array} data - Array of objects that containing the dataset to be plotted using this chart component.
     * @param {String} color - Color the chart should be plotted in.
     * @param {Function} onClick - Function to be executed in the case of an click event.
     * @returns {Element}
     */
    static getComponent(config, chartIndex, xScale, data, color, onClick, currentTheme) {
        return (
            <VictoryBar
                key={`bar-${chartIndex}`}
                name="blacked"
                labels={
                    (() => {
                        if (xScale === 'time' && config.tipTimeFormat) {
                            return (d) => {
                                return `${config.x} : ${timeFormat(config.tipTimeFormat)(new Date(d.x))}\n` +
                                    `${config.charts[chartIndex].y} : ${Number(d.y).toFixed(2)}`;
                            };
                        } else {
                            return (d) => {
                                if (isNaN(d.x)) {
                                    return `${config.x} : ${d.x}\n${config.charts[chartIndex].y} : ${Number(d.y)
                                        .toFixed(2)}`;
                                } else {
                                    return `${config.x} : ${Number(d.x).toFixed(2)}\n` +
                                        `${config.charts[chartIndex].y} : ${Number(d.y).toFixed(2)}`;
                                }
                            };
                        }
                    })()
                }
                labelComponent={
                    <VictoryTooltip
                        orientation='top'
                        pointerLength={4}
                        cornerRadius={2}
                        flyoutStyle={{
                            fill: currentTheme.tooltip.style.flyout.fill,
                            fillOpacity: currentTheme.tooltip.style.flyout.fillOpacity,
                            strokeWidth: currentTheme.tooltip.style.flyout.strokeWidth,
                        }}
                        style={{ fill: currentTheme.tooltip.style.labels.fill }}
                    />
                }
                data={data}
                color={color}
                events={[
                    {
                        target: 'data',
                        eventHandlers: {
                            onClick: () => {
                                return [{ target: 'data', mutation: onClick }];
                            },
                        },
                    },
                ]}
                animate={config.animate ? { onEnter: { duration: 100 } } : null}
            />
        );
    }

    render() {
        const { config, height, width, yDomain, theme } = this.props;
        const { chartArray, dataSets, xScale, ignoreArray, isOrdinal, xAxisRange, xAxisType } = this.state;
        const currentTheme = theme === 'light' ? lightTheme : darkTheme;

        let { chartComponents, legendComponents, dataSetLength } =
            this.getBarChartComponent(chartArray, dataSets, config, this.handleMouseEvent, xScale, ignoreArray,
                currentTheme);

        let fullBarWidth = ((BarChart.isHorizontal(config) ?
            (height - 120) : (width - 280)) / (dataSetLength)) - 1;


        if (!isOrdinal) {
            if (xScale === 'time' && config.timeStep && xAxisRange[0]) {
                switch (config.timeStep.toLowerCase()) {
                    case 'day':
                        fullBarWidth = ((BarChart.isHorizontal(config) ?
                            (height - 120) : (width - 280)) / ((xAxisRange[1] - xAxisRange[0]) / Constants.MILLISECONDS_FOR_DAY)) + 1;
                        break;
                    case 'month':
                        fullBarWidth = ((BarChart.isHorizontal(config) ?
                            (height - 120) : (width - 280)) / ((xAxisRange[1] - xAxisRange[0]) / Constants.MILLISECONDS_FOR_MONTH)) + 1;
                        break;
                    case 'year':
                        fullBarWidth = ((BarChart.isHorizontal(config) ?
                            (height - 120) : (width - 280)) / ((xAxisRange[1] - xAxisRange[0]) / Constants.MILLISECONDS_FOR_YEAR)) + 1;
                        break;
                    case 'hour':
                        fullBarWidth = ((BarChart.isHorizontal(config) ?
                            (height - 120) : (width - 280)) / ((xAxisRange[1] - xAxisRange[0]) / Constants.MILLISECONDS_FOR_HOUR)) + 1;
                        break;
                    case 'minute':
                        fullBarWidth = ((BarChart.isHorizontal(config) ?
                            (height - 120) : (width - 280)) / ((xAxisRange[1] - xAxisRange[0]) / Constants.MILLISECONDS_FOR_MINUTE)) + 1;
                        break;
                    case 'second':
                        fullBarWidth = ((BarChart.isHorizontal(config) ?
                            (height - 120) : (width - 280)) / ((xAxisRange[1] - xAxisRange[0]) / Constants.MILLISECONDS_FOR_SECOND)) + 1;
                        break;
                    case 'millisecond':
                        fullBarWidth = ((BarChart.isHorizontal(config) ?
                            (height - 120) : (width - 280)) / (xAxisRange[1] - xAxisRange[0])) + 1;
                        break;
                    default:
                        return;
                }
            } else {
                fullBarWidth = ((BarChart.isHorizontal(config) ?
                    (height - 120) : (width - 280)) / ((xAxisRange[1] - xAxisRange[0] + (2 * (config.linearSeriesStep || 1))) / (config.linearSeriesStep || 1)));
            }
        }

        fullBarWidth = (fullBarWidth > 100) ? fullBarWidth * 0.8 : fullBarWidth;

        const barWidth = Math.floor(fullBarWidth / chartComponents.length);
        chartComponents = [
            <VictoryGroup
                name="blacked"
                key="victoryMainGroup"
                horizontal={BarChart.isHorizontal(config)}
                offset={barWidth}
                style={{ data: { width: barWidth } }}
            >
                {chartComponents}
            </VictoryGroup>,
        ];

        return (
            <ChartContainer
                width={width}
                height={height}
                xScale={xScale}
                config={config}
                disableContainer
                horizontal={BarChart.isHorizontal(config)}
                yDomain={yDomain}
                theme={theme}
                isOrdinal={isOrdinal}
                dataSets={dataSets}
                barData={{ barWidth, dataSetLength, fullBarWidth }}
            >
                {
                    config.legend === true ?
                        <LegendComponent
                            height={height}
                            width={width}
                            legendItems={legendComponents}
                            interaction={this.handleLegendInteraction}
                            config={config}
                        /> : null

                }
                {chartComponents}
            </ChartContainer>
        );
    }
}
