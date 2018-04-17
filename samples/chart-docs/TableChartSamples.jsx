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
import { Grid } from 'material-ui';
import ChartWrapper from '../ChartWrapper';
import VizG from '../../src/VizG';
import { syntaxHighlight } from './util/SyntaxHighLight';
import Header from '../components/Header';

export default class TableChartSamples extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                [0, 10, 1, 'Piston'],
            ],
            timer: 1,
        };

        this.lineChartConfig = {
            charts: [
                {
                    type: 'table',
                    columns: [
                        {
                            name: 'EngineType',
                            title: 'EngineType',
                            colorBasedStyle: true,
                        },
                        {
                            name: 'torque',
                            title: 'Engine Torque',
                        },
                        {
                            name: 'rpm',
                            title: 'Engine RPM',
                            colorBasedStyle: true,
                            colorScale: ['red'],
                        },
                    ],
                    // columns: ['EngineType', 'torque', 'rpm'],
                    // columnTitles: ['Engine Type', 'Engine Torque', 'Engine RPM'],
                },
            ],
            maxLength: 7,
            colorBasedStyle: true,
        };

        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'EngineType'],
            types: ['linear', 'linear', 'ordinal', 'ordinal'],
        };

        this.intervalObj = null;
    }

    componentDidMount() {
        this.intervalObj = setInterval(() => {
            this.setState({
                data: [
                    [Math.round(Math.random() * 100), Math.round(Math.random() * 100), 1, 'Piston'],
                    [Math.round(Math.random() * 100), Math.round(Math.random() * 100), 1, 'rotary'],
                ],
                timer: this.state.timer + 1,
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalObj);
    }

    render() {
        return (
            <div>
                <Header url={'/samples'} title={'Table Chart Samples'} />
                <Grid container>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            title={'Table Chart Sample'}
                            chart={'table'}
                            actionBar={false}
                        >
                            <div style={{ height: 400 }}>
                                <div style={{ height: 40 }}>
                                    <VizG
                                        config={this.lineChartConfig}
                                        metadata={this.metadata}
                                        data={this.state.data}
                                        theme={this.props.theme}
                                    />
                                </div>
                            </div>
                            <div>
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.lineChartConfig, undefined, 4)),
                                    }
                                    }
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            title={'Sample Data set and JSON configuration structure.'}
                            chart={'table'}
                            actionBar={false}
                        >
                            <div className="json-structure" >
                                metadata:
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: syntaxHighlight(
                                            JSON.stringify(this.metadata, undefined, 4)),
                                    }}
                                />
                                data:
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: syntaxHighlight(
                                            JSON.stringify(this.state.data, undefined, 4)),
                                    }}
                                />
                                <br /><br />
                                <h3>Chart Configuration JSON structure</h3>
                                <ul>
                                    <li>
                                        <strong>charts</strong> - Array of Chart objects that should be visualized.
                                        <ul>
                                            <li>
                                                <strong>Chart Object</strong>
                                                <ul>
                                                    <li>
                                                        <strong>type</strong> - Type of the chart that need to be
                                                        visualized in this case &qoute;table&qoute;
                                                    </li>
                                                    <li>
                                                        <strong>columns</strong> - Array of objects containing
                                                        column data
                                                        <ul>
                                                            <li>
                                                                <strong>name</strong> - name provided in metadata
                                                            </li>
                                                            <li>
                                                                <strong>title</strong> - Title of the column
                                                            </li>
                                                            <li>
                                                                <strong>colorScale</strong> - Set of colors to be used
                                                                for the color categorization of the column
                                                            </li>
                                                            <li >
                                                                <strong>colorDomain</strong> - If a certain color category
                                                                needs to be highlighted in a specific color.
                                                            </li>
                                                            <li>
                                                                <strong>timeFormat</strong> - If data in the column are
                                                                &nbsp;timestamps the user can use this attribute to&nbsp;
                                                                format
                                                                the time stamp.refer&nbsp;
                                                                <a href={'https://github.com/d3/d3-time-format/blob/master/README.md#timeFormat'}>
                                                                    d3 documentation
                                                                </a> for more info
                                                            </li>
                                                            <li>
                                                                <strong>textColor</strong> - Color of the text in the&nbsp;
                                                                cell(* if the column use colorBased categorizing this option is recommended)
                                                            </li>
                                                            <li>
                                                                <strong>colorBasedStyle</strong> - color the column data according to the type
                                                                of data in the columns(boolean value)
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>maxLength</strong> - maximum number of records to be shown in the table
                                        at a time
                                    </li>
                                </ul>
                            </div>
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
