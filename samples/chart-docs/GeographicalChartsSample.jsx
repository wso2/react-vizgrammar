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

import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Grid, IconButton, Button } from 'material-ui';
import { Link } from 'react-router-dom';
import HomeIcon from 'material-ui-icons/ArrowBack';
import VizG from '../../src/VizG';
import ChartWrapper from '../ChartWrapper';
import { syntaxHighlight } from './util/SyntaxHighLight';
import GitHub from '../components/GitHub';

/**
 * This class will render a page that contains samples on how to use Geographical charts.
 */
class MapChartConfigSample extends Component {

    constructor(props) {
        super(props);

        this.data = [
            ['Afghanistan', 4.23],
            ['EGY', 1.23],
            ['Afghanistan', 2.23],
            ['United States', 10.23],
            ['Albania', 3.23],
            ['United Kingdom', 7],
            ['Australia', 5],
            ['Ireland', 1],
            ['RUS', 15],
        ];
        this.data2 = [
            ['Alabama', 4.23],
            ['Michigan', 1.23],
            ['Georgia', 8.23],
            ['Texas', 3.23],
            ['Hawaii', 2.23],
        ];

        this.lineChartConfig = {
            x: 'Country',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'world', colorScale: ['#1958ff', '#1eff36'] }],
        };

        this.europeConfig = {
            type: 'map',
            x: 'Country',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'europe', colorScale: ['#1958ff', '#1eff36'] }],
        };

        this.usaConfig = {
            type: 'map',
            x: 'Country',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'usa', colorScale: ['#1958ff', '#1eff36'] }],
        };

        this.metadata = {
            names: ['Country', 'Inflation'],
            types: ['ordinal', 'linear'],
        };
    }

    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar >
                        <Link to='/samples' >
                            <IconButton color="contrast" aria-label="Menu">
                                <HomeIcon />
                            </IconButton>
                        </Link>
                        <Typography type="title" color="inherit" style={{ flex: 1 }} >
                            React-VizGrammar - Geographical Chart Samples
                        </Typography>
                        <Link to={'/'} style={{ textDecoration: 'none' }}>
                            <Button style={{color: '#fff'}}>
                                Getting Started
                            </Button>
                        </Link>
                        <IconButton
                            color="inherit"
                            onClick={() => { window.location.href = 'https://github.com/wso2/react-vizgrammar'; }}
                            title="See the source on GitHub"
                        >
                            <GitHub />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Grid container>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper title={'World Map Sample'} chart={'map'} actionBar={false} media>
                            <div style={{ height: 450 }}>
                                <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.data} />
                            </div>
                            <div>
                                <br /><br />
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
                        <ChartWrapper title={'Europe Map Sample'} chart={'map'} actionBar={false} media>
                            <div style={{ height: 450 }}>
                                <VizG config={this.europeConfig} metadata={this.metadata} data={this.data} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.europeConfig, undefined, 4)),
                                    }
                                    }
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper title={'Europe Map Sample'} chart={'map'} actionBar={false} media>
                            <div style={{ height: 450 }}>
                                <VizG config={this.usaConfig} metadata={this.metadata} data={this.data2} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.usaConfig, undefined, 4)),
                                    }
                                    }
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper title={'Sample Dataset and Configuration structure'} chart={'scatter'} actionBar={false} media>
                            <div>
                                metadata :
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: syntaxHighlight(JSON.stringify(this.metadata, undefined, 4)),
                                    }}
                                />
                                <br />
                                data :
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: syntaxHighlight(JSON.stringify(this.data, undefined, 4)),
                                    }}
                                />
                            </div>
                            <br /><br />
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12} >
                        <ChartWrapper title="Chart JSON structure" chart="line" media actionBar={false}>
                            <ul>
                                <li><strong>type</strong> - Type of the chart in this case &qoute;map&qoute;</li>
                                <li><strong>x</strong> - Field containing Geographical data in metadata</li>
                                <li>
                                    <strong>charts</strong> - Array of chart objects that needs to be visualized
                                    <ul>
                                        <li>
                                            <strong>Chart Object</strong>
                                            <ul>
                                                <li><strong>type</strong> - type of the chart</li>
                                                <li><strong>y</strong> - Data field that needs to be visualized on the Map.</li>
                                                <li><strong>mapType</strong> - Type of the geography (world | europe | usa)</li>
                                                <li><strong>colorScale</strong> - Array of colors in hex form that will be over-riding the default color set</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>style</strong> - object containing style attributes of the chart.
                                    <ul>
                                        <li><strong>legendTitleColor</strong> - Color of the legend Title of the chart</li>
                                        <li><strong>legendTextColor</strong> - Color of the legend text of the chart</li>
                                    </ul>
                                </li>
                            </ul>
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default MapChartConfigSample;
