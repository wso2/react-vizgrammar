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
import Table, { TableCell, TableBody, TableHead, TableRow } from 'material-ui/Table';
import { Grid } from 'material-ui';
import ChartWrapper from './ChartWrapper';
import Header from './components/Header';
import VizG from '../src/VizG';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            index: 1,
            scatterPlot: [],
            mapData: [
                ['Afghanistan', 4.23],
                ['EGY', 1.23],
                ['Afghanistan', 2.23],
                ['United States', 10.23],
                ['Albania', 3.23],
                ['United Kingdom', 7],
                ['Australia', 5],
                ['Ireland', 1],
                ['RUS', 15],
            ],
        };
        this.intervalObject = null;
        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'EngineType', 'weight'],
            types: ['linear', 'linear', 'linear', 'ordinal', 'linear'],
        };

        this.mapMetadata = {
            names: ['Country', 'Inflation'],
            types: ['ordinal', 'linear'],
        };

        this.mapConfig = {
            x: 'Country',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'world' }],
            width: 400,
            height: 200,
        };

        this.lineChartConfig = {
            x: 'Country',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'world' }],
            width: 400,
            height: 200,
        };

        this.lineChartConfig = {
            x: 'rpm',
            charts: [{ y: 'torque', color: 'EngineType', type: 'line' }],
            legend: true,
            maxLength: 30,
        };
        this.areaChartConfig = {
            x: 'rpm',
            charts: [{ y: 'torque', color: 'EngineType', type: 'area' }],
            legend: true,
            maxLength: 30,
        };
        this.barChartConfig = {
            x: 'rpm',
            charts: [{ y: 'torque', color: 'EngineType', type: 'bar' }],
            legend: true,
            maxLength: 10,
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
                }],

            width: 800,
            height: 450,
        };

        this.numConfig = {
            x: 'torque',
            title: 'Torque of Engine',
            charts: [{ type: 'number' }],
            width: 400,
            height: 200,
        };

        this.pieChartConfig = {
            charts: [{ type: 'arc', x: 'torque', color: 'EngineType', mode: 'pie' }],
        };

        this.tableConfig = {
            charts: [
                {
                    type: 'table',
                    y: 'torque',
                    columns: [
                        {
                            name: 'EngineType',
                            title: 'Engine Type',
                        },
                        {
                            name: 'torque',
                            title: 'Engine Torque',
                        },
                        {
                            name: 'rpm',
                            title: 'Engine RPM',
                        },
                    ],
                },
            ],
            maxLength: 7,
            colorBasedStyle: true,
            width: 400,
            height: 200,
        };

        this.sampleDataset = [
            [10, 20, 30, 'test1'],
            [11, 89, 30, 'test2'],
            [12, -6, 30, 'test1'],
            [13, 15, 30, 'test2'],
            [14, 30, 30, 'test1'],
            [15, 20, 30, 'test2'],
            [16, 34, 30, 'test1'],
            [17, 90, 30, 'test2'],
            [18, 70, 30, 'test1'],
            [19, 60, 30, 'test2'],
            [20, 50, 30, 'test1'],
            [21, 0, 30, 'test2'],
            [22, 20, 30, 'test1'],
            [23, 20, 30, 'test2'],
            [24, 30, 30, 'test1'],
            [25, 40, 30, 'test2'],
            [26, 35, 30, 'test1'],
            [27, 45, 30, 'test2'],
            [28, 50, 30, 'test1'],
            [29, 60, 30, 'test2'],
            [30, 70, 30, 'test1'],
        ];

        this.sparkAreaChart = {
            x: 'rpm',
            charts: [
                { type: 'spark-area', y: 'torque', fill: '#47c5ff' },
            ],
            maxLength: 30,
            append: true,
        };
        this.sparkLineChart = {
            x: 'rpm',
            charts: [
                { type: 'spark-line', y: 'torque', fill: 'red' },
            ],
            maxLength: 30,
            append: true,
        };
        this.sparkBarChart = {
            x: 'rpm',
            charts: [
                { type: 'spark-bar', y: 'torque', fill: 'red' },
            ],
            maxLength: 30,
            append: true,
        };
    }

    componentDidMount() {
        this.intervalObject = setInterval(() => {
            this.setState({
                data: [
                    [this.state.index, Math.random() * 100, 10, 'piston'],
                    [this.state.index, Math.random() * 100, 10, 'rotary'],
                ],
                scatterPlot: [
                    [this.state.index, Math.random() * 100, Math.random(), 'rotary', Math.random()],
                    [this.state.index, Math.random() * 100, Math.random(), 'rotary', Math.random()],
                ],
                index: this.state.index + 1,
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalObject);
    }

    render() {
        return (
            <div style={{ padding: 10 }}>
                <Header url={'/'} title={'React-VizGrammar'} />
                <Grid container spacing={24}>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'line'}
                            title={'Line Charts'}
                            actionBar
                        >
                            <div style={{ height: 450 }}>
                                <VizG
                                    config={this.lineChartConfig}
                                    metadata={this.metadata}
                                    data={this.state.data}
                                    theme={this.props.theme}
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'area'}
                            title={'Area Charts'}
                            actionBar
                        >
                            <div style={{ height: 450 }}>
                                <VizG
                                    config={this.areaChartConfig}
                                    metadata={this.metadata}
                                    data={this.state.data}
                                    theme={this.props.theme}
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'bar'}
                            title={'Bar Charts'}
                            actionBar
                        >
                            <div style={{ height: 450 }}>
                                <VizG
                                    config={this.barChartConfig}
                                    metadata={this.metadata}
                                    data={this.state.data}
                                    theme={this.props.theme}
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'scatter'}
                            title={'Scatter Charts'}
                            actionBar
                        >
                            <div style={{ height: 450 }}>
                                <VizG
                                    config={this.scatterPlotConfig}
                                    metadata={this.metadata}
                                    data={this.state.scatterPlot}
                                    height={360}
                                    theme={this.props.theme}
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'map'}
                            title={'Map Charts'}
                            actionBar
                        >
                            <div style={{ height: 450 }}>
                                <VizG
                                    config={this.mapConfig}
                                    metadata={this.mapMetadata}
                                    data={this.state.mapData}
                                    theme={this.props.theme}
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'number'}
                            title={'Number Charts'}
                            actionBar
                        >
                            <div style={{ height: 450 }}>
                                <VizG
                                    config={this.numConfig}
                                    metadata={this.metadata}
                                    data={this.state.data}
                                    theme={this.props.theme}
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'pie'}
                            title={'Pie Charts'}
                            actionBar
                        >
                            <div style={{ height: 450 }}>
                                <VizG
                                    config={this.pieChartConfig}
                                    metadata={this.metadata}
                                    data={this.state.data}
                                    theme={this.props.theme}
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'table'}
                            title={'Table Charts'}
                            actionBar
                        >
                            <div style={{ height: 450 }}>
                                <div style={{ height: 40 }}>
                                    <VizG
                                        config={this.tableConfig}
                                        metadata={this.metadata}
                                        data={this.state.data}
                                        theme={this.props.theme}
                                    />
                                </div>
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            chart={'table'}
                            title={'Spark-Charts Samples'}
                            actionBar={false}
                        >
                            <div style={{ height: 200 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Chart Preview</TableCell>
                                            <TableCell>Chart Type</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div style={{ height: 20, width: 300 }}>
                                                    <VizG
                                                        config={this.sparkAreaChart}
                                                        metadata={this.metadata}
                                                        data={this.state.data}
                                                        theme={this.props.theme}
                                                        height={20}
                                                        width={300}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>spark-area Chart</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div style={{ height: 20, width: 300 }}>
                                                    <VizG
                                                        config={this.sparkLineChart}
                                                        metadata={this.metadata}
                                                        data={this.state.data}
                                                        theme={this.props.theme}
                                                        height={20}
                                                        width={300}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>spark-line chart</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
