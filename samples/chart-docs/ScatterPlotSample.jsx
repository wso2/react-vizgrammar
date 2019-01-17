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
import { Grid } from 'material-ui';
import ChartWrapper from '../ChartWrapper';
import VizG from '../../src/VizG';
import { syntaxHighlight } from './util/SyntaxHighLight';
import Header from '../components/Header';

/**
 * This class will render a page that contains samples on how to use Scatter plots.
 */
export default class ScatterChartConfigSample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scatterPlot: [
                [1, 4, 3.5, 79.91, 0.8, 0.03, 'piston'],
                [2, 3, 3.5, 79.65, 1.3, 0.06, 'rotary']],
            timer: 0,
        };

        this.interval_id = null;

        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'weight', 'EngineType'],
            types: ['linear', 'linear', 'linear', 'linear', 'ordinal'],
        };

        this.scatterPlotConfig = {
            type: 'scatter',
            charts: [
                {
                    type: 'scatter',
                    x: 'rpm',
                    y: 'torque',
                    color: 'horsepower',
                    size: 'weight',
                    maxLength: 30,
                    colorScale: ['#1f77b4', '#ebff3b'],

                }],
            width: 800,
            height: 450,
        };
    }

    componentDidMount() {
        this.interval_id = setInterval(() => {
            this.setState({
                scatterPlot: [[this.state.timer, Math.random() * 100, Math.random() * 10, Math.random() * 100, 'piston'],
                    [this.state.timer, Math.random() * 100, Math.random() * 10, Math.random() * 100, 'rotary']],
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
                <Header url={'/samples'} title={'Scatter Plot Sample'} />
                <Grid container>
                    <Grid item lg={6} sm={12} xs={12} >
                        <ChartWrapper title={'Scatter Plot'} chart={'scatter'} actionBar={false} media>
                            <div style={{ height: 450 }}>
                                <VizG config={this.scatterPlotConfig} metadata={this.metadata}
                                    data={this.state.scatterPlot} theme={this.props.theme} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={
                                        {
                                            __html: syntaxHighlight(
                                                JSON.stringify(this.scatterPlotConfig, undefined, 4)),
                                        }
                                    }
                                />
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12}>
                        <ChartWrapper title={'Sample Dataset and Configuration structure'} chart={'scatter'}
                            actionBar={false} media>
                            <div className="json-structure" >
                                metadata :
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: syntaxHighlight(JSON.stringify(this.metadata, undefined, 4)),
                                    }}
                                />
                                <br />
                                data :
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: syntaxHighlight(JSON.stringify(this.state.scatterPlot, undefined, 4)),
                                    }}
                                />
                                <br /><br />
                                <h3>Chart JSON Structure</h3>
                                <ul>
                                    <li>
                                        <strong>type</strong> - Type of the Chart in this case &quot;scatter&quot;
                                    </li>
                                    <li>
                                        <strong>charts</strong> - Array of chart objects to be visualized.
                                        <ul>
                                            <li>
                                                <strong>Chart Object</strong>
                                                <ul>
                                                    <li>
                                                        <strong>x</strong> - Data field representing x-axis
                                                        in the metadata
                                                    </li>
                                                    <li>
                                                        <strong>y</strong> - Data field representing y-axis
                                                        in the metadata
                                                    </li>
                                                    <li>
                                                        <strong>color</strong> - Data field representing color
                                                        categorization data field of the metadata
                                                    </li>
                                                    <li>
                                                        <strong>size</strong> - Data field representing size
                                                        categorization data field of the metadata
                                                    </li>
                                                    <li>
                                                        <strong>colorScale</strong> - Array of colors in hex
                                                        form that will be over-riding the default color set
                                                    </li>
                                                    <li>
                                                        <strong>colorDomain</strong> - If a certain color
                                                        category needs to be plotted in a specific color.
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>....</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>maxLength</strong> - Max length of data points to be
                                        visualized in the chart at time
                                    </li>
                                    <li>
                                        <strong>legend</strong> - enable or disable legend (boolean) value.
                                    </li>
                                    <li>
                                        <strong>Append</strong> - Append the incoming data to the existing dataset or
                                        replace the existing dataset boolean value.
                                    </li>
                                    <li>
                                        <strong>timeFormat</strong> - If the x-axis is a time series using this attribute
                                        user can format the tick values of the x axis using regex. refer&nbsp;
                                        <a href={'https://github.com/d3/d3-time-format/blob/master/README.md#timeFormat'}>
                                            d3 documentation
                                        </a> for more info
                                    </li>
                                    <li>
                                        <strong>tipTimeFormat</strong> - If the x-axis is a time series using this
                                        attribute user can format the tick values of the x axis using regex. refer&nbsp;
                                        <a href={'https://github.com/d3/d3-time-format/blob/master/README.md#timeFormat'}>
                                            d3 documentation
                                        </a> for more info
                                    </li>
                                    <li><strong>animate</strong> - animate chart visualizations</li>
                                    <li><strong>disableVerticleGrid</strong> - Disable verticle grid of the chart
                                        (boolean value)</li>
                                    <li><strong>disableHorizontalGrid</strong> - Disable horizontal grid of the chart
                                        (boolean value)</li>
                                    <li><strong>yAxisLabel</strong> - Change the label shown along the y-axis</li>
                                    <li><strong>xAxisLabel</strong> - Change the label shown along the x-axis</li>
                                    <li><strong>yAxisTickCount</strong> - Number of ticks shown in the y-axis</li>
                                    <li><strong>xAxisTickCount</strong> - Number of ticks shown in the x-axis</li>
                                    <li><strong>legendOrientaion</strong> - Orientaion of the legend relative
                                        to the chart (top | bottom | left | right)</li>
                                    <li>
                                        <strong>style</strong> - Object that contain style attributes of the charts.
                                        <ul>
                                            <li><strong>axisColor</strong> - Color of the axis lines</li>
                                            <li><strong>axisLabelColor</strong> - Color of the axis labels</li>
                                            <li><strong>xAxisTickAngle</strong> - Tick angle of the x-axis ticks</li>
                                            <li><strong>yAxisTickAngle</strong> - Tick angle of the y-axis ticks</li>
                                            <li><strong>tickLabelColor</strong> - Font color of the tickLabels</li>
                                            <li><strong>legendColumns</strong> - Number of columns in the legend,
                                                default is 5. If the legend items are greater than 12, legend will
                                                be shown at the bottom with 5 columns
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </ChartWrapper>
                    </Grid>
                    <Grid item lg={6} sm={12} xs={12} />
                </Grid>
            </div>
        );
    }
}
