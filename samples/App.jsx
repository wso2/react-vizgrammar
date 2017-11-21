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
import VizG from '../src/index';
import {Row} from './charts/util';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [[1, 10, 23, 'piston'], [1, 20, 34, 'rotary']],
            data2: [[1, 10, 23, 'piston']],
            scatterPlot: [
                [1, 41600, 3.5, 79.91, 0.8, 'piston', 0.03],
                [2, 37800, 3.5, 79.65, 1.3, 'rotary', 0.06]],
            timer: 0,
            mapData: [
                ['Afghanistan', 4.23],
                ['EGY', 1.23],
                ['Afghanistan', 2.23],
                ['United States', 10.23],
                ['Albania', 3.23],
                ['United Kingdom', 7],
                ['Australia', 5],
                ['Ireland', 1],
                ['RUS', 15]

            ]
        };
    }

    metadata = {
        names: ['rpm', 'torque', 'horsepower', 'EngineType', 'weight'],
        types: ['linear', 'linear', 'linear', 'ordinal', 'linear']
    };

    mapMetadata = {
        'names': ['Country', 'Inflation'],
        'types': ['ordinal', 'linear']
    };

    interval_id=null;
    lineChartConfig = {
        x: 'rpm',
        charts: [{type: 'line', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston']}],
        maxLength: 30,
        width: 700,
        height: 450,
    };

    singleAreaChartConfig = {
        x: 'rpm',
        charts: [{type: 'area', y: 'horsepower', fill: '#2ca02c'}],
        maxLength: 30,
        width: 700,
        height: 450,
        // animation:true
    };

    singleAreaChartConfig2 = {
        x: 'rpm',
        charts: [{type: 'area', y: 'torque',color:'EngineType' }],
        maxLength: 30,
        width: 700,
        height: 450,
        // animation:true
    };

    barChartConfig = {
        x: 'rpm',
        charts: [{type: 'bar', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston']}],
        maxLength: 30,
        width: 700,
        height: 450,
        // animation:true
    };

    scatterPlotConfig = {
        type: 'scatter',
        charts: [
            {
                type: 'scatter',
                x: 'rpm',
                y: 'torque',
                color: 'horsepower',
                size: 'weight',
                maxLength: 30
            }],

        width: 800,
        height: 450
    };

    pieChartConfig={
        charts : [{type:'arc', x:'torque', color:'EngineType', mode:'donut'}],
        width: 300,
        height: 300
    };

    numConfig = {
        x : 'torque',
        title :'Torque of Engine',
        charts : [{type: 'number'}],
        width: 400,
        height: 200
    };

    mapConfig = {
        x: 'Country',
        charts: [{type: 'map', y: 'Inflation', mapType: 'world'}],
        width: 400,
        height: 200
    };

    tableConfig = {
        key : 'rpm',
        charts : [{ type: 'table',
            y : 'torque',
            color: '*',

            columns:['EngineType',  'torque', 'rpm'],
            columnTitles:['Engine Type',  'Engine Torque', 'Engine RPM'],
        }
        ],
        maxLength: 7,
        width: 400,
        height: 200
    };

    componentDidMount() {
        this.interval_id=setInterval(() => {
            let randomY = Math.random()*100;
            this.setState({
                data: [
                    [this.state.timer, this.state.timer === 20 ? null : randomY * 2, 10, 'piston'],
                    [this.state.timer, randomY * 3, 10, 'rotary'],

                ],
                data2: [

                    [this.state.timer, randomY * 8, randomY, 'rotary']
                ],
                scatterPlot: [[this.state.timer, randomY * 2, randomY * 3, 'rotary', randomY * 5], [this.state.timer, randomY * 5, randomY * 6, 'rotary', randomY * 9]],
                timer: this.state.timer + 1,
            });

        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
    }

    render() {
        return (
            <div>
                <div className={'jumbotron'}>
                    <center><h1>VizG</h1></center>
                    <center><p>Charting Config Samples</p></center>
                </div>
                <Row media={true} chart={'line'} title={'Line Charts'} actionBar={true}>
                    <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.state.data}/>
                </Row>
                <Row media={true} chart={'bar'} title={'Bar Charts'} actionBar={true}>
                    <VizG config={this.barChartConfig} metadata={this.metadata} data={this.state.data}/>
                </Row>
                <Row media={true} chart={'area'} title={'Area Charts'} actionBar={true}>
                    <VizG config={this.singleAreaChartConfig} metadata={this.metadata} data={this.state.data2}/>
                </Row>
                <Row media={true} chart={'scatter'} title={'Scatter Plots'} actionBar={true}>
                    <VizG config={this.scatterPlotConfig} metadata={this.metadata} data={this.state.scatterPlot}/>
                </Row>
                <Row media={true} chart={'pie'} title={'Pie Charts'} actionBar={true}>
                    <VizG config={this.pieChartConfig} metadata={this.metadata} data={this.state.data}/>
                </Row>
                <Row title="Number Charts" chart="number" media={true} actionBar={true}>
                    <VizG config={this.numConfig} metadata={this.metadata} data={this.state.data}/>

                </Row>
                <Row title="Map Charts" chart="map" media={true} actionBar={true}>
                    <VizG config={this.mapConfig} metadata={this.mapMetadata} data={this.state.mapData}/>

                </Row>
                <Row media={true} chart={'table'} title={'Table Charts'} actionBar={true}>
                    <VizG config={this.tableConfig} metadata={this.metadata} data={this.state.data}/>
                </Row>
            </div>
        );
    }
}
