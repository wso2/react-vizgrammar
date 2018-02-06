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
import VizG from '../../src/VizG';

export default class SimpleChart extends React.Component {

    constructor(props) {
        super(props);

        this.lineChartConfig = {
            x: 'rpm',
            charts: [{ type: 'line', y: 'torque' }],
            maxLength: 30,
            width: 800,
            height: 400,
            interactiveLegend: true,
            legend: true,
            tipTimeFormat: '%A',
        };

        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'EngineType'],
            types: ['linear', 'linear', 'ordinal', 'ordinal'],
        };

        this.staticDataSet = [
            [10, 11, 12, 'piston'],
            [11, 15, 12, 'rotary'],
            [12, 14, 12, 'piston'],
            [13, 24, 12, 'rotary'],
            [15, 11, 12, 'rotary'],
            [16, 15, 12, 'piston'],
            [17, 14, 12, 'rotary'],
        ];
    }


    render() {
        return (
            <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.staticDataSet} height={600}/>
        );
    }
}
