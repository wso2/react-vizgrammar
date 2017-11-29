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
    VictoryGroup,
    VictoryStack,
} from 'victory';
import PropTypes from 'prop-types';
import { getDefaultColorScale } from './helper';
import VizGError from '../VizGError';
import {
    getLineOrAreaComponent,
    getBarComponent,
    getLegendComponent,
    getBrushComponent,
} from './ComponentGenerator.jsx';
import ChartSkeleton from './ChartSkeleton.jsx';

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
        this._legendInteraction = this._legendInteraction.bind(this);
        this._brushOnChange = this._brushOnChange.bind(this);
        this._brushReset = this._brushReset.bind(this);

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
        const { dataSets } = this.state;
        let { initialized, chartArray, xScale, orientation, xDomain, seriesXMaxVal, seriesXMinVal } = this.state;
        if (!config.x) {
            throw new VizGError('BasicChart', "Independent axis 'x' is not defined in the Configuration JSON.");
        }
        const xIndex = metadata.names.indexOf(config.x);
        if (xIndex === -1) {
            throw new VizGError('BasicChart', `Defined independant axis ${config.x} is not found in metadata`);
        }
        let hasMaxLength = false;

        if (['linear', 'time', 'ordinal'].indexOf(metadata.types[xIndex].toLowerCase()) === -1) {
            throw new VizGError(this.ClassContext, 'Unsupported data type on xAxis');
        } else {
            xScale = metadata.types[xIndex].toLowerCase();
        }

        if (!initialized) {
            chartArray = this.generateChartArray(config.charts);
        }

        config.charts.map((chart, chartIndex) => {
            const yIndex = metadata.names.indexOf(chart.y);
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

                this.xRange = this.getXDomain(xDomain, [min, max]);
                this.state.xDomain = this.getXDomain(xDomain, [min, max]);
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

            if (hasMaxLength && (xScale === 'linear' || xScale === 'time')) {
                Object.keys(dataSets).map((dataSetName) => {
                    dataSets[dataSetName].map((d, k) => {
                        if (d.x < xDomain[0]) {
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

    /**
     * Define xDomain to be used when brushing data
     * @param domain array containing maximum and minimum of the current dataset
     */
    getXDomain(xDomain, domain) {
        if (xDomain[0] !== null) {
            if (domain[0] > xDomain[0]) {
                xDomain[0] = domain[0];
            }

            if (domain[1] > xDomain[1]) {
                xDomain[1] = domain[1];
            }
        } else {
            xDomain = [domain[0], domain[1]];
        }

        return xDomain;
    }

    /**
     * Generate the chart array that contains the information on visualization of the charts in config
     * @param config chart configuration provided
     * @private
     */
    generateChartArray(charts) {
        return charts.map((chart, chartIndex) => {
            return {
                type: chart.type,
                dataSetNames: {},
                mode: chart.mode,
                orientation: chart.orientation,
                colorScale: Array.isArray(chart.colorScale) ? chart.colorScale : getDefaultColorScale(),
                colorIndex: 0,
                id: chartIndex,
            };
        });
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
                                    {getLineOrAreaComponent(config, chartIndex, this._handleMouseEvent)}
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
                                    {getLineOrAreaComponent(config, chartIndex, this._handleMouseEvent)}
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
                                getBarComponent(config, chartIndex,
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
                            getLegendComponent(config, legendItems, ignoreArray, this._legendInteraction, height, width) : null
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
                        getLegendComponent(config, legendItems, ignoreArray, this._legendInteraction, height, width) :
                        null
                }
                {config.brush ?
                    getBrushComponent(xScale, this.xRange, this.state.xDomain, this._brushReset, this._brushOnChange) :
                    null
                }
            </div >

        );
    }

    /**
     * function to reset domain of the chart when zoomed in.
     * @param {Array} xDomain domain range of the x Axis.
     */
    _brushReset(xRange) {
        this.setState({ xDomain: xRange });
    }

    /**
     * Function to handle onChange in brush slider
     * @param {Array} xDomain New Domain of the x-axis
     */
    _brushOnChange(xDomain) {
        this.setState({ xDomain });
    }

    /**
     * Function used to disable a chart component when clicked on it's name in the legend.
     * @param {Object} props parameters recieved from the legend component
     */
    _legendInteraction(props) {
        const { ignoreArray } = this.state;
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
    }
}

BasicCharts.defaultProps = {
    width: 800,
    height: 450,
    onClick: null,
    yDomain: null,
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
    yDomain: PropTypes.arrayOf(PropTypes.number),
};
