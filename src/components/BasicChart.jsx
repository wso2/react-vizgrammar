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


import React from 'react';
import {
    VictoryArea,
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryContainer,
    VictoryGroup,
    VictoryLabel,
    VictoryLegend,
    VictoryLine,
    VictoryPortal,
    VictoryScatter,
    VictoryStack,
    VictoryTheme,
    VictoryTooltip,
    VictoryVoronoiContainer,
} from 'victory';
import PropTypes from 'prop-types';
import {formatPrefix, timeFormat} from 'd3';
import {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import {getDefaultColorScale} from './helper';


export default class BasicCharts extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

            dataBuffer: [],
            height: props.height || props.config.height || 450,
            width: props.width || props.config.width || 800,
            dataSets: {},
            chartArray: [],
            initialized: false,
            xScale: 'linear',
            orientation: 'bottom',
            xDomain: [null, null],
            ignoreArray: [],


        };

        this.handleAndSortData = this.handleAndSortData.bind(this);
        this._handleMouseEvent = this._handleMouseEvent.bind(this);


        this.xRange = [];
        this.chartConfig = null;
    }

    componentDidMount() {
        this.chartConfig = this.props.config;
        this.handleAndSortData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.chartConfig) !== JSON.stringify(nextProps.config)) {
            console.info('not similar');
            this.chartConfig = nextProps.config;
            this.setState({
                chartArray: [],
                dataSets: {},
                initialized: false,

            });

            console.info(this.state.chartArray);
        }
    }

    componentWillUnmount() {
        this.setState({});
    }


    /* *************************[Start] Event Handlers*************************** */

    _handleMouseEvent(evt) {
        const {onClick} = this.props;

        return onClick && onClick(evt);
    }

    /* *************************[END] Event Handlers*************************** */

    /**
     * Handles the sorting of data and populating the dataset
     * @param props
     */
    handleAndSortData(props) {
        const {config, metadata, data} = props;
        let {dataSets, chartArray, initialized, xScale, orientation, xDomain} = this.state;
        const xIndex = metadata.names.indexOf(config.x);
        xScale = metadata.types[xIndex] === 'time' ? 'time' : xScale;
        config.charts.map((chart, chartIndex) => {
            orientation = orientation === 'left' ? orientation : (chart.orientation || 'bottom');

            const yIndex = metadata.names.indexOf(chart.y);
            if (!initialized) {
                chartArray.push({
                    type: chart.type,
                    dataSetNames: {},
                    mode: chart.mode,
                    orientation: chart.orientation,
                    colorScale: Array.isArray(chart.colorScale) ? chart.colorScale :
                        getDefaultColorScale(),
                    colorIndex: 0,
                    id: chartArray.length,
                });
            }


            data.map((datum) => {
                let dataSetName = metadata.names[yIndex];
                if (chart.color) {
                    const colorIndex = metadata.names.indexOf(chart.color);
                    dataSetName = colorIndex > -1 ? datum[colorIndex] : dataSetName;
                }

                dataSets[dataSetName] = dataSets[dataSetName] || [];

                if (xScale !== 'time') {
                    dataSets[dataSetName].push({x: datum[xIndex], y: datum[yIndex]});
                } else {
                    dataSets[dataSetName].push({x: new Date(datum[xIndex]), y: datum[yIndex]});
                }


                if (dataSets[dataSetName].length > config.maxLength) {
                    dataSets[dataSetName].shift();
                }


                const max = Math.max.apply(null, dataSets[dataSetName].map(d => d.x));
                const min = Math.min.apply(null, dataSets[dataSetName].map(d => d.x));

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

                if (!Object.prototype.hasOwnProperty.call(chartArray[chartIndex].dataSetNames, dataSetName)) {
                    if (chartArray[chartIndex].colorIndex >= chartArray[chartIndex].colorScale.length) {
                        chartArray[chartIndex].colorIndex = 0;
                    }

                    if (chart.colorDomain) {
                        const colorIn = chart.colorDomain.indexOf(dataSetName);

                        if (colorIn >= 0) {
                            if (colorIn < chartArray[chartIndex].colorScale.length) {
                                chartArray[chartIndex]
                                    .dataSetNames[dataSetName] = chartArray[chartIndex].colorScale[colorIn];
                            } else {
                                chartArray[chartIndex]
                                    .dataSetNames[dataSetName] = chartArray[chartIndex]
                                    .colorScale[chartArray[chartIndex].colorIndex++];
                            }
                        } else {
                            chartArray[chartIndex]
                                .dataSetNames[dataSetName] = chartArray[chartIndex]
                                .colorScale[chartArray[chartIndex].colorIndex++];
                        }


                        // chartArray[chartIndex].dataSetNames[dataSetName] = colorIn >= 0 ?
                        //     (colorIn < chartArray[chartIndex].colorScale.length ?
                        //         chartArray[chartIndex].colorScale[colorIn] :
                        //         chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++]) :
                        //     chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    } else {
                        chartArray[chartIndex].dataSetNames[dataSetName] =
                            chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    }

                    chartArray[chartIndex]
                        .dataSetNames[dataSetName] = chart.fill || chartArray[chartIndex].dataSetNames[dataSetName];
                }

                return null;
            });


            return null;
        });


        initialized = true;

        // this.setState({ dataSets, chartArray, initialized, xScale, orientation, xDomain });
        this.state.dataSets = dataSets;
        this.state.chartArray = chartArray;
        this.state.initialized = initialized;
        this.state.xScale = xScale;
        this.state.orientation = orientation;
        this.state.xDomain = xDomain;
    }


    render() {
        this.handleAndSortData(this.props);

        const {config} = this.props;
        const {height, width, chartArray, dataSets, xScale, ignoreArray} = this.state;
        let chartComponents = [];
        const legendItems = [];
        let horizontal = false;
        const lineCharts = [];
        let areaCharts = [];
        let barcharts = [];

        chartArray.map((chart, chartIndex) => {
            switch (chart.type) {
                case 'line':
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({
                            name: dataSetName,
                            symbol: {fill: chart.dataSetNames[dataSetName]},
                            chartIndex,
                        });


                        lineCharts.push(
                            <VictoryGroup
                                key={`chart-${chart.id}-${chart.type}-${dataSetName}`}
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                            >
                                <VictoryLine/>
                                <VictoryPortal>
                                    <VictoryScatter
                                        labels={
                                            d => `${config.x}:${Number(d.x).toFixed(2)}\n
                                            ${config.charts[chartIndex].y}:${Number(d.y).toFixed(2)}`
                                        }
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation='bottom'
                                            />
                                        }
                                        size={(d, a) => {
                                            return a ? 20 : 6;
                                        }}
                                        events={[{
                                            target: 'data',
                                            eventHandlers: {
                                                onClick: () => {
                                                    return [
                                                        {
                                                            target: 'data',
                                                            mutation: this._handleMouseEvent,
                                                        },
                                                    ];
                                                },
                                            },
                                        }]}

                                    />
                                </VictoryPortal>
                            </VictoryGroup>
                        );

                        return null;
                    });
                    break;
                case 'area': {
                    const areaLocal = [];
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({
                            name: dataSetName,
                            symbol: {fill: chart.dataSetNames[dataSetName]},
                            chartIndex,
                        });

                        areaLocal.push(
                            <VictoryGroup
                                key={`chart-${chart.id}-${chart.type}-${dataSetName}`}
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                                style={{data: {fillOpacity: 0.5}}}
                            >
                                <VictoryArea/>
                                <VictoryPortal>
                                    <VictoryScatter
                                        labels={d => `${config.x}:${Number(d.x).toFixed(2)}\n
                                                      ${config.charts[chartIndex].y}:${Number(d.y).toFixed(2)}`}
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation='bottom'
                                            />
                                        }
                                        size={(d, a) => {
                                            return a ? 20 : 6;
                                        }}
                                        events={[{
                                            target: 'data',
                                            eventHandlers: {
                                                onClick: () => {
                                                    return [
                                                        {
                                                            target: 'data',
                                                            mutation: this._handleMouseEvent,
                                                        },
                                                    ];
                                                },
                                            },
                                        }]}
                                    />
                                </VictoryPortal>
                            </VictoryGroup>
                        );


                        return null;
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
                    const localBar = [];

                    horizontal = horizontal || chart.orientation === 'left';

                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({
                            name: dataSetName,
                            symbol: {fill: chart.dataSetNames[dataSetName]},
                            chartIndex,
                        });
                        localBar.push(
                            <VictoryBar
                                labels={d => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                labelComponent={
                                    <VictoryTooltip
                                        orientation='bottom'
                                    />
                                }
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                                events={[{
                                    target: 'data',
                                    eventHandlers: {
                                        onClick: () => {
                                            return [
                                                {
                                                    target: 'data',
                                                    mutation: this._handleMouseEvent,
                                                },
                                            ];
                                        },
                                    },
                                }]}
                            />
                        );

                        return null;
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
                default:
                    console.error('Error in rendering unknown chart type');
            }


            return null;
        });


        if (areaCharts.length > 0) chartComponents = chartComponents.concat(areaCharts);
        if (lineCharts.length > 0) chartComponents = chartComponents.concat(lineCharts);
        if (barcharts.length > 0) {
            const barWidth =
                ((horizontal ?
                    height : width) / (config.maxLength * (barcharts.length > 1 ? barcharts.length : 2))) - 3;

            chartComponents.push(
                <VictoryGroup
                    horizontal={horizontal}
                    offset={barWidth}
                    style={{data: {width: barWidth}}}
                >
                    {barcharts}
                </VictoryGroup>
            );
        }

        // console.info('xscale :',xScale);
        return (
            <div style={{overflow: 'hidden', zIndex: 99999}}>
                <div style={{float: 'left', width: '80%', display: 'inline'}}>

                    <VictoryChart
                        width={width}
                        height={height}
                        theme={VictoryTheme.material}
                        container={<VictoryVoronoiContainer/>}

                        scale={{x: xScale === 'linear' ? 'linear' : 'time', y: 'linear'}}
                        domain={{
                            x: (!horizontal && this.state.xDomain[0]) ? this.state.xDomain : null,
                            y: config.yDomain,
                        }}
                    >
                        <VictoryAxis
                            crossAxis
                            style={{
                                axis: {stroke: config.axisColor},
                                axisLabel: {padding: 35, fill: config.axisLabelColor},
                                fill: config.axisLabelColor || '#455A64',
                            }}
                            label={config.xAxisLabel || config.x}
                            tickFormat={(() => {
                                if (xScale === 'linear') {
                                    return (text) => {
                                        if (text.toString().match(/[a-z]/i)) {
                                            if (text.length > 6) {
                                                return text.substring(0, 4) + '...';
                                            } else {
                                                return text;
                                            }
                                        } else {
                                            return formatPrefix(',.2', Number(text));
                                        }
                                    };
                                } else if (config.timeFormat) {
                                    return (date) => {
                                        return timeFormat(config.timeFormat)(new Date(date));
                                    };
                                } else {
                                    return null;
                                }
                            })()}
                            standalone={false}
                            tickLabelComponent={
                                <VictoryLabel
                                    angle={config.xAxisTickAngle || 0}
                                    style={{fill: config.tickLabelColor || 'black'}}
                                />
                            }


                        />
                        <VictoryAxis
                            dependentAxis
                            crossAxis
                            style={{
                                axisLabel: {padding: 35, fill: config.axisLabelColor},
                                fill: config.axisLabelColor || '#455A64',
                                axis: {stroke: config.axisColor},
                            }}
                            label={config.yAxisLabel || config.charts.length > 1 ? '' : config.charts[0].y}
                            standalone={false}
                            tickFormat={(text) => {
                                if (Number(text) < 999) {
                                    return text;
                                } else {
                                    return formatPrefix(',.2', Number(text));
                                }
                            }}
                            tickLabelComponent={
                                <VictoryLabel
                                    angle={config.yAxisTickAngle || 0}
                                    style={{fill: config.tickLabelColor || 'black'}}


                                />
                            }
                        />
                        {chartComponents}

                    </VictoryChart>


                </div>

                <div style={{width: '20%', display: 'inline', float: 'right'}}>
                    <VictoryLegend
                        containerComponent={<VictoryContainer responsive/>}
                        height={this.state.height}
                        width={300}
                        title="Legend"
                        style={{
                            title: {fontSize: 25, fill: config.legendTitleColor},
                            labels: {fontSize: 20, fill: config.legendTextColor},
                        }}
                        data={legendItems.length > 0 ? legendItems : [{
                            name: 'undefined',
                            symbol: {fill: '#333'},
                        }]}

                        events={[
                            {
                                target: 'data',
                                eventHandlers: {
                                    onClick: config.interactiveLegend ? () => { // TODO: update doc with the attribute
                                        return [
                                            {
                                                target: 'data',
                                                mutation: (props) => {
                                                    const fill = props.style && props.style.fill;
                                                    const ignoreIndex = ignoreArray.indexOf(props.index);

                                                    if (ignoreIndex > -1) {
                                                        ignoreArray.splice(ignoreIndex, 1);
                                                    } else {
                                                        ignoreArray.push(props.index);
                                                    }

                                                    this.state.ignoreArray = ignoreArray;

                                                    return fill === 'grey' ?
                                                        {style: {fill: props.data[props.index].symbol.fill}} :
                                                        {style: {fill: 'grey'}};
                                                },
                                            }, {
                                                target: 'labels',
                                                mutation: (props) => {
                                                    const fill = props.style && props.style.fill;
                                                    return fill === 'grey' ? null : {style: {fill: 'grey'}};
                                                },
                                            },
                                        ];
                                    } : null,
                                },
                            },
                        ]}

                    />
                </div>
                {config.brush ?
                    <div
                        style={{width: '80%', height: 40, display: 'inline', float: 'left', right: 10}}
                    >
                        <div
                            style={{width: '10%', display: 'inline', float: 'left', left: 20}}
                        >
                            <button onClick={() => {
                                this.setState({xDomain: this.xRange});
                            }}
                            >Reset
                            </button>
                        </div>
                        <div
                            style={{width: '90%', display: 'inline', float: 'right'}}
                        >
                            <Range
                                max={this.xRange[1] || 15}
                                min={this.xRange[0] || 10}
                                defaultValue={this.xRange}
                                value={this.state.xDomain}
                                allowCross={false}
                                onChange={(d) => {
                                    this.setState({
                                        xDomain: d,
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

BasicCharts.defaultProps = {
    width: 800,
    height: 450,
    onClick: null,
};

BasicCharts.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onClick: PropTypes.func,
    config: PropTypes.shape({
        x: PropTypes.string.isRequired,
        charts: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            y: PropTypes.string.isRequired,
            fill: PropTypes.string,
            color: PropTypes.string,
            colorScale: PropTypes.arrayOf(PropTypes.string),
            colorDomain: PropTypes.arrayOf(PropTypes.string)
        })),
    }).isRequired,
};
