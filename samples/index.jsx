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
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import { HashRouter as Router, Route } from 'react-router-dom';
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

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

ReactDOM.render(
    <Router>
        <MuiThemeProvider theme={theme} >
            <ScrollReset>
                <Route exact path={'/'} component={App} />
            </ScrollReset>
            <ScrollReset>
                <Route path={'/line-charts'} component={LineCharts} />
            </ScrollReset>
            <ScrollReset>
                <Route path={'/area-charts'} component={AreaCharts} />
            </ScrollReset>
            <ScrollReset>
                <Route path={'/bar-charts'} component={BarCharts} />
            </ScrollReset>
            <ScrollReset>
                <Route path={'/scatter-charts'} component={ScatterChart} />
            </ScrollReset>
            <ScrollReset>
                <Route path="/map-charts" component={Maps} />
            </ScrollReset>
            <ScrollReset>
                <Route path="/pie-charts" component={Arcs} />
            </ScrollReset>
            <ScrollReset>
                <Route path="/number-charts" component={NumChart} />
            </ScrollReset>
            <ScrollReset>
                <Route path="/table-charts" component={Table} />
            </ScrollReset>
        </MuiThemeProvider>
    </Router>, document.getElementById('samples'));
