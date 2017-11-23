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
import PropTypes from 'prop-types';
//import SyntaxHighlighter from 'react-syntax-highlighter';
//import { androidstudio } from 'react-syntax-highlighter/dist/styles/hljs';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    item: {
        marginBottom: '50px',
        background: '#0f1c26',
    },
    floatedButton: {
        float: 'right',
    },
    cardHeader: {
        background: '#162732',
        fontSize: '16px',
        color: '#535353',
    },
    cardAction: {
        height: '40px',
        padding: '8px',
        borderTop: '1px solid #292929',
        color: '#b0b0b0',
        background: '#162732',
    },
    cardActionName: {
        position: 'absolute',
        top: '20px',
        right: '45px',
        marginLeft: '20px',
        fontSize: '13px',
    },
    highlightContainer: {
        padding: '20px',
        paddingTop: '0px',
        background: '#162732',
    },
    highlight: {
        background: '#162732',
    },
};

export class Util extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: null,
            title: this.props.title,
            subtitle: this.props.subtitle,
            actionBar: this.props.actionBar,
            chart: this.props.chart
        };
    }

    componentWillReceiveProps(props) {
        this.setState({children: props.children});
    }

    render() {
        const CODE = `lineChartConfig = {
            x: 'rpm',
            charts: [{type: 'line', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston']}],
            maxLength: 30,
            width: 700,
            height: 450,
        };`;

        return (
            <Card style={styles.item}>
                <CardHeader
                    title={this.state.title}
                    subtitle={this.state.subtitle}
                    style={styles.cardHeader}
                >

                </CardHeader>
                <CardMedia>
                    {this.props.children}
                </CardMedia>
                <CardActions style={styles.cardAction} actAsExpander={true} showExpandableButton={true}>
                    <div style={styles.cardActionName}>Show Code</div>
                    <FlatButton style={styles.floatedButton} primary={false}
                                label={this.state.actionBar ? 'View Usage' : ' '}
                                onClick={() => { window.location.href = this.state.chart + '-charts';
                    }}
                    />
                </CardActions>
                <div style={styles.highlightContainer} expandable={true}>
                    {/*<SyntaxHighlighter*/}
                    {/*language='javascript'*/}
                    {/*style={androidstudio}*/}
                    {/*customStyle={styles.highlight}*/}
                    {/*showLineNumbers={true}>*/}
                    {/*{CODE}*/}
                    {/*</SyntaxHighlighter>*/}
                </div>
            </Card>

        );
    }
}

export function getColorFromSchemaOrdinal(schema, index) {
    let length = 20, schemeCat;

    switch (schema) {
        case 'category10':
            schemeCat = d3.schemeCategory10;
            length = 10;
            break;
        case 'category20':
            schemeCat = d3.schemeCategory20;
            break;
        case 'category20b':
            schemeCat = d3.schemeCategory20b;
            break;
        case 'category20c':
            schemeCat = d3.schemeCategory20c;
            break;
    }

    return d3.scaleOrdinal()
        .range(schemeCat)
        .domain(Array.apply(null, {length: length}).map(Number.call, Number))(index);
}

Util.defaultProps = {
    media: false,
    actionBar: false,
};

Util.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.any.isRequired,
    chart: PropTypes.string.isRequired,
    media: PropTypes.bool,
    actionBar: PropTypes.bool.isRequired
};
