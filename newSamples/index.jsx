import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import { HashRouter as Router, Route } from 'react-router-dom';
import App from './App';
import LineCharts from './chart-docs/LineChartSamples';

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
            
        </MuiThemeProvider>
    </Router>, document.getElementById('samples'));
