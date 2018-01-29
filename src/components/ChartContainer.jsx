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
import { VictoryChart, VictoryZoomContainer, VictoryVoronoiContainer, VictoryContainer, VictoryAxis, VictoryLabel, createContainer } from 'victory';
import { timeFormat } from 'd3';
import PropTypes from 'prop-types';
import lightTheme from './resources/themes/victoryLightTheme';
import darkTheme from './resources/themes/victoryDarkTheme';

/**
 * React component that contains the logic for VictoryChart component.
 */
export default class ChartContainer extends React.Component {

    render() {
        const { width, height, xScale, theme, config, horizontal, disableAxes, yDomain, xDomain, dataSets } = this.props;
        const currentTheme = theme === 'materialLight' ? lightTheme : darkTheme;
        let arr = null;
        if (xScale === 'ordinal' && config.charts[0].type === 'bar') {
            arr = dataSets[Object.keys(dataSets)[0]];
        }

        return (
            <VictoryChart
                width={width}
                height={height}
                padding={
                    (() => {
                        if (config.legend === true) {
                            if (!config.legendOrientation) return { left: 100, top: 30, bottom: 50, right: 180 };
                            else if (config.legendOrientation === 'left') {
                                return { left: 300, top: 30, bottom: 50, right: 30 };
                            } else if (config.legendOrientation === 'right') {
                                return { left: 100, top: 30, bottom: 50, right: 180 };
                            } else if (config.legendOrientation === 'top') {
                                return { left: 100, top: 100, bottom: 50, right: 30 };
                            } else if (config.legendOrientation === 'bottom') {
                                return { left: 100, top: 30, bottom: 150, right: 30 };
                            } else return { left: 100, top: 30, bottom: 50, right: 180 };
                        } else {
                            return { left: 100, top: 30, bottom: 50, right: 30 };
                        }
                    })()
                }
                scale={{ x: xScale, y: 'linear' }}
                theme={currentTheme}
                containerComponent={
                    this.props.disableContainer ?
                        <VictoryContainer /> :
                        <VictoryVoronoiContainer
                            voronoiDimension="x"
                            voronoiBlacklist={['blacked']}
                        />
                }
            >
                {this.props.children}
                {
                    disableAxes ?
                    [
                            (<VictoryAxis
                                key={'xAxis'}
                                crossAxis
                                gridComponent={<g />}
                                tickComponent={<g />}
                                tickLabelComponent={<g />}
                                axisComponent={<g />}
                            />),
                            (<VictoryAxis
                                key={'yAxis'}
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
                                key={'xAxis'}
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
                                                config.style.gridColor || currentTheme.line.style.data.stroke :
                                                currentTheme.line.style.data.stroke,
                                            strokeOpacity: 0.1,
                                            fill: 'transparent',
                                        }}
                                    />
                                }
                                label={
                                    horizontal ?
                                    config.yAxisLabel || ((config.charts.length > 1 ? '' : config.charts[0].y)) :
                                    config.xAxisLabel || config.x
                                }
                                tickFormat={(() => {
                                    if (xScale === 'time' && config.timeFormat) {
                                        return (date) => {
                                            return timeFormat(config.timeFormat)(new Date(date));
                                        };
                                    } else if (xScale === 'ordinal' && config.charts[0].type === 'bar') {
                                        return (data) => {
                                            if ((data - Math.floor(data)) !== 0) {
                                                return '';
                                            } else {
                                                return arr[Number(data) - 1].x;
                                            }
                                        };
                                    } else {
                                        return null;
                                    }
                                })()}
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
                                tickCount={(xScale === 'ordinal' && config.charts[0].type === 'bar') ? arr.length :
                                    config.xAxisTickCount}
                            />),
                            (<VictoryAxis
                                key={'yAxis'}
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
                                                stroke: config.gridColor || currentTheme.line.style.data.stroke,
                                                strokeOpacity: 0.1,
                                                fill: 'transparent',
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
                                axisLabelComponent={
                                    <VictoryLabel
                                        angle={0}
                                        x={100}
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
    theme: 'materialLight',
    children: [],
    disableContainer: false,
    horizontal: false,
    disableAxes: false,
};

ChartContainer.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    xScale: PropTypes.string.isRequired,
    theme: PropTypes.string,
    yDomain: PropTypes.arrayOf(PropTypes.number),
    xDomain: PropTypes.arrayOf(PropTypes.number),
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
        height: PropTypes.number,
        width: PropTypes.number,
        maxLength: PropTypes.number,
    }).isRequired,
    disableContainer: PropTypes.bool,
    horizontal: PropTypes.bool,
};
