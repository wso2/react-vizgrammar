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
import { VictoryBar, VictoryTooltip, VictoryStack, VictoryGroup } from 'victory';
import { timeFormat } from 'd3';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BaseChart from './BaseChart';
import ChartContainer from './ChartContainer';
import LegendComponent from './LegendComponent';

export default class BarChart extends BaseChart {

    constructor(props) {
        super(props);
        this.handleMouseEvent = this.handleMouseEvent.bind(this);
        this.handleLegendInteraction = this.handleLegendInteraction.bind(this);
    }

    static isHorizontal(config) {
        return _.find(config.charts, { orientation: 'left' }) !== undefined;
    }

    static getBarChartComponent(chartArray, dataSets, config, onClick, xScale, ignoreArray) {
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
                        BarChart.getComponent(config, chartIndex, xScale, dataSets[dsName], chart.dataSetNames[dsName], onClick)
                    ));
                }
            });

            if (chart.mode === 'stacked') {
                chartComponents.push((
                    <VictoryStack
                        key={`victoryStackGroup-${chart.id}`}
                        name={'blacked'}
                    >
                        {localSet}
                    </VictoryStack>
                ));
            } else {
                chartComponents.push(...localSet);
            }
        });

        return { chartComponents, legendComponents, dataSetLength };
    }

    static getComponent(config, chartIndex, xScale, data, color, onClick) {
        return (
            <VictoryBar
                key={`bar-${chartIndex}`}
                name={'blacked'}
                labels={
                    (() => {
                        if (xScale === 'time' && config.tipTimeFormat) {
                            return (d) => {
                                return `${config.x}:${timeFormat(config.tipTimeFormat)(new Date(d.x))}\n` +
                                    `${config.charts[chartIndex].y}:${Number(d.y).toFixed(2)}`;
                            };
                        } else {
                            return (d) => {
                                if (isNaN(d.x)) {
                                    return `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${Number(d.y).toFixed(2)}`;
                                } else {
                                    return `${config.x}:${Number(d.x).toFixed(2)}\n` +
                                        `${config.charts[chartIndex].y}:${Number(d.y).toFixed(2)}`;
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
                        flyoutStyle={{ fill: '#000', fillOpacity: '0.8', strokeWidth: 0 }}
                        style={{ fill: '#b0b0b0' }}
                    />
                }
                data={data}
                color={color}
                events={[
                    {
                        target: 'data',
                        eventHandlers: {
                            onClick: () => {
                                return [
                                    {
                                        target: 'data',
                                        mutation: onClick,
                                    },
                                ];
                            },
                        },
                    },
                ]}
                animate={config.animate ? { onEnter: { duration: 100 } } : null}
            />
        );
    }

    render() {
        const { config, height, width } = this.props;
        const { chartArray, dataSets, xScale, ignoreArray } = this.state;

        let { chartComponents, legendComponents, dataSetLength } =
            BarChart.getBarChartComponent(chartArray, dataSets, config, this.handleMouseEvent, xScale, ignoreArray);

        const barWidth =
                ((BarChart.isHorizontal(config) ?
                    (height - 80) : (width - 280)) / (dataSetLength * chartComponents.length)) - 1;

        chartComponents = [
            <VictoryGroup
                name={'blacked'}
                key={'victoryMainGroup'}
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
                yDomain={this.props.yDomain}
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
