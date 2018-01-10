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
