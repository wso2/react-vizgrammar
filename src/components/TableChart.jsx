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

import React, { Component } from 'react';
import ReactTable from 'react-table';
import { scaleLinear, timeFormat } from 'd3';
import 'react-table/react-table.css';
import _ from 'lodash';
import './resources/css/tableChart.css';
import { getDefaultColorScale } from './helper';
import VizGError from '../VizGError';
import BaseChart from './BaseChart';

/**
 * Class to handle visualization of table charts.
 */
export default class TableChart extends BaseChart {
    constructor(props) {
        super(props);
        this.state = {
            dataSets: [],
            config: props.config,
            chartArray: [],
            initialized: false,
        };

        this.sortDataBasedOnConfig = this.sortDataBasedOnConfig.bind(this);
        this._getLinearColor = this._getLinearColor.bind(this);
    }

    componentDidMount() {
        if (this.props.config && this.props.metadata) {
            this.sortDataBasedOnConfig(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.config, this.state.config)) {
            this.state.config = nextProps.config;
            this.state.initialized = false;
            this.state.dataSets = [];
        }

        this.sortDataBasedOnConfig(nextProps);
    }

    sortDataBasedOnConfig(props) {
        let { config, metadata, data } = props;
        let { dataSets, chartArray, initialized } = this.state;

        data = data.map((d) => {
            const tmp = {};
            for (let i = 0; i < metadata.names.length; i++) {
                tmp[metadata.names[i]] = d[i];
            }
            return tmp;
        });

        dataSets = dataSets.concat(data);

        while (dataSets.length > config.maxLength) {
            dataSets.shift();
        }

        config.charts.forEach((chart) => {
            chart.columns.forEach((column, i) => {
                const colIndex = _.indexOf(metadata.names, column.name);

                if (colIndex === -1) {
                    throw new VizGError('TableChart', 'Unknown column name defined in the chart config.');
                }

                if (!initialized) {
                    chartArray.push({
                        name: column.name,
                        title: column.title || column.name,
                        colorBasedStyle: column.colorBasedStyle,
                        colorScale: column.colorBasedStyle === true ?
                            column.colorScale || getDefaultColorScale() : undefined,
                        colorDomain: column.colorDomain,
                        isTime: metadata.types[colIndex].toLowerCase() === 'time',
                        colorIndex: 0,
                        timeFormat: column.timeFormat,
                        textColor: column.textColor,
                    });
                }

                if (column.colorBasedStyle === true) {
                    if (metadata.types[colIndex].toLowerCase() === 'linear' ||
                        metadata.types[colIndex].toLowerCase() === 'time') {
                        const max = _.max(dataSets.map(datum => datum[metadata.names[colIndex]]));
                        const min = _.min(dataSets.map(datum => datum[metadata.names[colIndex]]));

                        if (!Object.prototype.hasOwnProperty.call(chartArray[i], 'range')) {
                            chartArray[i].range = [min, max];
                        } else if (!_.isEqual(chartArray[i].range, [min, max])) {
                            chartArray[i].range = [min, max];
                        }
                    } else {
                        if (!Object.prototype.hasOwnProperty.call(chartArray[i], 'colorMap')) {
                            chartArray[i].colorIndex = 0;
                            chartArray[i].colorMap = {};
                        }

                        _.map(dataSets, column.name).forEach((category) => {
                            if (!Object.prototype.hasOwnProperty.call(chartArray[i].colorMap, category)) {
                                if (chartArray[i].colorIndex >= chartArray[i].colorScale.length) {
                                    chartArray[i].colorIndex = 0;
                                }

                                if (column.colorDomain) {
                                    const domainIndex = _.indexOf(column.colorDomain, category);

                                    if (domainIndex >= 0 && domainIndex < chartArray[i].colorScale.length) {
                                        chartArray[i].colorMap[category] = chartArray[i].colorScale[domainIndex];
                                    } else {
                                        chartArray[i].colorMap[category] =
                                            chartArray[i].colorScale[chartArray[i].colorIndex++];
                                    }
                                } else {
                                    chartArray[i].colorMap[category] =
                                        chartArray[i].colorScale[chartArray[i].colorIndex++];
                                }
                            }
                        });
                    }
                }
            });
        });

        initialized = true;

        this.setState({ dataSets, chartArray, initialized });
    }

    _getLinearColor(color, range, value) {
        return scaleLinear().range(['#fff', color]).domain(range)(value);
    }

    render() {
        const { config } = this.props;
        const { dataSets, chartArray } = this.state;

        console.info(this.state);

        const tableConfig = chartArray.map((column) => {
            const columnConfig = {
                Header: column.title,
                accessor: column.name,
            };

            if (column.colorBasedStyle === true) {
                columnConfig.Cell = props => (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor:
                                column.range ?
                                    this._getLinearColor(
                                        column.colorScale[column.colorIndex], column.range, props.value) :
                                    column.colorMap[props.value],
                            margin: 0,
                            textAlign: 'center',
                        }}
                    >
                        <span
                            style={{
                                color: column.textColor || null,
                            }}
                        >
                            {
                                column.isTime && column.timeFormat ?
                                    timeFormat(column.timeFormat)(props.value) : props.value
                            }
                        </span>
                    </div>
                );
            } else {
                columnConfig.Cell = props => (
                    <div className={this.props.theme === 'light' ? 'rt-td cell-data' : 'darkTheme rt-td cell-data'}>
                        <span>
                            {
                                column.isTime && column.timeFormat ?
                                    timeFormat(column.timeFormat)(props.value) : props.value
                            }
                        </span>
                    </div>
                );
            }

            return columnConfig;
        });

        return (
            <div style={{ height: 40 }}>
                <ReactTable
                    data={dataSets}
                    columns={tableConfig}
                    showPagination={false}
                    minRows={config.maxLength}
                />
            </div>
        );
    }
}
