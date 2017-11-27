/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
// TODO: update documentation on chart configurations
import React from 'react';
import {
    VictoryAxis,
    VictoryChart,
    VictoryContainer,
    VictoryGroup,
    VictoryLabel,
    VictoryLegend,
    VictoryStack,
    VictoryVoronoiContainer,
} from 'victory';
import PropTypes from 'prop-types';
import { formatPrefix, timeFormat } from 'd3';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { getDefaultColorScale } from './helper';
import VizGError from '../VizGError';
import { generateLineOrAreaChartComponent, generateBarChartComponent } from './ComponentGenerator.jsx';
import ChartSkeleton from './core/ChartSkeleton.jsx';

const LEGEND_DISABLED_COLOR = '#d3d3d3';

/**
 * React component required to render Bar, Line and Area Charts.
 */
export default class BasicCharts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataBuffer: [],
            height: props.config.height || props.height,
            width: props.config.width || props.width,
            dataSets: {},
            chartArray: [],
            initialized: false,
            xScale: 'linear',
            orientation: 'bottom',
            xDomain: [null, null],
            ignoreArray: [],
            seriesXMaxVal: null,
            seriesXMinVal: null,
        };

        this.handleAndSortData = this.handleAndSortData.bind(this);
        this._handleMouseEvent = this._handleMouseEvent.bind(this);

        this.xRange = [];
        this.chartConfig = null;
        this.ClassContext = 'BasicChart';
    }

    componentDidMount() {
        this.chartConfig = this.props.config;
        this.handleAndSortData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.chartConfig) !== JSON.stringify(nextProps.config)) {
            this.chartConfig = nextProps.config;
            this.state.chartArray = [];
            this.state.dataSets = [];
            this.state.initialized = false;
        }

        this.handleAndSortData(nextProps);
    }

    componentWillUnmount() {
        this.setState({});
    }

    _handleMouseEvent(evt) {
        const { onClick } = this.props;
        return onClick && onClick(evt);
    }

    /**
     * Handles the sorting of data and populating the dataset.
     * @param {Object} props - Props object to be processed.
     */
    handleAndSortData(props) {
        const { config, metadata, data } = props;
        const { dataSets, chartArray } = this.state;
        let { initialized, xScale, orientation, xDomain, seriesXMaxVal, seriesXMinVal } = this.state;
        const xIndex = metadata.names.indexOf(config.x);
        let hasMaxLength = false;

        switch (metadata.types[xIndex].toLowerCase()) {
            case 'linear':
                xScale = 'linear';
                break;
            case 'time':
                xScale = 'time';
                break;
            case 'ordinal':
                xScale = 'ordinal';
                break;
            default:
                throw new VizGError(this.ClassContext, 'Unsupported data type on xAxis');
        }

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

                dataSets[dataSetName].push({ x: datum[xIndex], y: datum[yIndex] });
                if (dataSets[dataSetName].length > config.maxLength) {
                    hasMaxLength = true;
                    dataSets[dataSetName].shift();
                }

                const max = Math.max.apply(null, dataSets[dataSetName].map(d => d.x));
                const min = Math.min.apply(null, dataSets[dataSetName].map(d => d.x));

                if (xScale === 'linear') {
                    if (xScale === 'linear' && xDomain[0] !== null) {
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
                }

                if (xScale === 'time') {
                    if (xScale === 'time' && xDomain[0] !== null) {
                        if (min > xDomain[0]) {
                            xDomain[0] = new Date(min);
                            this.xRange[0] = new Date(min);
                        }

                        if (max > xDomain[1]) {
                            xDomain[1] = new Date(max);
                            this.xRange[1] = new Date(max);
                        }
                    } else {
                        xDomain = [new Date(min), new Date(max)];
                        this.xRange = [new Date(min), new Date(max)];
                    }
                }

                if (seriesXMaxVal === null) {
                    seriesXMaxVal = max;
                    seriesXMinVal = min;
                } else {
                    if (seriesXMaxVal < max) {
                        seriesXMaxVal = max;
                    }
                    if (seriesXMinVal < min) {
                        seriesXMinVal = min;
                    }
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
                    } else {
                        chartArray[chartIndex].dataSetNames[dataSetName] =
                            chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    }

                    chartArray[chartIndex]
                        .dataSetNames[dataSetName] = chart.fill || chartArray[chartIndex].dataSetNames[dataSetName];
                }

                return null;
            });

            if (hasMaxLength && xScale === 'linear') {
                Object.keys(dataSets).map((dataSetName) => {
                    dataSets[dataSetName].map((d, k) => {
                        if (d.x < seriesXMinVal) {
                            dataSets[dataSetName].splice(k, 1);
                        }
                        return null;
                    });
                    return null;
                });
            }
            return null;
        });
        initialized = true;
        this.setState({ dataSets, chartArray, initialized, xScale, orientation, xDomain });
    }

    render() {
        const { config } = this.props;
        const { height, width, chartArray, dataSets, xScale, ignoreArray } = this.state;
        let chartComponents = [];
        const legendItems = [];
        let horizontal = false;
        const lineCharts = [];
        let areaCharts = [];
        let barcharts = [];

        chartArray.map((chart, chartIndex) => {
            let addChart = false;
            switch (chart.type) {
                case 'line':
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({
                            name: dataSetName,
                            symbol: { fill: chart.dataSetNames[dataSetName] },
                            chartIndex,
                        });

                        addChart = ignoreArray
                            .filter(d => (d.name === dataSetName)).length > 0;

                        if (!addChart) {
                            lineCharts.push((
                                <VictoryGroup
                                    key={`chart-${chart.id}-${chart.type}-${dataSetName}`}
                                    data={dataSets[dataSetName]}
                                    color={chart.dataSetNames[dataSetName]}
                                >
                                    {generateLineOrAreaChartComponent(config, chartIndex, this._handleMouseEvent)}
                                </VictoryGroup>
                            ));
                        }

                        return null;
                    });
                    break;
                case 'area': {
                    const areaLocal = [];

                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({
                            name: dataSetName,
                            symbol: { fill: chart.dataSetNames[dataSetName] },
                            chartIndex,
                        });

                        addChart = ignoreArray
                            .filter(d => (d.name === dataSetName)).length > 0;

                        if (!addChart) {
                            areaLocal.push((
                                <VictoryGroup
                                    key={`chart-${chart.id}-${chart.type}-${dataSetName}`}
                                    data={dataSets[dataSetName]}
                                    color={chart.dataSetNames[dataSetName]}

                                >
                                    {generateLineOrAreaChartComponent(config, chartIndex, this._handleMouseEvent)}
                                </VictoryGroup>
                            ));
                        }
                        return null;
                    });

                    if (chart.mode === 'stacked') {
                        areaCharts.push((
                            <VictoryStack>
                                {areaLocal}
                            </VictoryStack>
                        ));
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
                            symbol: { fill: chart.dataSetNames[dataSetName] },
                            chartIndex,
                        });
                        addChart = ignoreArray
                            .filter(d => (d.name === dataSetName)).length > 0;
                        if (!addChart) {
                            localBar.push((
                                generateBarChartComponent(config, chartIndex,
                                    dataSets[dataSetName], chart.dataSetNames[dataSetName])
                            ));
                        }

                        return null;
                    });

                    if (chart.mode === 'stacked') {
                        barcharts.push((
                            <VictoryStack>
                                {localBar}
                            </VictoryStack>
                        ));
                    } else {
                        barcharts = barcharts.concat(localBar);
                    }

                    break;
                }
                default:
                    throw new VizGError(this.ClassContext, 'Error in rendering unknown chart type');
            }

            return null;
        });

        if (areaCharts.length > 0) chartComponents = chartComponents.concat(areaCharts);
        if (lineCharts.length > 0) chartComponents = chartComponents.concat(lineCharts);
        if (barcharts.length > 0) {
            const barWidth =
                ((horizontal ?
                    height : width) / (config.maxLength * (barcharts.length > 1 ? barcharts.length : 2))) - 3;

            chartComponents.push((
                <VictoryGroup
                    horizontal={horizontal}
                    offset={barWidth}
                    style={{ data: { width: barWidth } }}
                >
                    {barcharts}
                </VictoryGroup>
            ));
        }

        return (
            <div style={{ overflow: 'hidden', zIndex: 99999 }}>
                <div
                    style={{
                        width: !config.legendOrientation ? '80%' :
                            (() => {
                                if (config.legendOrientation === 'left' || config.legendOrientation === 'right') {
                                    return '80%';
                                } else return '100%';
                            })(),
                        display: !config.legendOrientation ? 'inline' :
                            (() => {
                                if (config.legendOrientation === 'left' || config.legendOrientation === 'right') {
                                    return 'inline';
                                } else return null;
                            })(),
                        float: !config.legendOrientation ? 'left' : (() => {
                            if (config.legendOrientation === 'left') return 'right';
                            else if (config.legendOrientation === 'right') return 'left';
                            else return null;
                        })(),
                    }}
                >
                    {
                        config.legendOrientation && config.legendOrientation === 'top' ?
                            this.generateLegendVisualization(config, legendItems, ignoreArray) : null
                    }
                    <ChartSkeleton
                        width={width}
                        height={height}
                        config={config}
                        xScale={xScale}
                        yDomain={this.props.yDomain}
                        xDomain={this.state.xDomain}
                    >
                        {chartComponents}
                    </ChartSkeleton>
                </div>
                {
                    ['bottom', 'left', 'right'].indexOf(config.legendOrientation) > -1 || !config.legendOrientation ?
                        this.generateLegendVisualization(config, legendItems, ignoreArray) : null
                }
                {config.brush ?
                    <div style={{ width: '80%', height: 40, display: 'inline', float: 'left', right: 10 }} >
                        <div style={{ width: '10%', display: 'inline', float: 'left', left: 20 }} >
                            <button
                                onClick={() => {
                                    this.setState({ xDomain: this.xRange });
                                }}
                            >
                                Reset
                            </button>
                        </div>
                        <div
                            style={{ width: '90%', display: 'inline', float: 'right' }}
                        >
                            <Range
                                max={xScale === 'time' ? this.xRange[1].getDate() : this.xRange[1]}
                                min={xScale === 'time' ? this.xRange[0].getDate() : this.xRange[0]}
                                defaultValue={xScale === 'time' ?
                                    [this.xRange[0].getDate(), this.xRange[1].getDate()] :
                                    [this.xRange[0], this.xRange[1]]
                                }
                                value={xScale === 'time' ?
                                    [this.state.xDomain[0].getDate(), this.state.xDomain[1].getDate()] :
                                    this.state.xDomain}
                                onChange={(d) => {
                                    this.setState({
                                        xDomain: d,
                                    });
                                }}
                            />
                        </div>
                    </div> : null
                }
            </div >

        );
    }

    /**
     * Generate a Legend component to be used in the Charts.
     * @param config Chart configuration.
     * @param legendItems Items in the legend.
     * @param ignoreArray legend items that are ignored in rendering.
     */
    generateLegendVisualization(config, legendItems, ignoreArray) {
        return (
            <div
                style={{
                    width: !config.legendOrientation ? '15%' :
                        (() => {
                            if (config.legendOrientation === 'left' || config.legendOrientation === 'right') {
                                return '20%';
                            } else return '100%';
                        })(),
                    display: !config.legendOrientation ? 'inline' :
                        (() => {
                            if (config.legendOrientation === 'left' || config.legendOrientation === 'right') {
                                return 'inline';
                            } else return null;
                        })(),
                    float: !config.legendOrientation ? 'right' : (() => {
                        if (config.legendOrientation === 'left') return 'left';
                        else if (config.legendOrientation === 'right') return 'right';
                        else return null;
                    })(),
                }}
            >
                <VictoryLegend
                    containerComponent={<VictoryContainer responsive />}
                    centerTitle
                    height={(() => {
                        if (!config.legendOrientation) return this.state.height;
                        else if (config.legendOrientation === 'left' || config.legendOrientation === 'right') {
                            return this.state.height;
                        } else return 100;
                    })()}
                    width={(() => {
                        if (!config.legendOrientation) return 200;
                        else if (config.legendOrientation === 'left' || config.legendOrientation === 'right') return 200;
                        else return this.state.width;
                    })()}
                    orientation={
                        !config.legendOrientation ?
                            'vertical' :
                            (() => {
                                if (config.legendOrientation === 'left' || config.legendOrientation === 'right') {
                                    return 'vertical';
                                } else {
                                    return 'horizontal';
                                }
                            })()
                    }
                    title="Legend"
                    style={{
                        title: { fontSize: 25, fill: config.style ? config.style.legendTitleColor : null },
                        labels: { fontSize: 20, fill: config.style ? config.style.legendTextColor : null },
                    }}
                    data={legendItems.length > 0 ? legendItems : [{
                        name: 'undefined',
                        symbol: { fill: '#333' },
                    }]}
                    itemsPerRow={config.legendOrientation === 'top' || config.legendOrientation === 'bottom' ? 5 : 4}
                    events={[
                        {
                            target: 'data',
                            eventHandlers: {
                                onClick: config.interactiveLegend ? () => { // TODO: update doc with the attribute
                                    return [
                                        {
                                            target: 'data',
                                            mutation: (props) => {
                                                const ignoreIndex = ignoreArray
                                                    .map(d => d.name)
                                                    .indexOf(props.datum.name);
                                                if (ignoreIndex > -1) {
                                                    ignoreArray.splice(ignoreIndex, 1);
                                                } else {
                                                    ignoreArray.push({ name: props.datum.name });
                                                }
                                                this.setState({
                                                    ignoreArray,
                                                });
                                                const fill = props.style ? props.style.fill : null;
                                                return fill === LEGEND_DISABLED_COLOR ?
                                                    null :
                                                    { style: { fill: LEGEND_DISABLED_COLOR } };
                                            },
                                        },
                                    ];
                                } : null,
                            },
                        },
                    ]}
                />
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
        x: PropTypes.string,
        charts: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            y: PropTypes.string.isRequired,
            fill: PropTypes.string,
            color: PropTypes.string,
            colorScale: PropTypes.arrayOf(PropTypes.string),
            colorDomain: PropTypes.arrayOf(PropTypes.string),
            mode: PropTypes.string,
        })),
        tickLabelColor: PropTypes.string,
        legendTitleColor: PropTypes.string,
        legendTextColor: PropTypes.string,
        axisColor: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
        maxLength: PropTypes.number,
    }).isRequired,
};
