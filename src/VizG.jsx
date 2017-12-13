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
// TODO:Fix dynamically changing config for other charts
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasicCharts from './components/BasicChart';
import ScatterCharts from './components/ScatterChart';
import PieCharts from './components/PieChart';
import MapGenerator from './components/MapChart';
import TableCharts from './components/TableChart';
import NumberCharts from './components/NumberChart';
import InlineCharts from './components/InlineChart';
import VizGError from './VizGError';

class VizG extends Component {
    /**
     * Function will render a chart based on the given chart.
     * @param {String} chartType Chart type of the chart.
     * @param {Object} config Chart configuration provided by the user
     * @param {Array} data Data provided by the user
     * @param {Object} metadata Metadata related to the data provided
     * @param {Function} onClick OnClick function provided by the user
     * @private
     */
    _selectAndRenderChart(chartType, config, data, metadata, onClick) {
        switch (chartType) {
            case 'line':
            case 'area':
            case 'bar':
                return (
                    <BasicCharts
                        config={config}
                        metadata={metadata}
                        data={data}
                        onClick={onClick}
                        yDomain={this.props.yDomain}
                        append={this.props.append}
                        theme={this.props.theme}
                        width={this.props.width}
                        height={this.props.height}
                    />
                );
            case 'arc':
                return (
                    <PieCharts
                        config={config}
                        metadata={metadata}
                        data={data}
                        onClick={onClick}
                        append={this.props.append}
                        width={this.props.width}
                        height={this.props.height}
                    />
                );
            case 'scatter':
                return (
                    <ScatterCharts
                        config={config}
                        metadata={metadata}
                        data={data}
                        onClick={onClick}
                        append={this.props.append}
                        width={this.props.width}
                        height={this.props.height}
                    />
                );
            case 'map':
                return <MapGenerator config={config} metadata={metadata} data={data} onClick={onClick} />;
            case 'table':
                return (
                    <TableCharts
                        metadata={metadata}
                        config={config}
                        data={data}
                        onClick={onClick}
                    />
                );
            case 'number':
                return (
                    <NumberCharts
                        metadata={metadata}
                        config={config}
                        data={data}
                        onClick={onClick}
                        width={this.props.width}
                        height={this.props.height}
                    />
                );
            case 'spark-line':
            case 'spark-bar':
            case 'spark-area':
                return (
                    <InlineCharts
                        metadata={metadata}
                        config={config}
                        data={data}
                        yDomain={this.props.yDomain}
                        append={this.props.append}
                        width={this.props.width}
                        height={this.props.height}
                    />
                );
            default:
                throw new VizGError('VizG', 'Unknown chart ' + chartType + ' defined in the chart config.');
        }
    }

    render() {
        const { config, data, metadata, onClick } = this.props;
        return (
            <div style={{ height: '100%', width: '100%' }}>
                {
                    !config || !metadata ?
                        null :
                        this._selectAndRenderChart(config.charts[0].type, config, data, metadata, onClick)
                }
            </div>
        );
    }
}

VizG.defaultProps = {
    append: true,
    theme: 'materialLight',
    width: 800,
    height: 450,
};

VizG.propTypes = {
    config: PropTypes.object.isRequired,
    data: PropTypes.array,
    metadata: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    append: PropTypes.bool,
    theme: PropTypes.String,
    height: PropTypes.number,
    width: PropTypes.number,
};

export default VizG;
