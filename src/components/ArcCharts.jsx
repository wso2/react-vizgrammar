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
import _ from 'lodash';
import { VictoryPie, VictoryTooltip, VictoryLabel } from 'victory';
import BaseChart from './BaseChart';
import VizGError from '../VizGError';
import ChartContainer from './ChartContainer';
import LegendComponent from './LegendComponent';

/**
 * Class to handle Visualization of Arc Charts.
 */
export default class ArcChart extends BaseChart {

    constructor(props) {
        super(props);
        this.handleMouseEvent = this.handleMouseEvent.bind(this);
        this.chartMode = 'pie';
        this.state = {
            chartInfo: [],
            pieChartData: [],
            random: 0,
        };
    }

    sortDataBasedOnConfig(props) {
        const { config, metadata, data } = props;
        let { chartInfo, pieChartData, random } = this.state;
        random++;
        // generate chart array from the config.
        if (chartInfo.length === 0) {
            chartInfo = BaseChart.generateChartArray(config.charts);
        }

        let dataSet = {};

        chartInfo.forEach((chart) => {
            this.chartMode = chart.mode || this.chartMode;
            const xIndex = _.indexOf(metadata.names, chart.x);
            if (xIndex > -1) {
                if (!config.percentage) {
                    const catIndex = _.indexOf(metadata.names, chart.colorCategoryName);

                    if (catIndex > -1) {
                        dataSet = _.groupBy(data.map(
                            datum => ({ x: datum[xIndex], color: datum[catIndex] })), d => d.color);
                        _.keys(dataSet).forEach((key) => {
                            const datIndex = _.findIndex(pieChartData, d => d.x === key);
                            if (datIndex > -1) {
                                pieChartData[datIndex].y += _.sumBy(dataSet[key], d => d.x);
                            } else {
                                if (chart.colorIndex >= chart.colorScale.length) {
                                    chart.colorIndex = 0;
                                }
                                let color = chart.colorScale[chart.colorIndex++];
                                if (chart.colorDomain.length > 0) {
                                    const colorDomIn = _.indexOf(chart.colorDomain, key);
                                    if (colorDomIn > -1 && colorDomIn < chart.colorScale.length) {
                                        color = chart.colorScale[colorDomIn];
                                    }
                                }
                                pieChartData.push({
                                    x: key,
                                    y: _.sumBy(dataSet[key], d => d.x),
                                    fill: color,
                                    symbol: { fill: color },
                                });
                            }
                        });
                    } else {
                        throw new VizGError('ArcChart',
                            'color category of the chart not found among the metadata provided');
                    }
                } else {
                    pieChartData = [
                        { y: data[data.length - 1][xIndex], fill: chart.colorScale[0] },
                        { y: (100 - data[data.length - 1][xIndex]), fill: chart.colorScale[1] },
                    ];
                }
            } else {
                throw new VizGError('ArcChart',
                    "'x' defined in the chart configuration not found among the metadata provided");
            }
        });

        this.setState({ chartInfo, pieChartData, random });
    }

    render() {
        const { config, theme, height, width } = this.props;
        const { pieChartData, random } = this.state;

        return (
            <ChartContainer
                height={height}
                width={width}
                config={config}
                xScale="linear"
                theme={theme}
                disableAxes
                disableContainer
                arcChart
            >
                <VictoryPie
                    height={height}
                    width={width}
                    randomVal={random}
                    data={pieChartData}
                    labelComponent={
                        config.percentage ?
                            <VictoryLabel text="" /> :
                            <VictoryTooltip
                                orientation='top'
                                pointerLength={4}
                                cornerRadius={2}
                                flyoutStyle={{ fill: '#000', fillOpacity: '0.8', strokeWidth: 0 }}
                                style={{ fill: '#e6e6e6' }}
                            />
                    }
                    innerRadius={
                        this.chartMode === 'donut' || config.percentage ?
                            (height > width ? width : height / 4) + (config.innerRadius || 0) : 0
                    }
                    labels={
                        config.percentage === true ?
                            '' :
                            d => `${d.x} : ${((d.y / (_.sumBy(pieChartData, o => o.y))) * 100).toFixed(2)}%`
                    }
                    style={{ labels: { fontSize: 6 }, data: { strokeWidth: 0 } }}
                    labelRadius={height / 3}
                    events={[{
                        target: 'data',
                        eventHandlers: {
                            onClick: () => {
                                return [{ target: 'data', mutation: this.handleMouseEvent }];
                            },
                        },
                    }]}
                    animate={config.animate ? { onEnter: { duration: 100 } } : null}
                />
                {
                    config.percentage ?
                        <VictoryLabel
                            textAnchor="middle"
                            x="45%"
                            y="50%"
                            text={`${Math.round(pieChartData.length > 0 ? pieChartData[0].y : 0)}%`}
                            style={{ fontSize: config.labelFontSize || 45, fill: config.labelColor || 'black' }}
                        /> :
                        <LegendComponent
                            height={height}
                            width={width}
                            legendItems={pieChartData.map(data => ({ name: data.x, symbol: data.symbol }))}
                            interaction={() => { }}
                            config={config}
                        />
                }
            </ChartContainer>
        );
    }
}
