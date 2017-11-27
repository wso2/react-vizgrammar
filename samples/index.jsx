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
import LightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import DarkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import App from './App.jsx';
import LineChart from './charts/LineChartsSamples.jsx';
import BarChart from './charts/BarChartConfigSample.jsx';
import AreaChart from './charts/AreaChartConfig.jsx';
import ScatterPlot from './charts/ScatterPlotConfigSample.jsx';
import PieChart from './charts/PieChartsConfigSample.jsx';
import MapChartConfigSample from './charts/MapChartConfigSample.jsx';
import NumberChartConfigSample from './charts/NumberChartConfigSample.jsx';
import TableCharts from './charts/TableChartConfigSample.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    white, lightWhite, grey700, grey100, grey300, grey400, grey500, darkBlack, fullBlack, deepOrange500,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import './charts/css/default.css';
import Trials from './charts/Trials';

// TODO: implement switchable states for light and dark themes
const muiLightTheme = getMuiTheme({
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: grey700,
        primary2Color: grey500,
        primary3Color: grey400,
        accent1Color: deepOrange500,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: grey400,
        canvasColor: grey100,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: grey700,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
});

const muiDarkTheme = getMuiTheme({
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: grey700,
        primary2Color: grey500,
        primary3Color: grey400,
        accent1Color: deepOrange500,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: lightWhite,
        alternateTextColor: grey100,
        canvasColor: darkBlack,
        borderColor: grey700,
        disabledColor: fade(white, 0.3),
        pickerHeaderColor: grey700,
        clockCircleColor: fade(white, 0.07),
        shadowColor: fullBlack,
    },
});

ReactDOM.render(
    <Router>
        <MuiThemeProvider muiTheme={getMuiTheme(muiLightTheme)}>
            <AppBar
                title="react-vizgrammer"
                iconStyleRight={{ color: '#ffffff' }}
                iconElementRight={<IconButton
                    iconClassName="muidocs-icon-custom-github"
                    tooltip="bottom-center"
                    tooltipPosition="top-center"
                    href="https://github.com/wso2/react-vizgrammar"

                />}
            />
            <div className={'lightBaseTheme'}>
                <Route exact path="/" component={App} />
                <Route exact path="/line-charts" component={LineChart} />
                <Route exact path="/bar-charts" component={BarChart} />
                <Route exact path="/area-charts/" component={AreaChart} />
                <Route exact path='/scatter-charts' component={ScatterPlot} />
                <Route exact path='/pie-charts' component={PieChart} />
                <Route exact path='/map-charts' component={MapChartConfigSample} />
                <Route exact path='/number-charts' component={NumberChartConfigSample} />
                <Route exact path='/table-charts' component={TableCharts} />
                <Route exact path='/test' component={Trials} />
            </div>
        </MuiThemeProvider>
    </Router>, document.getElementById('samples'));
