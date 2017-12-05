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
import { ChartWrapper } from './ChartWrapper.jsx';
import VizG from '../../src/VizG.jsx';

/**
 * This class will render a page that contains samples on how to use Table charts.
 */
class TableChartConfigSample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                [0, 10, 1, 'Piston'],
            ],
            timer: 1,
        };

        this.mapConfig = {
            charts: [
                {
                    type: 'table',
                    columns: ['EngineType', 'torque', 'rpm'],
                    columnTitles: ['Engine Type', 'Engine Torque', 'Engine RPM'],
                },
            ],
            maxLength: 7,
            colorBasedStyle: true,
        };

        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'EngineType'],
            types: ['linear', 'linear', 'ordinal', 'ordinal'],
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                data: [[Math.round(Math.random() * 100), Math.round(Math.random() * 100), 1, 'Piston'], [Math.round(Math.random() * 100), Math.round(Math.random() * 100), 1, 'rotary']],
                timer: this.state.timer + 1,
            });
        }, 1000);
    }

    render() {
        return (
            <div>
                <ChartWrapper title="Table Chart Sample" chart="line" media actionBar={false}>
                    <VizG config={this.mapConfig} metadata={this.metadata} data={this.state.data} />
                    <br />
                    <br />
                    <pre>
                        {
                            '{\n' +
                            '\tcharts : [\n\t{\n\t\ttype: \'table\',\n' +
                            '\t\tcolumns:[\'EngineType\',  \'torque\', \'rpm\'],\n' +
                            '\t\tcolumnTitles:[\'Engine Type\',  \'Engine Torque\', \'Engine RPM\'],\n' +
                            '\t}' +
                            '],\n' +
                            '\tmaxLength: 7,\n' +
                            '\twidth: 400,\n' +
                            '\theight: 200\n' +
                            '}'
                        }
                    </pre>
                </ChartWrapper>
                <ChartWrapper title="Sample Data Set" chart="line">
                    <div>
                        <pre>
                            {
                                'metadata = {\n' +
                                '\tnames: [\'rpm\', \'torque\', \'horsepower\', \'EngineType\'],\n' +
                                '\ttypes: [\'linear\', \'linear\', \'linear\', \'ordinal\']\n' +
                                '};\n' +
                                '\ndata = [[1, 10, 23, \'piston\'], [1, 20, 34, \'rotary\']];'
                            }
                        </pre>
                    </div>
                </ChartWrapper>
                <ChartWrapper title="Sample Data Set" chart="line">
                    <div>
                        <pre>
                            <p>Main Properties</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Property</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                    </tr>

                                    <tr>
                                        <td>charts</td>
                                        <td>array(Object)</td>
                                        <td>Charts to be plotted</td>
                                    </tr>
                                    <tr>
                                        <td>maxLength</td>
                                        <td>int</td>
                                        <td>Maximum length of the dataSet displayed</td>
                                    </tr>
                                    <tr>
                                        <td>height</td>
                                        <td>int</td>
                                        <td>Height of the chart in pixels</td>
                                    </tr>
                                </tbody>

                            </table>
                        </pre>
                    </div>
                </ChartWrapper>
            </div>
        );
    }
}

export default TableChartConfigSample;
