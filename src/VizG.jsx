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
import BasicCharts from './components/BasicChart.jsx';
import ScatterCharts from './components/ScatterChart.jsx';
import PieCharts from './components/PieChart.jsx';
import MapGenerator from './components/MapChart.jsx';
import TableCharts from './components/TableChart.jsx';
import NumberCharts from './components/NumberChart.jsx';
import InlineCharts from './components/InlineChart.jsx';
import ReactTable from './components/ReactTableTest.jsx';
class VizG extends Component {

    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            data: props.data,
            metadata: props.metadata,
            onClick:props.onClick
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

        let { config, data, metadata, onClick } = this.state;
        let chartType = config.charts[0].type;

        return (
            <div>
                {
                    chartType === 'line' || chartType === 'area' || chartType === 'bar' ?
                        <BasicCharts config={config} metadata={metadata} data={data} onClick={onClick} /> :
                        chartType === 'scatter' ? <ScatterCharts config={config} metadata={metadata} data={data} onClick={onClick} /> :
                            chartType === 'arc' ? <PieCharts config={config} metadata={metadata} data={data} onClick={onClick} /> :
                                chartType === 'map' ? <MapGenerator config={config} metadata={metadata} data={data} onClick={onClick} /> :
                                    chartType === 'table' ? <TableCharts metadata={metadata} config={config} data={data} onClick={onClick} /> :
                                        chartType === 'number' ? <NumberCharts metadata={metadata} config={config} data={data} onClick={onClick} /> :
                                            chartType === 'spark-line' || chartType === 'spark-bar' || chartType === 'spark-area' ?
                                                <InlineCharts metadata={metadata} config={config} data={data} /> : null
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