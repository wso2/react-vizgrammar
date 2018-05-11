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
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme, IconButton } from 'material-ui';
import LightBulbFill from './components/LightBulbFill'
import LightBulbOutline from './components/LightBulbOutline';
import { HashRouter as Router, Route, Switch as RouterSwitch } from 'react-router-dom';
import ScrollReset from './ScrollReset';
import App from './App';
import LineCharts from './chart-docs/LineChartSamples';
import AreaCharts from './chart-docs/AreaChartSamples';
import BarCharts from './chart-docs/BarChartSamples';
import ScatterChart from './chart-docs/ScatterPlotSample';
import Maps from './chart-docs/GeographicalChartsSample';
import Arcs from './chart-docs/PieChartSamples';
import NumChart from './chart-docs/NumberChartSample';
import Table from './chart-docs/TableChartSamples';
import GettingStarted from './GettingStarted';
import { FormGroup } from 'material-ui/Form';
import './styles/style.css';

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

class AppRoute extends React.Component {

    constructor() {
        super();
        this.state = {
            theme: `light`,
            check: false,
        };
    }

    handleChange = (evt) => {

        evt.preventDefault();
        this.setState({
            check: !this.state.check,
            theme: !this.state.check ? `dark` : `light`
        });

    };

    render() {
        return (
            <Router>
                <div className={this.state.theme + 'Theme'}>
                    <ScrollReset>
                        <Route exact path={'/'} component={GettingStarted} />
                    </ScrollReset>
                    <MuiThemeProvider theme={this.state.theme === 'light' ? lightTheme : darkTheme}>
                        <RouterSwitch>
                            <Route exact path={'/'} component={null} />
                            <Route component={() => (
                                <div style={{ zIndex: '11100', position: 'fixed', right: '75px', top: '10px' }}>
                                    <IconButton
                                        style={{color: '#fff'}}
                                        onClick={this.handleChange}
                                        title="Toggle Light/Dark theme"
                                    >
                                        {this.state.theme === `dark` ? <LightBulbFill /> : <LightBulbOutline />}
                                    </IconButton>
                                </div>
                            )} />
                        </RouterSwitch>
                        <ScrollReset>
                            <Route path={'/line-charts'} component={() => {
                                return (
                                    <LineCharts theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                        <ScrollReset>
                            <Route path={'/area-charts'} component={() => {
                                return (
                                    <AreaCharts theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                        <ScrollReset>
                            <Route path={'/bar-charts'} component={() => {
                                return (
                                    <BarCharts theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                        <ScrollReset>
                            <Route path={'/scatter-charts'} component={() => {
                                return (
                                    <ScatterChart theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                        <ScrollReset>
                            <Route path="/map-charts" component={() => {
                                return (
                                    <Maps theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                        <ScrollReset>
                            <Route path="/pie-charts" component={() => {
                                return (
                                    <Arcs theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                        <ScrollReset>
                            <Route path="/number-charts" component={() => {
                                return (
                                    <NumChart theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                        <ScrollReset>
                            <Route path="/table-charts" component={() => {
                                return (
                                    <Table theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                        <ScrollReset>
                            <Route path="/samples" component={() => {
                                return (
                                    <App theme={this.state.theme} />
                                )
                            }} />
                        </ScrollReset>
                    </MuiThemeProvider>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(
    <AppRoute />,
    document.getElementById('samples')
);
