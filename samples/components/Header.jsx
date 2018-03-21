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
import {AppBar, Toolbar, Typography, Switch, IconButton, createMuiTheme} from 'material-ui';
import GitHub from '../components/GitHub';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


export default class header extends React.Component {

    render() {
        return (

            <AppBar>
                <Toolbar>
                    <Link to= {this.props.url} style={{textDecoration: 'none', flex: 1}}>
                        <Typography type="title" color="grey500">
                            {this.props.title}
                        </Typography>
                    </Link>

                    <IconButton
                        color="inherit"
                        onClick={() => {
                            window.location.href = 'https://github.com/wso2/react-vizgrammar';
                        }}
                        title="See the source on GitHub"
                    >
                        <GitHub />
                    </IconButton>
                </Toolbar>
            </AppBar>

        )
    };
}


header.propTypes = {
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};
