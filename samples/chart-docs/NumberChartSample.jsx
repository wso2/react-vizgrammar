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
import { AppBar, Toolbar, Typography, Grid, IconButton, Button } from 'material-ui';
import HomeIcon from 'material-ui-icons/ArrowBack';
import { Link } from 'react-router-dom';
import ChartWrapper from '../ChartWrapper';
import VizG from '../../src/VizG';
import { syntaxHighlight } from './util/SyntaxHighLight';
import GitHub from '../components/GitHub';

export default class NumberChartSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                [10],
            ],
            timer: 1,
        };

        this.numConfig = {
            x: 'torque',
            title: 'Torque of Engine',
            charts: [{ type: 'number' }],
            showDifference: true,
            showPercentage: true,
        };

        this.metadata = {
            names: ['torque'],
            types: ['linear'],
        };

        this.intervalObj = null;
    }

    componentDidMount() {
        this.intervalObj = setInterval(() => {
            this.setState({
                data: [[Math.round(Math.random() * 100)], [Math.round(Math.random() * 100)]],
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalObj);
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
                            React-VizGrammar - Pie Chart Samples
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
                        <ChartWrapper
                            media
                            actionBar={false}
                            chart={'line'}
                            title={'Number Chart Sample'}
                        >
                            <div style={{ height: 450 }}>
                                <VizG config={this.numConfig} metadata={this.metadata} data={this.state.data} theme={this.props.theme} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={
                                    {
                                        __html: syntaxHighlight(
                                                JSON.stringify(this.numConfig, undefined, 4)),
                                    }
                                    }
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            media
                            actionBar={false}
                            chart={'line'}
                            title={'Number Chart Sample'}
                        >
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
                                <li><strong>x</strong> - Datafield that should be shown in the number chart</li>
                                <li><strong>title</strong> - Title that should be displayed in the chart</li>
                                <li>
                                    <strong>charts</strong> - Array of chart objects that should be visualized
                                    <ul>
                                        <li><strong>type</strong> - Type of the chart to be displayed</li>
                                    </ul>
                                </li>
                                <li><strong>showDifference</strong> - Show difference between current value and the previous value</li>
                                <li><strong>showPercentage</strong> - Show difference with the previous value as a percentage</li>
                            </ul>
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </div>
        );
    }

}
