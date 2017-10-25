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




import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasicCharts from './ChartComponents/BasicCharts';
import ScatterCharts from './ChartComponents/ScatterCharts';
import PieCharts from './ChartComponents/PieCharts';
import MapGenerator from './ChartComponents/MapGenerator';
import TableCharts from './ChartComponents/TableCharts';
import NumberCharts from './ChartComponents/NumberCharts';
import SparkCharts from './ChartComponents/InlineChartsBasic';


class VizG extends Component {

    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            data: props.data,
            metadata: props.metadata,
        };
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        });
    }


    componentWillUnmount() {
        this.setState({});
    }


    render() {

        let { config, data, metadata } = this.state;
        let chartType = config.charts[0].type;

        return (
            <div>
                {
                    chartType === 'line' || chartType === 'area' || chartType === 'bar' ?
                        <BasicCharts config={config} metadata={metadata} data={data} /> :
                        chartType === 'scatter' ? <ScatterCharts config={config} metadata={metadata} data={data} /> :
                            chartType === 'arc' ? <PieCharts config={config} metadata={metadata} data={data} /> :
                                chartType === 'map' ? <MapGenerator config={config} metadata={metadata} data={data} /> :
                                    chartType === 'table' ? <TableCharts metadata={metadata} config={config} data={data} /> :
                                        chartType === 'number' ? <NumberCharts metadata={metadata} config={config} data={data} /> :
                                            chartType === 'spark-line' || chartType === 'spark-bar' || chartType === 'spark-area' ?
                                                <SparkCharts metadata={metadata} config={config} data={data} /> : null
                }
            </div>
        );
    }
}

VizG.propTypes = {
    config: PropTypes.object.isRequired,
    data: PropTypes.array,
    metadata: PropTypes.object.isRequired
};

export default VizG;