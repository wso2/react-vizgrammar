import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import { HashRouter as Router, Route} from 'react-router-dom';
import App from './App';

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

ReactDOM.render(
    <MuiThemeProvider theme={theme} >
        <Router>
            <Route exact path={'/'} component={App} />
        </Router>
    </MuiThemeProvider>, document.getElementById('samples'));
