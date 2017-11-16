import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import LineChart from './charts/LineChartsSamples';
import BarChart from './charts/BarChartConfigSample';
import AreaChart from './charts/AreaChartConfig';
import ScatterPlot from './charts/ScatterPlotConfigSample';
import PieChart from './charts/PieChartsConfigSample';
import Test from './charts/Test.js';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import MapChartConfigSample from './charts/MapChartConfigSample';
import NumberChartConfigSample from './charts/NumberChartConfigSample';
import TableCharts from './charts/TableChartConfigSample';
import WebsocketTest from './charts/webSocketSample/ws-client.jsx';



ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={App}/>
            <Route exact path="/test" component={Test}/>
            <Route exact path="/websocketTest" component={WebsocketTest}/>
            <Route exact path="/line-charts" component={LineChart}/>
            <Route exact path="/bar-charts" component={BarChart}/>
            <Route exact path="/area-charts/" component={AreaChart}/>
            <Route exact path='/scatter-charts' component={ScatterPlot}/>
            <Route exact path='/pie-charts' component={PieChart}/>
            <Route exact path='/map-charts' component={MapChartConfigSample}/>
            <Route exact path='/number-charts' component={NumberChartConfigSample}/>
            <Route exact path='/table-charts' component={TableCharts}/>
        </div>
    </Router>,document.getElementById('root'));
