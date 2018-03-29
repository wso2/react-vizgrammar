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
import VizG from '../../src/VizG';
import ChartWrapper from '../ChartWrapper';
import { syntaxHighlight } from './util/SyntaxHighLight';
import Header from '../components/Header';

export default class PieChartSamples extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [[1, 10, 23, 'piston'], [1, 20, 34, 'rotary']],
            data2: [[1, 10, 23, 'piston']],
            timer: 0,
        };

        this.intervalId = null;

        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'EngineType', 'weight'],
            types: ['linear', 'linear', 'linear', 'ordinal', 'linear'],
        };

        this.donutChartConfig = {
            charts: [{ type: 'arc', x: 'torque', color: 'EngineType', mode: 'donut' }],
            legendOrientation: 'top',
        };

        this.pieChartConfig = {
            charts: [{ type: 'arc', x: 'torque', color: 'EngineType', mode: 'pie' }],
        };

        this.percentChartConfig = {
            charts: [{ type: 'arc', x: 'torque', color: 'EngineType', colorScale: ['steelblue', '#80ccff'] }],
            percentage: true,
            width: 300,
            height: 300,
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState({
                data: [
                    [this.state.timer, this.state.timer === 20 ? null : Math.random() * 100, 10, 'piston'],
                    [this.state.timer, Math.random() * 100, 10, 'rotary'],
                    [this.state.timer, this.state.timer === 20 ? null : Math.random() * 100, 10, 'piston2'],
                    [this.state.timer, Math.random() * 100, 10, 'rotary2'],
                ],
                data2: [

                    [this.state.timer, Math.random() * 100, Math.random() * 100, 'rotary'],
                ],
                timer: this.state.timer + 1,
            });
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        return (
            <div>
                <Header url={'/samples'} title={'Pie Chart Samples'} />
                <Grid container>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper title="Pie Chart Sample" chart="line" media actionBar={false}>
                            <div style={{ height: 450 }}>
                                <VizG config={this.pieChartConfig} metadata={this.metadata} data={this.state.data}
                                      theme={this.props.theme} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.pieChartConfig, undefined, 4)),
                                    }
                                    }
                                />
                            </div>

                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper title="Donut Chart Sample" chart="line" media actionBar={false}>
                            <div style={{ height: 450 }}>
                                <VizG config={this.donutChartConfig} metadata={this.metadata} data={this.state.data}
                                      theme={this.props.theme} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.donutChartConfig, undefined, 4)),
                                    }
                                    }
                                />
                            </div>

                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper title="Donut Chart Sample" chart="line" media actionBar={false}>
                            <div style={{ height: 450 }}>
                                <VizG config={this.percentChartConfig} metadata={this.metadata} data={this.state.data2}
                                      theme={this.props.theme} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.percentChartConfig, undefined, 4)),
                                    }
                                    }
                                />
                            </div>

                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper title="Sample Dataset and Chart Configuration" chart="line" media
                                      actionBar={false}>
                            <div className="json-structure" >
                                metadata :
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.metadata, undefined, 4)),
                                    }
                                    }
                                />
                                data:
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.state.data, undefined, 4)),
                                    }
                                    }
                                />
                            <br /><br />
                            <h3>JSON structure of Chart Configuration</h3>
                                <ul>
                                    <li>
                                        <strong>charts</strong> - Array of chart objects that needs to be visualized.
                                        <ul>
                                            <li><strong>type</strong> - type of the chart.(&qoute;arc&qoute;)</li>
                                            <li><strong>x</strong> - Data field that is used for the visualization</li>
                                            <li><strong>color</strong> - Data field by which color categorization should
                                                be done.</li>
                                            <li><strong>colorScale</strong> -  - Array of colors in hex form that will be
                                                over-riding the default color set</li>
                                            <li><strong>mode</strong> - Type of the chart ('donut' | 'pie')</li>
                                        </ul>
                                    </li>
                                    <li><strong>append</strong> - Append dataset to the current dataset</li>
                                    <li><strong>legendOrientation</strong> - Orientation of the legend relative to
                                        the chart.</li>
                                    <li><strong>percentage</strong> - Show the data field as a Gauge and the Value
                                        as a percent</li>
                                    <li>
                                        <strong>style</strong> - Object containing style attributes related to the chart
                                        <ul>
                                            <li><strong>legendTextColor</strong> - Text color of the legend component</li>
                                        </ul>
                                    </li>
                                    <li><strong>labelColor</strong> - Font color of percent chart</li>
                                </ul>
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12} />
                </Grid>
            </div>
        );
    }
}
