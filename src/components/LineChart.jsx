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
import { VictoryLine, VictoryTooltip, VictoryScatter } from 'victory';
import BaseChart from './BaseChart';
import ChartContainer from './ChartContainer';
import { timeFormat } from 'd3';
import BarChart from './BarChart';
import LegendComponent from './LegendComponent';

const DEFAULT_MARK_RADIUS = 4;

/**
 * Class to handle the visualization of line charts.
 */
export default class LineChart extends BaseChart {
    constructor(props) {
        super(props);
        this.handleMouseEvent = this.handleMouseEvent.bind(this);
        this.handleLegendInteraction = this.handleLegendInteraction.bind(this);
    }

    static getLineChartComponent(chartArray, xScale, dataSets, config, onClick, ignoreArray) {
        const chartComponents = [];
        const legendComponents = [];

        chartArray.forEach((chart, chartIndex) => {
            _.keys(chart.dataSetNames).forEach((dsName) => {
                legendComponents.push({
                    name: dsName,
                    symbol: { fill: _.indexOf(ignoreArray, dsName) > -1 ? '#d3d3d3' : chart.dataSetNames[dsName] },
                    chartIndex,
                });
                if (_.indexOf(ignoreArray, dsName) === -1) {
                    chartComponents.push(...LineChart
                        .getComponent(config, chartIndex, xScale, dataSets[dsName], chart.dataSetNames[dsName], onClick));
                }
            });
        });

        return { chartComponents, legendComponents };
    }

    static getComponent(config, chartIndex, xScale, data, color, onClick) {
        return [
                (<VictoryLine
                    key={`lineChart-${chartIndex}`}
                    style={{
                        data: {
                            strokeWidth: config.charts[chartIndex].style ?
                                config.charts[chartIndex].style.strokeWidth || null : null,
                            stroke: color,
                        },
                    }}
                    animate={config.animate ? { onEnter: { duration: 100 } } : null}
                    data={data}
                    name={'blacked'}
                />),
                (<VictoryScatter
                    key={`lineScatter-${chartIndex}`}
                    style={{
                        data: {
                            fill: color,
                        },
                    }}
                    data={data}
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
                            pointerLength={4}
                            cornerRadius={2}
                            flyoutStyle={{ fill: '#000', fillOpacity: '0.8', strokeWidth: 0 }}
                            style={{ fill: '#b0b0b0' }}
                        />
                    }
                    size={(
                        config.charts[chartIndex].style ?
                            config.charts[chartIndex].style.markRadius || DEFAULT_MARK_RADIUS : DEFAULT_MARK_RADIUS
                    )}
                    events={[{
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
                    }]}
                />),
        ];
    }

    render() {
        const { config, height, width } = this.props;
        const { chartArray, dataSets, xScale, ignoreArray } = this.state;

        const { chartComponents, legendComponents } =
            LineChart.getLineChartComponent(chartArray, xScale, dataSets, config, this.handleMouseEvent, ignoreArray);

        return (
            <ChartContainer
                width={width}
                height={height}
                xScale={xScale}
                config={config}
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
