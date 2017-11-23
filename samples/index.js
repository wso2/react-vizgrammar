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
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import App from './App.jsx';
import LineChart from './charts/LineChartsSamples';
import BarChart from './charts/BarChartConfigSample';
import AreaChart from './charts/AreaChartConfig';
import ScatterPlot from './charts/ScatterPlotConfigSample';
import PieChart from './charts/PieChartsConfigSample';
import MapChartConfigSample from './charts/MapChartConfigSample';
import NumberChartConfigSample from './charts/NumberChartConfigSample';
import TableCharts from './charts/TableChartConfigSample';
import LightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import DarkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ReactDOM.render(
    <Router>
        <MuiThemeProvider muiTheme={getMuiTheme(LightBaseTheme)}>
        <div>
            <Route exact path="/" component={App} />
            <Route exact path="/line-charts" component={LineChart} />
            <Route exact path="/bar-charts" component={BarChart} />
            <Route exact path="/area-charts/" component={AreaChart} />
            <Route exact path='/scatter-charts' component={ScatterPlot} />
            <Route exact path='/pie-charts' component={PieChart} />
            <Route exact path='/map-charts' component={MapChartConfigSample} />
            <Route exact path='/number-charts' component={NumberChartConfigSample} />
            <Route exact path='/table-charts' component={TableCharts} />
        </div>
        </MuiThemeProvider>
    </Router>, document.getElementById('samples'));
