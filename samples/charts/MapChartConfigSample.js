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
import MapGenerator from '../../src/components/MapChart.jsx';
import Logger from 'log';
import { Frame } from './Frame';

class MapChartConfigSample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                ['Afghanistan', 4.23],
                ['EGY', 1.23],
                ['Afghanistan', 2.23],
                ['United States', 10.23],
                ['Albania', 3.23],
                ['United Kingdom', 7],
                ['Australia', 5],
                ['Ireland', 1],
                ['RUS', 15]
            ],
            data2: [
                ['Alabama', 4.23],
                ['Michigan', 1.23],
                ['Georgia', 8.23],
                ['Texas', 3.23],
                ['Hawaii', 2.23]
            ],
            timer: 1
        };

        this.mapConfig = {
            x: 'Country',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'world', colorScale: ['#1958ff', '#1eff36'] }],
            width: 400,
            height: 200
        };

        this.europeConfig = {
            type: 'map',
            x: 'Country',
            renderer: 'canvas',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'europe', colorScale: ['#1958ff', '#1eff36'] }],
            width: 500,
            height: 300
        };

        this.usaConfig = {
            type: 'map',
            x: 'Country',
            renderer: 'canvas',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'usa', colorScale: ['#1958ff', '#1eff36'] }],
            width: 500,
            height: 300
        };

        this.metadata = {
            names: ['Country', 'Inflation'],
            types: ['ordinal', 'linear']
        };
    }

    render() {
        return (
            <div>
                <Frame title="World Map Sample" chart="line" media={true} actionBar={false}>
                    <MapGenerator config={this.mapConfig} metadata={this.metadata} data={this.state.data} onClick={(geo) => { Logger.info(geo); }} />
                    <pre>
                        {'{\n' +
                            '\tx : \'Country\',\n' +
                            '\tcharts : [{type: \'map\',  y : \'Inflation\',mapType:\'world\'}],\n' +
                            '\twidth: 400,\n' +
                            '\theight: 200\n' +
                            '}'}
                    </pre>
                </Frame>
                <Frame title="Europe Map Sample" chart="line" media={true} actionBar={false}>
                    <MapGenerator config={this.europeConfig} metadata={this.metadata} data={this.state.data} onClick={(geo) => { Logger.info(geo); }} />
                    <pre>
                        {'{\n' +
                            '\tx : \'Country\',\n' +
                            '\tcharts : [{type: \'map\',  y : \'Inflation\',mapType:\'europe\'}],\n' +
                            '\twidth: 400,\n' +
                            '\theight: 200\n' +
                            '}'}
                    </pre>
                </Frame>
                <Frame title="United States Map Sample" chart="line" media={true} actionBar={false}>
                    <MapGenerator config={this.usaConfig} metadata={this.metadata} data={this.state.data2} onClick={(geo) => { Logger.info(geo); }} />
                    <pre>
                        {'{\n' +
                            '\tx : \'County\',\n' +
                            '\tcharts : [{type: \'map\',  y : \'Inflation\',mapType:\'usa\'}],\n' +
                            '\twidth: 400,\n' +
                            '\theight: 200\n' +
                            '}'}
                    </pre>
                </Frame>
                <Frame title="Sample Data Set" chart="line" media={false} actionBar={false}>
                    {/*<MapGenerator config={this.usaConfig} metadata={this.metadata} data={this.state.data2}/>*/}
                    <pre>
                        {'data : [\n' +
                            '                [\'Afghanistan\',4.23],\n' +
                            '                [\'EGY\',1.23],\n' +
                            '                [\'Afghanistan\',2.23],\n' +
                            '                [\'United States\',10.23],\n' +
                            '                [\'Albania\',3.23],\n' +
                            '                [\'United Kingdom\',7],\n' +
                            '                [\'Australia\',5],\n' +
                            '                [\'Ireland\',1],\n' +
                            '                [\'RUS\',15]\n' +
                            '\n' +
                            '];'}
                        <br />
                        {
                            '\n\nmetadata = {\n' +
                            '        \'names\' : [\'Country\',\'Inflation\'],\n' +
                            '        \'types\' : [\'ordinal\',\'linear\']\n' +
                            '};'
                        }
                    </pre>
                </Frame>
                <Frame title="API" chart="line" media={false} actionBar={false}>
                    {/*<MapGenerator config={this.usaConfig} metadata={this.metadata} data={this.state.data2}/>*/}
                    <pre>
                        <p>Main Properties</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Value</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>x</td>
                                    <td>String</td>
                                    <td>cAttribute name for X-axis</td>
                                </tr>
                                <tr>
                                    <td>height</td>
                                    <td>px</td>
                                    <td>height of the chart</td>

                                </tr>

                                <tr>
                                    <td>charts</td>
                                    <td>object</td>
                                    <td>Collection of charts</td>

                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <p>Chart Properties</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Value</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>type</td>
                                    <td>String</td>
                                    <td>type of chart(map)</td>
                                </tr>
                                <tr>
                                    <td>y</td>
                                    <td>String</td>
                                    <td>Dependant Axis</td>
                                </tr>
                                <tr>
                                    <td>mapType</td>
                                    <td>string</td>
                                    <td>Type of the map (world || usa || europe)</td>
                                </tr>
                            </tbody>
                        </table>
                    </pre>
                </Frame>
            </div>
        );
    }
}

export default MapChartConfigSample;
