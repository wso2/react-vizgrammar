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
import {
    VictoryChart,
    VictoryZoomContainer,
    VictoryVoronoiContainer,
    VictoryContainer,
    VictoryAxis,
    VictoryLabel,
} from 'victory';
import { timeFormat } from 'd3';
import PropTypes from 'prop-types';
import _ from 'lodash';
import lightTheme from './resources/themes/victoryLightTheme';
import darkTheme from './resources/themes/victoryDarkTheme';

/**
 * React component that contains the logic for VictoryChart component.
 */
export default class ChartContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ counter: this.state.counter + 1 });
    }

    xAxisTickFormat(xScale, config, isOrdinal, arr) {
        if (xScale === 'time' && config.timeFormat) {
            return (date) => {
                return timeFormat(config.timeFormat)(new Date(date));
            };
        } else if (isOrdinal && config.charts[0].type === 'bar') {
            return (data) => {
                if ((data - Math.floor(data)) !== 0) {
                    return '';
                } else if (arr.length && (arr[Number(data) - 1].x).length > (config.axisTickLength ? config.axisTickLength : 13)) {
                    return (arr[Number(data) - 1].x).slice(0, config.axisTickLength ? config.axisTickLength :
                        10) + '...';
                } else {
                    return Number(data) <= arr.length ? arr[Number(data) - 1].x : data;
                }
            };
        } else if (xScale === 'linear') {
            return (data) => {
                if (data % 1 !== 0) {
                    return data;
                } else {
                    return Number(data).toFixed(0);
                }
            };
        } else {
            return null;
        }
    }

    render() {
        const { width, height, xScale,
            theme, config, horizontal, disableAxes, yDomain, isOrdinal, dataSets, barData, arcChart, xDomain } = this.props;
        const currentTheme = theme === 'light' ? lightTheme : darkTheme;
        let arr = [];
        let xDomainValue = xDomain;
        const xAxisPaddingBottom = config.style ? config.style.xAxisPaddingBottom || 50 : 50;
        let domainPadding = this.props.domainPadding || 0;

        if (isOrdinal && ((_.findIndex(config.charts, o => o.type === 'bar')) > -1)) {
            arr = dataSets[Object.keys(dataSets)[0]] || [];
        } else if ((_.findIndex(config.charts, o => o.type === 'bar')) > -1) {
            const found0 = _.findIndex(_.values(dataSets), (o) => {
                if (o.length > 0) {
                    return o[0].x === 0;
                } else {
                    return false;
                }
            });

            if (found0 > -1 && !horizontal) {
                let maxOne = null;
                _.keys(dataSets).forEach((key) => {
                    const max = _.maxBy(dataSets[key], o => o.x);
                    if (!maxOne) maxOne = max.x;
                    else if (maxOne < max) maxOne = max.x;
                });
                xDomainValue = [-1, maxOne];
            }
        }

        if (barData) {
            domainPadding = Math.floor(barData.fullBarWidth / 2) + 1;
            domainPadding = (domainPadding > 50) ? (domainPadding + 30) : domainPadding;
        }

        return (
            <VictoryChart
                width={width}
                height={height}
                domainPadding={{ x: horizontal ? 20 : domainPadding, y: horizontal ? domainPadding : 20 }}
                padding={
                    (() => {
                        if (config.legend === true || arcChart) {
                            if (!config.legendOrientation) {return {
                                left: 100, top: 30, bottom: xAxisPaddingBottom,
                                right: 180
                            };}
                            else if (config.legendOrientation === 'left') {
                                return { left: 300, top: 30, bottom: xAxisPaddingBottom, right: 30 };
                            } else if (config.legendOrientation === 'right') {
                                return { left: 100, top: 30, bottom: xAxisPaddingBottom, right: 180 };
                            } else if (config.legendOrientation === 'top') {
                                return { left: 100, top: 100, bottom: xAxisPaddingBottom, right: 30 };
                            } else if (config.legendOrientation === 'bottom') {
                                return { left: 100, top: 30, bottom: (100 + xAxisPaddingBottom), right: 30 };
                            } else return { left: 100, top: 30, bottom: xAxisPaddingBottom, right: 180 };
                        } else {
                            return { left: 100, top: 30, bottom: xAxisPaddingBottom, right: 30 };
                        }
                    })()
                }
                scale={horizontal ? { x: 'linear', y: xScale } : { x: xScale, y: 'linear' }}
                theme={currentTheme}
                containerComponent={
                    this.props.disableContainer ?
                        config.brush ?
                            <VictoryZoomContainer
                                dimension="x"
                            /> :
                            <VictoryContainer /> :
                        config.brush ?
                            <VictoryZoomContainer
                                dimension="x"
                            /> :
                            <VictoryVoronoiContainer
                                voronoiDimension="x"
                                voronoiBlacklist={['blacked']}
                            />
                }
                domain={{ x: config.xDomain ? config.xDomain : xDomainValue, y: config.yDomain ? config.yDomain : yDomain }}
                style={{ parent: { overflow: 'visible' } }}

            >
                {this.props.children}
                {
                    disableAxes ?
                        [
                            (<VictoryAxis
                                key="xAxis"
                                crossAxis
                                gridComponent={<g />}
                                tickComponent={<g />}
                                tickLabelComponent={<g />}
                                axisComponent={<g />}
                            />),
                            (<VictoryAxis
                                key="yAxis"
                                dependentAxis
                                crossAxis
                                gridComponent={<g />}
                                tickComponent={<g />}
                                tickLabelComponent={<g />}
                                axisComponent={<g />}
                            />),
                        ] :
                        [
                            (<VictoryAxis
                                key="xAxis"
                                crossAxis
                                theme={currentTheme}
                                style={{
                                    axis: {
                                        stroke: config.style ?
                                            config.style.axisColor :
                                            currentTheme.axis.style.axis.stroke,
                                    },
                                    axisLabel: {
                                        fill: config.style ?
                                            config.style.axisLabelColor :
                                            currentTheme.axis.style.axisLabel.fill,
                                    },
                                }}
                                gridComponent={config.disableVerticalGrid ?
                                    <g /> :
                                    <line
                                        style={{
                                            stroke: config.style ?
                                                config.style.gridColor || currentTheme.axis.style.grid.stroke :
                                                currentTheme.axis.style.grid.stroke,
                                            strokeOpacity: currentTheme.axis.style.grid.strokeOpacity,
                                            fill: currentTheme.axis.style.grid.fill,
                                        }}
                                    />
                                }
                                label={
                                    horizontal ?
                                        config.yAxisLabel || ((config.charts.length > 1 ? '' : config.charts[0].y)) :
                                        config.xAxisLabel || config.x
                                }
                                tickFormat={horizontal ? null : this.xAxisTickFormat(xScale, config, isOrdinal, arr)}
                                standalone={false}
                                tickLabelComponent={
                                    <VictoryLabel
                                        angle={config.style ? config.style.xAxisTickAngle || 0 : 0}
                                        theme={currentTheme}
                                        style={{
                                            fill: config.style ?
                                                config.style.tickLabelColor : currentTheme.axis.style.tickLabels.fill,
                                        }}
                                    />
                                }
                                tickCount={(isOrdinal && config.charts[0].type === 'bar') ? arr.length :
                                    config.xAxisTickCount}
                                counter={this.state.counter}
                            />),
                            (<VictoryAxis
                                key="yAxis"
                                dependentAxis
                                crossAxis
                                theme={currentTheme}
                                style={{
                                    axis: {
                                        stroke: config.style ?
                                            config.style.axisColor :
                                            currentTheme.axis.style.axis.stroke,
                                    },
                                    axisLabel: {
                                        fill: config.style ?
                                            config.style.axisLabelColor :
                                            currentTheme.axis.style.axisLabel.fill,
                                    },
                                }}
                                gridComponent={
                                    config.disableHorizontalGrid ?
                                        <g /> :
                                        <line
                                            style={{
                                                stroke: config.gridColor || currentTheme.axis.style.grid.stroke,
                                                strokeOpacity: currentTheme.axis.style.grid.strokeOpacity,
                                                fill: currentTheme.axis.style.grid.fill,
                                            }}
                                        />
                                }
                                label={
                                    horizontal ?
                                        config.xAxisLabel || config.x :
                                        config.yAxisLabel || (config.charts.length > 1 ? '' : config.charts[0].y)
                                }
                                standalone={false}
                                tickLabelComponent={
                                    <VictoryLabel
                                        angle={config.style ? config.style.yAxisTickAngle || 0 : 0}
                                        theme={currentTheme}
                                        style={{
                                            fill: config.style ?
                                                config.style.tickLabelColor :
                                                currentTheme.axis.style.tickLabels.fill,
                                        }}
                                    />
                                }
                                tickFormat={!horizontal ? null : this.xAxisTickFormat(xScale, config, isOrdinal, arr)}
                                axisLabelComponent={
                                    <VictoryLabel
                                        angle={0}
                                        x={config.legendOrientation === 'left' ? 300 : 100}
                                        y={25}
                                    />
                                }
                                tickCount={config.yAxisTickCount}
                            />),
                        ]
                }
            </VictoryChart>
        );
    }
}

