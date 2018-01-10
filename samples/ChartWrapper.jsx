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
import { Card, CardActions, CardHeader, Button, CardContent } from 'material-ui';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class ChartWrapper extends React.Component {
    render() {
        return (
            <Card style={{ marginTop: 80 }} >
                <CardHeader title={this.props.title} subheader={this.props.subtitle} />
                <CardContent>

                    {this.props.children}

                </CardContent>
                {
                    this.props.actionBar ?
                        <CardContent style={{ height: 50 }}>
                            <Link to={'/' + this.props.chart + '-charts'} style={{ textDecoration: 'none', float: 'right' }}>
                                <Button raised color="primary">{this.props.actionBar ? 'View Usage' : ' '}</Button>
                            </Link>
                        </CardContent> : null
                }
            </Card>
        );
    }
}

ChartWrapper.defaultProps = {
    media: false,
    actionBar: false,
    subtitle: '',
    children: null,
    height: 450,
};

ChartWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.element,
    chart: PropTypes.string.isRequired,
    actionBar: PropTypes.bool.isRequired,
    height: PropTypes.number,
};
