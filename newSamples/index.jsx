import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import { HashRouter as Router, Route } from 'react-router-dom';
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
            <Route exact path={'/'} component={App} />
            <Route path={'/line-charts'} component={LineCharts} />
            <Route path={'/area-charts'} component={AreaCharts} />
            <Route path={'/bar-charts'} component={BarCharts} />
            <Route path={'/scatter-charts'} component={ScatterChart} />
            <Route path="/map-charts" component={Maps} />
            <Route path="/pie-charts" component={Arcs} />
            <Route path="/number-charts" component={NumChart} />
            <Route path="/table-charts" component={Table} />
        </MuiThemeProvider>
    </Router>, document.getElementById('samples'));
