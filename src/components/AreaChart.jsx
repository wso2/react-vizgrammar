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
import { VictoryArea, VictoryChart, VictoryVoronoiContainer, createContainer, VictoryStack, VictoryTooltip, VictoryScatter, VictoryGroup } from 'victory';
import PropTypes from 'prop-types';
import theme from './resources/themes/victoryDarkTheme';
import BaseChart from './BaseChart';
import ChartContainer from './ChartContainer';

const DEFAULT_MARK_RADIUS = 4;
const DEFAULT_AREA_FILL_OPACITY = 0.1;

/**
 * Class to handle visualization of Area Charts.
 */
export default class AreaChart extends BaseChart {

    static getAreaChartComponent(chartArray, dataSets, config) {
        const chartComponents = [];
        const legendComponents = [];

        chartArray.forEach((chart, chartIndex) => {
            const localChartComp = [];
            _.keys(chart.dataSetNames).forEach((dsName) => {
                legendComponents.push({
                    name: dsName,
                    symbol: { fill: chart.dataSetNames[dsName] },
                    chartIndex,
                });
                localChartComp.push((
                    <VictoryGroup
                        key={`area-group-${chart.id}`}
                        data={dataSets[dsName]}
                        color={chart.dataSetNames[dsName]}
                    >
                        <VictoryArea
                            style={{
                                data: {
                                    fillOpacity: config.charts[chartIndex].style ?
                                        config.charts[chartIndex].style.fillOpacity || DEFAULT_AREA_FILL_OPACITY :
                                        DEFAULT_AREA_FILL_OPACITY,
                                },
                            }}
                            animate={config.animate ? { onEnter: { duration: 100 } } : null}
                            name={'blacked'}

                        />
                        <VictoryScatter
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
                        />
                    </VictoryGroup>
                ));
            });

            if (chart.mode === 'stacked') {
                chartComponents.push((
                    <VictoryStack
                        key={`area-group-${chart.id}`}
                    >
                        {localChartComp}
                    </VictoryStack>
                ));
            } else {
                chartComponents.push(...localChartComp);
            }
        });
        return { chartComponents, legendComponents };
    }

    render() {
        const { config, height, width } = this.props;
        const { chartArray, dataSets, xScale, ignoreArray } = this.state;

        const { chartComponents, legendComponents } = AreaChart.getAreaChartComponent(chartArray, dataSets, config);

        return (
            <ChartContainer width={width} height={height} xScale={xScale} config={config}>
                {chartComponents}
            </ChartContainer>
        );
    }
}
