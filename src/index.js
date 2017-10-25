import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import LineChart from './Samples/LineChartsSamples';
import BarChart from './Samples/BarChartConfigSample';
import AreaChart from './Samples/AreaChartConfig';
import ScatterPlot from './Samples/ScatterPlotConfigSample';
import PieChart from './Samples/PieChartsConfigSample';
import Test from './Samples/Test.js';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import MapChartConfigSample from './Samples/MapChartConfigSample';
import NumberChartConfigSample from './Samples/NumberChartConfigSample';
import TableCharts from './Samples/TableChartConfigSample';
import WebsocketTest from './Samples/webSocketSample/ws-client.jsx';



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