ChartContainer.defaultProps = {
    yDomain: null,
    xDomain: null,
    children: [],
    disableContainer: false,
    horizontal: false,
    disableAxes: false,
    domainPadding: 0,
};

ChartContainer.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    xScale: PropTypes.string.isRequired,
    yDomain: PropTypes.arrayOf(PropTypes.number),
    xDomain: PropTypes.arrayOf(PropTypes.number),
    domainPadding: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])),
    config: PropTypes.shape({
        x: PropTypes.string,
        charts: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            y: PropTypes.string,
            fill: PropTypes.string,
            color: PropTypes.string,
            colorScale: PropTypes.arrayOf(PropTypes.string),
            colorDomain: PropTypes.arrayOf(PropTypes.string),
            mode: PropTypes.string,
        })),
        legendOrientation: PropTypes.string,
        style: {
            tickLabelColor: PropTypes.string,
            legendTitleColor: PropTypes.string,
            legendTextColor: PropTypes.string,
            axisColor: PropTypes.string,
            axisLabelColor: PropTypes.string,
            gridColor: PropTypes.string,
            xAxisTickAngle: PropTypes.number,
            yAxisTickAngle: PropTypes.number,
        },
        disableVerticalGrid: PropTypes.bool,
        disableHorizontalGrid: PropTypes.bool,
        xAxisLabel: PropTypes.string,
        yAxisLabel: PropTypes.string,
        yAxisTickCount: PropTypes.number,
        xAxisTickCount: PropTypes.number,
        axisTickLength: PropTypes.number,
        height: PropTypes.number,
        width: PropTypes.number,
        maxLength: PropTypes.number,
    }).isRequired,
    disableContainer: PropTypes.bool,
    horizontal: PropTypes.bool,
    disableAxes: PropTypes.bool,
};
