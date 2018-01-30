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
import PropTypes from 'prop-types';
import VizGError from '../VizGError';
import { getDefaultColorScale } from './helper';

const LEGEND_DISABLED_COLOR = '#d3d3d3';

/**
 * Base Chart that contain most common methods that requires for the charts.
 */
export default class BaseChart extends React.Component {
    static getXScale(type) {
        if (type.toLowerCase() === 'linear' || type.toLowerCase() === 'ordinal') return 'linear';
        else return 'time';
    }

    static trimDataSet(dataSets, maxLength) {
        _.keys(_.pickBy(dataSets, obj => obj.length > maxLength)).forEach((key) => {
            const lengthDiff = dataSets[key].length - maxLength;
            dataSets[key].splice(0, lengthDiff);
        });

        return dataSets;
    }

    static generateChartArray(charts) {
        return charts.map((chart, chartIndex) => {
            return {
                type: chart.type,
                dataSetNames: {},
                mode: chart.mode,
                orientation: chart.orientation || 'bottom',
                color: Object.prototype.hasOwnProperty.call(chart, 'color'),
                colorCategoryName: chart.color || '',
                colorScale: Array.isArray(chart.colorScale) ? chart.colorScale : getDefaultColorScale(),
                colorDomain: chart.colorDomain || [],
                colorIndex: chartIndex,
                id: chartIndex,
                y: chart.y,
                x: chart.x,
                size: chart.size,
            };
        });
    }

    constructor() {
        super();
        this.state = {
            chartArray: [],
            dataSets: {},
            xScale: 'linear',
            ignoreArray: [],
            isOrdinal: false,
        };

        this.chartConfig = undefined;

        this.sortDataBasedOnConfig = this.sortDataBasedOnConfig.bind(this);
    }

    componentDidMount() {
        this.sortDataBasedOnConfig(this.props);
    }

    componentWillReceiveProps(nextProps) {
        const { config } = nextProps;

        if (!this.chartConfig || !(_.isEqual(config, this.chartConfig)) || !this.props.append) {
            this.state.chartArray = [];
            this.state.dataSets = {};
            this.chartConfig = config;
        }

        this.sortDataBasedOnConfig(nextProps);
    }

    handleMouseEvent(evt) {
        const { onClick } = this.props;
        return onClick && onClick(evt);
    }

    handleLegendInteraction(props) {
        const { ignoreArray } = this.state;

        const ignoreIndex = _.indexOf(ignoreArray, props.datum.name);
        if (ignoreIndex < 0) {
            ignoreArray.push(props.datum.name);
        } else {
            ignoreArray.splice(ignoreIndex, 1);
        }

        this.state.ignoreArray = ignoreArray;

        this.forceUpdate();
    }

    sortDataBasedOnConfig(props) {
        const { config, metadata, data } = props;
        let { chartArray, dataSets, xScale, isOrdinal } = this.state;
        if (chartArray.length === 0) chartArray = BaseChart.generateChartArray(config.charts); // generate chart array from the config.
        const xIndex = metadata.names.indexOf(config.x);
        if (_.keys(dataSets).length === 0) {
            if (!isOrdinal) isOrdinal = metadata.types[xIndex].toLowerCase() === 'ordinal';
            xScale = BaseChart.getXScale(metadata.types[xIndex]);
        }
        if (xScale !== BaseChart.getXScale(metadata.types[xIndex])) {
            throw VizGError('BasicChart', "Provided metadata doesn't match the previous metadata.");
        }

        let dataSet = {};

        chartArray.forEach((chart) => {
            const yIndex = metadata.names.indexOf(chart.y);
            const colorIndex = metadata.names.indexOf(chart.colorCategoryName);

            if (xIndex < 0 || yIndex < 0) {
                throw new VizGError('BasicChart', 'Axis name not found in metadata');
            }

            if (chart.color) {
                if (colorIndex < 0) {
                    throw new VizGError('BasicChart', 'Color category not found in metadata.');
                }
                dataSet = _.groupBy(data.map(
                    datum => ({
                        x: datum[xIndex],
                        y: datum[yIndex],
                        color: datum[colorIndex],
                        yName: metadata.names[yIndex] })), d => d.color);

                _.difference(_.keys(dataSet), _.keys(chart.dataSetNames)).forEach((key) => {
                    const colorDomIn = _.indexOf(chart.colorDomain, key);
                    if (chart.colorIndex >= chart.colorScale.length) {
                        chart.colorIndex = 0;
                    }
                    if (colorDomIn < 0) {
                        chart.dataSetNames[key] = chart.colorScale[chart.colorIndex++];
                    } else if (colorDomIn > chart.colorScale.length) {
                        chart.dataSetNames[key] = chart.colorScale[0];
                    } else {
                        chart.dataSetNames[key] = chart.colorScale[colorDomIn];
                    }
                });
            } else {
                dataSet[chart.y] = data.map(datum => ({ x: datum[xIndex], y: datum[yIndex], yName: chart.y }));
                chart.dataSetNames[chart.y] = config.charts[chart.id].fill || chart.colorScale[chart.colorIndex];
            }
        });

        this.setState((prevState) => {
            prevState.chartArray.push(...(_.differenceWith(chartArray, prevState.chartArray, _.isEqual)));
            _.mergeWith(prevState.dataSets, dataSet, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            });
            if (config.maxLength) BaseChart.trimDataSet(prevState.dataSets, config.maxLength);
            prevState.isOrdinal = isOrdinal;
            return prevState;
        });
    }

    render() {
        return (
            <div />
        );
    }
}

BaseChart.defaultProps = {
    width: 800,
    height: 400,
    onClick: null,
    yDomain: null,
    append: true,
};

BaseChart.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onClick: PropTypes.func,
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
    yDomain: PropTypes.arrayOf(PropTypes.number),
    append: PropTypes.bool,
};
