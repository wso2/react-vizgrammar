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
import { Grid, Button } from 'material-ui';
import ChartWrapper from '../ChartWrapper';
import VizG from '../../src/VizG';
import { syntaxHighlight } from './util/SyntaxHighLight';
import Header from '../components/Header';
import { makeData } from './util/MakeData';
import ServerSidePagination from './TableChartServerSidePagination';

export default class TableChartSamples extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                [0, 10, 1, 'Piston'],
            ],
            timer: 1,
        };

        this.tableChartConfig = {
            charts: [
                {
                    type: 'table',
                    columns: [
                        {
                            name: 'EngineType',
                            title: 'EngineType',
                            colorBasedStyle: true,
                        },
                        {
                            name: 'torque',
                            title: 'Engine Torque',
                        },
                        {
                            name: 'rpm',
                            title: 'Engine RPM',
                            colorBasedStyle: true,
                            colorScale: ['#4db6ac'],
                        },
                    ],
                },
            ],
            maxLength: 7,
            colorBasedStyle: true,
            pagination: true,
        };

        this.normalTableConfig = {
            charts: [
                {
                    type: 'table',
                    columns: [
                        {
                            name: 'firstName',
                            title: 'First Name',
                            highlight: true,
                        },
                        {
                            name: 'lastName',
                            title: 'Last Name',
                        },
                        {
                            name: 'age',
                            title: 'Age',
                        },
                        {
                            name: 'visits',
                            title: 'Visits',
                        },
                        {
                            name: 'status',
                            title: 'status',
                        },
                    ],
                },
            ],
            pagination: true,
            filterable: true,
            append: false,
            dataFunction: (state, rowInfo) => {
                return {
                    style: {
                        background: rowInfo && rowInfo.row.firstName === "string" ? "#4db6ac" : null
                    }
                };
            },
        };

        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'EngineType'],
            types: ['linear', 'linear', 'ordinal', 'ordinal'],
        };

        this.intervalObj = null;

        this.normalDataSet = JSON.parse('[["string","magazine",7,64,50,"complicated"],["county","silk",20,8,84,"relationship"],["bit","quarter",15,95,37,"complicated"],["cattle","feather",17,57,78,"complicated"],["mom","banana",20,45,53,"complicated"],["oil","celebration",7,68,70,"single"],["insurance","legs",29,4,46,"relationship"],["week","drawer",9,63,93,"complicated"],["authority","nerve",9,32,27,"complicated"],["quality","lead",5,63,28,"single"],["complaint","resource",1,27,3,"relationship"],["disgust","morning",25,79,52,"complicated"],["championship","toothbrush",19,99,95,"relationship"],["scissors","variety",14,54,2,"relationship"],["park","improvement",18,34,24,"relationship"],["marketing","play",1,2,5,"relationship"],["foundation","credit",6,15,9,"complicated"],["substance","sector",23,20,18,"single"],["trip","brother",16,25,92,"relationship"],["responsibility","analyst",27,37,77,"complicated"],["bathroom","glove",17,38,99,"relationship"],["nerve","grade",19,14,56,"complicated"],["snail","badge",5,51,30,"complicated"],["food","kittens",18,88,50,"relationship"],["disk","square",2,89,11,"relationship"],["impulse","medicine",8,56,70,"single"],["grass","cub",29,29,38,"relationship"],["doll","bears",7,72,41,"single"],["language","consequence",23,75,99,"relationship"],["rail","shape",24,10,41,"single"],["reflection","air",26,15,89,"complicated"],["lab","virus",3,99,47,"single"],["tendency","trousers",25,56,19,"single"],["ray","basket",14,38,39,"single"],["sheep","impression",16,8,4,"complicated"],["toe","net",8,48,26,"complicated"],["show","things",25,23,43,"relationship"],["location","window",24,74,83,"single"],["hotel","horn",25,54,85,"complicated"],["cloud","crook",11,52,90,"complicated"],["region","plantation",3,38,79,"relationship"],["expression","presentation",8,22,61,"complicated"],["calculator","paint",12,69,39,"single"],["tendency","balloon",1,99,30,"relationship"],["control","pail",0,63,6,"single"],["membership","change",19,0,45,"single"],["start","story",16,45,95,"single"],["comfort","wrist",23,29,63,"relationship"],["head","comb",17,63,97,"complicated"],["beetle","plough",9,82,81,"relationship"],["eyes","church",15,20,3,"single"],["instruction","soap",19,78,6,"single"],["wave","throat",26,33,52,"single"],["error","credit",0,35,28,"complicated"],["cheek","disaster",21,96,59,"single"],["sample","harbor",17,89,86,"complicated"],["perspective","tradition",3,97,35,"relationship"],["chairs","psychology",25,48,57,"complicated"],["refrigerator","throne",25,48,78,"complicated"],["assumption","cup",14,48,61,"complicated"],["planes","operation",7,53,40,"single"],["shoe","badge",7,9,36,"complicated"],["harmony","play",0,84,84,"complicated"],["lawyer","agency",21,23,51,"relationship"],["role","throne",27,62,29,"relationship"],["knowledge","weakness",28,60,69,"relationship"],["picture","pet",18,41,15,"complicated"],["ants","soda",10,93,31,"single"],["glass","seashore",5,80,38,"single"],["lip","vein",10,10,81,"single"],["photo","parcel",4,28,89,"complicated"],["celery","signature",8,55,62,"single"],["station","shock",28,44,46,"complicated"],["mountain","growth",27,91,87,"relationship"],["cushion","wound",12,44,36,"single"],["slip","series",8,0,28,"complicated"],["guitar","sound",29,74,78,"complicated"],["membership","organization",22,13,12,"complicated"],["approval","payment",2,37,58,"single"],["time","signature",23,53,42,"single"],["mode","pollution",14,69,1,"single"],["basis","songs",27,91,52,"complicated"],["grandfather","kittens",17,42,29,"relationship"],["maintenance","tree",0,60,8,"single"],["wheel","throat",18,31,67,"complicated"],["quartz","engineering",7,96,55,"relationship"],["ant","income",23,87,33,"relationship"],["word","assignment",11,67,42,"relationship"],["amount","zephyr",21,33,21,"complicated"],["fact","tiger",12,40,40,"complicated"],["iron","weakness",3,30,27,"single"],["pull","volleyball",24,78,71,"complicated"],["cap","recognition",7,85,73,"complicated"],["toothpaste","library",19,75,72,"relationship"],["lettuce","winner",8,90,48,"complicated"],["ad","base",6,99,60,"relationship"],["energy","coat",4,85,36,"single"],["apparel","preference",25,11,50,"complicated"],["vase","tomatoes",29,1,56,"single"],["plate","satisfaction",9,47,36,"single"]]');
        this.normalDataSetMetadata = {
            names: ['firstName', 'lastName', 'age', 'visits', 'status'],
            types: ['ordinal', 'ordinal', 'linear', 'linear', 'linear'],
        };
    }

    componentDidMount() {
        this.intervalObj = setInterval(() => {
            this.setState({
                data: [
                    [Math.round(Math.random() * 100), Math.round(Math.random() * 100), 1, 'Piston'],
                    [Math.round(Math.random() * 100), Math.round(Math.random() * 100), 1, 'rotary'],
                ],
                timer: this.state.timer + 1,
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalObj);
    }


    render() {

        return (
            <div>
                <Header url={'/samples'} title={'Table Chart Samples'} />
                <Grid container>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            title={'Table Chart Sample'}
                            chart={'table'}
                            actionBar={false}
                        >
                            <div style={{ height: 400 }}>
                                <div style={{ height: 40 }}>
                                    <VizG
                                        config={this.tableChartConfig}
                                        metadata={this.metadata}
                                        data={this.state.data}
                                        theme={this.props.theme}
                                    />
                                </div>
                            </div>
                            <div>
                                <pre
                                    dangerouslySetInnerHTML={
                                        {
                                            __html: syntaxHighlight(
                                                JSON.stringify(this.tableChartConfig, undefined, 4)),
                                        }
                                    }
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            title={'Data Table Chart Sample'}
                            chart={'table'}
                            actionBar={false}
                        >
                            <div style={{ height: 400 }}>
                                <div style={{ height: 40 }}>
                                    <VizG
                                        config={this.normalTableConfig}
                                        metadata={this.normalDataSetMetadata}
                                        data={this.normalDataSet}
                                        theme={this.props.theme}
                                    />
                                </div>
                            </div>
                            <div>
                                <pre
                                    dangerouslySetInnerHTML={
                                        {
                                            __html: syntaxHighlight(
                                                JSON.stringify(this.normalTableConfig, undefined, 4)),
                                        }
                                    }
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            title={'Server Side pagination Sample'}
                            chart={'table'}
                            actionBar={false}
                        >
                            <div style={{ height: 400 }}>
                                <div style={{ height: 40 }}>
                                    <ServerSidePagination
                                        theme={this.props.theme}
                                    />
                                </div>
                            </div>
                            <div>
                                <a href="https://github.com/wso2/react-vizgrammar/blob/master/samples/chart-docs/TableChartServerSidePagination.jsx">
                                    <Button raised color="primary">View Source</Button>
                                </a>
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper
                            title={'Sample Data set and JSON configuration structure.'}
                            chart={'table'}
                            actionBar={false}
                        >
                            <div className="json-structure" >
                                metadata:
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: syntaxHighlight(
                                            JSON.stringify(this.metadata, undefined, 4)),
                                    }}
                                />
                                data:
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: syntaxHighlight(
                                            JSON.stringify(this.state.data, undefined, 4)),
                                    }}
                                />
                                <br /><br />
                                <h3>Chart Configuration JSON structure</h3>
                                <ul>
                                    <li>
                                        <strong>charts</strong> - Array of Chart objects that should be visualized.
                                        <ul>
                                            <li>
                                                <strong>Chart Object</strong>
                                                <ul>
                                                    <li>
                                                        <strong>type</strong> - Type of the chart that need to be
                                                        visualized in this case &qoute;table&qoute;
                                                    </li>
                                                    <li>
                                                        <strong>uniquePropertyColumn</strong> - To stop duplication of data
                                                    </li>
                                                    <li>
                                                        <strong>columns</strong> - Array of objects containing
                                                        column data
                                                        <ul>
                                                            <li>
                                                                <strong>name</strong> - name provided in metadata
                                                            </li>
                                                            <li>
                                                                <strong>title</strong> - Title of the column
                                                            </li>
                                                            <li>
                                                                <strong>colorScale</strong> - Set of colors to be used
                                                                for the color categorization of the column
                                                            </li>
                                                            <li >
                                                                <strong>colorDomain</strong> - If a certain color category
                                                                needs to be highlighted in a specific color.
                                                            </li>
                                                            <li>
                                                                <strong>timeFormat</strong> - If data in the column are
                                                                &nbsp;timestamps the user can use this attribute to&nbsp;
                                                                format
                                                                the time stamp.refer&nbsp;
                                                                <a href={'https://github.com/d3/d3-time-format/blob/master/README.md#timeFormat'}>
                                                                    d3 documentation
                                                                </a> for more info
                                                            </li>
                                                            <li>
                                                                <strong>textColor</strong> - Color of the text in the&nbsp;
                                                                cell(* if the column use colorBased categorizing this option is recommended)
                                                            </li>
                                                            <li>
                                                                <strong>colorBasedStyle</strong> - color the column data according to the type
                                                                of data in the columns(boolean value)
                                                            </li>
                                                            <li>
                                                                <strong>highlight</strong> - highlight the cell data
                                                                according to the value of data in the columns
                                                                (boolean value)
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>maxLength</strong> - maximum number of records to be shown in the table
                                        at a time
                                    </li>
                                    <li>
                                        <strong>pagination</strong> - boolean value to show pagination for table chart
                                        or not default: false
                                    </li>
                                    <li>
                                        <strong>append</strong> -  Append the incoming data to the existing dataset or
                                        replace the existing dataset boolean value.
                                    </li>
                                    <li>
                                        <strong>filterable</strong> -  Boolean value to specify whether the data in the table are filterable.
                                    </li>
                                    <li>
                                        <strong>sortable</strong> -  Boolean value to specify whether the data in the table are sortable.
                                    </li>
                                    <li>
                                        <strong>dataFunction</strong> -  function to match data and do styling.
                                    </li>
                                </ul>
                            </div>
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
