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

import React from 'react';
import { ChartWrapper } from './ChartWrapper.jsx';
import './css/Table.css';
import VizG from '../../src/VizG.jsx';

export default class ScatterChartConfigSample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scatterPlot: [
                [1, 4, 3.5, 79.91, 0.8, 0.03, 'piston'],
                [2, 3, 3.5, 79.65, 1.3, 0.06, 'rotary']],
            timer: 0
        };

        this.interval_id = null;

        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'weight', 'EngineType'],
            types: ['linear', 'linear', 'linear', 'linear', 'ordinal']
        };

        this.scatterPlotConfig = {
            type: 'scatter',
            charts: [
                {
                    type: 'scatter',
                    x: 'rpm',
                    y: 'torque',
                    color: 'horsepower',
                    size: 'weight',
                    maxLength: 30,
                    colorScale: ['#1f77b4', '#ebff3b']

                }],
            width: 800,
            height: 450
        };
    }

    componentDidMount() {
        this.interval_id = setInterval(() => {
            this.setState({
                scatterPlot: [[this.state.timer, Math.random() * 100, Math.random() * 10, Math.random() * 100, 'piston'], [this.state.timer, Math.random() * 100, Math.random() * 10, Math.random() * 100, 'rotary']],
                timer: this.state.timer + 1
            });

        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
    }

    render() {
        return (
            <div>
                <center><h1>Scatter Config Samples</h1></center>
                <ChartWrapper title="Group MultiLine Chart Sample" chart="line" media={true} actionBar={false}>
                    <VizG config={this.scatterPlotConfig} metadata={this.metadata} data={this.state.scatterPlot} />
                    <br />
                    <div>
                        <pre>
                            {'{\n' +
                                '        type: "scatter",\n' +
                                '        charts : [\n' +
                                '            {type: "scatter",\n' +
                                '             x : "rpm",  \n' +
                                '             y : "torque",\n' +
                                '             color: "horsepower", \n' +
                                '             size : "weight", \n' +
                                '             maxLength: 30}], \n' +
                                '             \n' +
                                '        width: 400,\n' +
                                '        height: 200\n' +
                                '}'}
                        </pre>
                    </div>
                </ChartWrapper>
                <ChartWrapper title="Sample Data Set" chart="line">
                    <div>
                        <pre>
                            {
                                'metadata = {\n' +
                                '\tnames: [\'rpm\', \'torque\', \'horsepower\', \'EngineType\'],\n' +
                                '\ttypes: [\'linear\', \'linear\', \'linear\', \'ordinal\']\n' +
                                '};\n' +
                                '\ndata = [[1, 10, 2, 12, \'piston\'], [1, 20, 4, 34, \'rotary\']];'
                            }
                        </pre>
                    </div>
                </ChartWrapper>
                <ChartWrapper title="API" chart="line">
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
                                        <td>type</td>
                                        <td>string</td>
                                        <td>type of plot</td>
                                    </tr>
                                    <tr>
                                        <td>charts</td>
                                        <td>array(Object)</td>
                                        <td>Charts to be plotted</td>
                                    </tr>
                                    <tr>
                                        <td>maxLength</td>
                                        <td>int</td>
                                        <td>Maximum length of the chart data table</td>
                                    </tr>
                                    <tr>
                                        <td>height</td>
                                        <td>int</td>
                                        <td>Height of the chart in pixels</td>
                                    </tr>
                                </tbody>

                            </table>
                            <br />
                            <p>Chart Object Properties</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Property</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                    </tr>

                                    <tr>
                                        <td>x</td>
                                        <td>string</td>
                                        <td>attribute name of the x axis</td>
                                    </tr>
                                    <tr>
                                        <td>y</td>
                                        <td>string</td>
                                        <td>attribute name of the y axis</td>
                                    </tr>
                                    <tr>
                                        <td>size</td>
                                        <td>int</td>
                                        <td>Name of the size attribute of the Mark</td>
                                    </tr>
                                    <tr>
                                        <td>color</td>
                                        <td>string</td>
                                        <td>attribute name for color categorization</td>
                                    </tr>

                                    <tr>
                                        <td>colorScale</td>
                                        <td>string | Array(string)</td>
                                        <td>color set to use in the charts for predefined colors check <a
                                            href="https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#categorical-colors">d3-documentation</a></td>
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
