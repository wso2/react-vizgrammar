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
import PropTypes from 'prop-types';
import _ from 'lodash';
import MapGenerator from './components/MapChart';
import TableCharts from './components/TableChart';
import NumberCharts from './components/NumberChart';
import InlineCharts from './components/InlineChart';
import VizGError from './VizGError';
import LineChart from './components/LineChart';
import AreaChart from './components/AreaChart';
import BarChart from './components/BarChart';
import ComposedChart from './components/ComposedChart';
import ArcCharts from './components/ArcCharts';
import ScatterPlot from './components/ScatterPlot';

class VizG extends Component {
    /**
     * Function will render a chart based on the given chart.
     * @param {String} chartType Chart type of the chart.
     * @param {Object} config Chart configuration provided by the user
     * @param {Array} data Data provided by the user
     * @param {Object} metadata Metadata related to the data provided
     * @param {Function} onClick OnClick function provided by the user
     * @param {Boolean} manual indicates if the user handle data manually
     * @param {Function} onFetchData function to be executed when fetching data(only for table charts with
     * server-side pagination)
     * @param {Number} pages Total number of pages(only for table charts)
     * @private
     */
    _getChartComponent(chartType, config, data, metadata, onClick, manual, onFetchData, pages) {
        if (chartType === 'spark-line' || chartType === 'spark-area' || chartType === 'spark-bar') chartType = 'inline';

        const component = {
            line: LineChart,
            area: AreaChart,
            bar: BarChart,
            composed: ComposedChart,
            arc: ArcCharts,
            scatter: ScatterPlot,
            table: TableCharts,
            number: NumberCharts,
            inline: InlineCharts,
            map: MapGenerator,
        };

        if (!component[chartType]) throw new VizGError('VizG', 'Invalid chart type defined in the configuration.');

        const ChartComponent = component[chartType];

        return (
            <ChartComponent
                config={config}
                metadata={metadata}
                data={data}
                onClick={onClick}
                yDomain={this.props.yDomain}
                append={config.append}
                theme={this.props.theme}
                width={this.props.width}
                height={this.props.height}

                // table chart specific props
                manual={manual} // to let the component know all the sorting and handling of data will be done by the user
                onFetchData={onFetchData} // function to be executed when fetching data (only when serverside pagination enabled)
                pages={pages} // Total number of pages that will be there in the table(only when serverside pagination enabled)
            />
        );
    }

    /**
     * Check if the chart contains configuration of a mixed chart.
     * @param config
     * @returns {string}
     * @private
     */
    _isComposed(config) {
        const chartType = config.charts[0].type;
        if ((chartType === 'line' || chartType === 'area' || chartType === 'bar') && config.charts.length > 1) {
            const areaChart = _.find(config.charts, { type: 'area' });
            const barChart = _.find(config.charts, { type: 'bar' });
            const lineChart = _.find(config.charts, { type: 'line' });

            if ((!areaChart && !barChart) || (!lineChart && !areaChart) || (!barChart && !lineChart)) {
                return chartType;
            } else {
                return 'composed';
            }
        } else {
            return chartType;
        }
    }

    render() {
        const { config, data, metadata, onClick, manual, onFetchData, pages } = this.props;
        return (
            <div style={{ height: '100%', width: '100%' }}>
                {
                    !config || !metadata ?
                        null :
                        this._getChartComponent(this._isComposed(config), config, data, metadata, onClick, manual,
                            onFetchData, pages)
                }
            </div>
        );
    }
}

VizG.defaultProps = {
    append: true,
    theme: 'light',
    width: 800,
    height: 450,
    manual: false,
    pages: -1,
};

VizG.propTypes = {
    config: PropTypes.object.isRequired,
    data: PropTypes.array,
    metadata: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    append: PropTypes.bool,
    theme: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    manual: PropTypes.bool,
    onFetchData: PropTypes.func,
    pages: PropTypes.number,
};

export default VizG;
