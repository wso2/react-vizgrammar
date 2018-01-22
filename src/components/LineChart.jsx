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

const DEFAULT_MARK_RADIUS = 4;

/**
 * Class to handle the visualization of line charts.
 */
export default class LineChart extends BaseChart {
    static getLineChartComponent(chartArray, dataSets, config){
        const chartComponents = [];
        const legendComponents = [];

        chartArray.forEach((chart, chartIndex) => {
            _.keys(chart.dataSetNames).forEach((dsName) => {
                legendComponents.push({
                    name: dsName,
                    symbol: { fill: chart.dataSetNames[dsName] },
                    chartIndex,
                });
                chartComponents.push(...[
                    (<VictoryLine
                        style={{
                            data: {
                                strokeWidth: config.charts[chartIndex].style ?
                                    config.charts[chartIndex].style.strokeWidth || null : null,
                                stroke: chart.dataSetNames[dsName],
                            },
                        }}
                        animate={config.animate ? { onEnter: { duration: 100 } } : null}
                        data={dataSets[dsName]}
                        name={'blacked'}
                    />),
                    (<VictoryScatter
                        style={{
                            data: {
                                fill: chart.dataSetNames[dsName],
                            },
                        }}
                        data={dataSets[dsName]}
                        labels={d => `${config.x}: ${d.x}\n${d.yName}: ${d.y}`}
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
                    />),
                ]);
            });
        });

        return { chartComponents, legendComponents };
    }

    render() {
        const { config, height, width } = this.props;
        const { chartArray, dataSets, xScale, ignoreArray } = this.state;

        const { chartComponents, legendComponents } = LineChart.getLineChartComponent(chartArray,dataSets,config);

        return (
            <ChartContainer width={width} height={height} xScale={xScale} config={config}>
                {chartComponents}
            </ChartContainer>
        );
    }
}
