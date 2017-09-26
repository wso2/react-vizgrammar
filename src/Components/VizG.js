/**
 * Copyright (c) WSO2 Inc. (http://wso2.com) All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/**
 * Copyright (c) 2015 Formidable Labs
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */


import React from 'react';
import {
    VictoryChart,
    VictoryGroup,
    VictoryStack,
    VictoryScatter,
    VictoryLine,
    VictoryBar,
    VictoryTheme,
    VictoryArea,
    VictoryPortal,
    VictoryTooltip,
    VictoryContainer,
    VictoryVoronoiContainer
} from 'victory';
// import AreaMarkSeries from './AreaMarkSeries';


import * as d3 from 'd3';
// import '../../node_modules/react-vis/dist/style.css';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';


export default class VizG extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSets: {},
            chartArray: [],
            xScale: 'linear',
            initialized: false,
            orientation: 'bottom',

        };

        this._sortAndPopulateDataSet = this._sortAndPopulateDataSet.bind(this);

    }


    componentDidMount() {
        this._sortAndPopulateDataSet(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._sortAndPopulateDataSet(nextProps);
    }


    /**
     * Gives a range of colors that can be used in the scatter plot color range
     * @param scheme color scheme given as a string
     * @private
     */
    _getColorRangeArray(scheme) {
        return Array.apply(null, {length: scheme.substring(8, 10)}).map(Number.call, Number).map((num) => VizG._getColorFromSchemaOrdinal(scheme, num));
    }


    /**
     * will sort and populate the dataSet that's defined in the state according to the given config
     * @param props Props that received
     * @private
     */
    _sortAndPopulateDataSet(props) {
        let {metadata, config, data} = props;
        let {dataSets, initialized, orientation, chartArray, xScale} = this.state;

        //if x is defined it's either line,bar or area or geo chart
        if (config.x) {
            let xIndex = metadata.names.indexOf(config.x);
            xScale = metadata.types[xIndex] === 'time' ? 'time' : xScale;
            config.charts.map((chart, chartIndex) => {

                orientation = orientation === 'left' ? orientation : (chart.orientation || 'bottom');

                let yIndex = metadata.names.indexOf(chart.y);
                if (!initialized) {
                    chartArray.push({
                        type: chart.type,
                        dataSetNames: {},
                        mode: chart.mode,
                        orientation: chart.orientation,
                        colorScale: Array.isArray(chart.colorScale) ? chart.colorScale : this._getColorRangeArray(chart.colorScale || 'category10')
                    });
                }
                data.map((datum, datIndex) => {
                    let dataSetName = metadata.names[yIndex];
                    if (chart.color) {
                        let colorIndex = metadata.names.indexOf(chart.color);
                        dataSetName = colorIndex > -1 ? datum[colorIndex] : dataSetName;
                    }

                    dataSets[dataSetName] = dataSets[dataSetName] || [];
                    // console.info(yIndex);
                    dataSets[dataSetName].push({x: datum[xIndex], y: datum[yIndex]});

                    // console.info(chart.maxLength);
                    if (dataSets[dataSetName].length > config.maxLength) {
                        // console.info('check');
                        dataSets[dataSetName].shift();
                    }

                    // console.info(chartArray[chartIndex].dataSetNames);
                    if (!chartArray[chartIndex].dataSetNames.hasOwnProperty(dataSetName)) {
                        chartArray[chartIndex].dataSetNames[dataSetName] = null;

                        if (chart.colorDomain) {
                            let colorIn = chart.colorDomain.indexOf(dataSetName);
                            if (colorIn > -1) {
                                chartArray[chartIndex].dataSetNames[dataSetName] = Array.isArray(chart.colorScale) ?
                                    (colorIn > chart.colorDomain.length ? chart.colorDomain[0] : chart.colorDomain[colorIn]) : VizG._getColorFromSchemaOrdinal(chart.colorScale || 'category10', colorIn);
                            }
                        }

                    }

                });
                // console.info('awa');

            });
        }
        initialized = true;

        this.setState({
            dataSets: dataSets,
            chartArray: chartArray,
            xScale: xScale,
            orientation: orientation,
            initialized: initialized
        });


    }


    /**
     * event handler for mouse out from the XY plane
     * @private
     */
    _onPlaneMouseOut() {
        this.setState({
            hintValue: null
        });
    }

    /**
     * will return a string color based on the scema and index provided
     * @param schema Name of the d3 ordinal color scale schema (default: category10)
     * @param index Index of the color in the array
     * @private
     */
    static _getColorFromSchemaOrdinal(schema, index) {
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

    /**
     * get the color if the color type of chart is linear
     * @param domain domain of values the colors should be distributed
     * @param range colorSchema
     * @param value Value the color is needed
     * @private
     */
    _getFromLinearColorScale(domain, range, value) {
        return scaleLinear().domain(domain).range(range);
    }

    render() {
        let {metadata, config} = this.props;
        let {chartArray, dataSets, orientation, xScale} = this.state;
        let chartComponents = [];
        let legendItems = [];

        chartArray.map((chart, chartIndex) => {
            switch (chart.type) {
                case 'line':
                    // console.info(Object.keys(chart.dataSetNames));
                    chartComponents.push(
                        [
                            <VictoryGroup
                                colorScale={chart.colorScale}

                            >
                                {Object.keys(chart.dataSetNames).map((dataSetName) => {
                                    return (
                                        <VictoryLine
                                            interpolation={chart.mode}
                                            key={`chart-${chartIndex}-line-${dataSetName}`}
                                            data={dataSets[dataSetName]}

                                            color={chart.dataSetNames[dataSetName]}
                                        />

                                    );
                                })}
                            </VictoryGroup>,
                            <VictoryGroup
                                colorScale={chart.colorScale}

                            >
                                {Object.keys(chart.dataSetNames).map((dataSetName) => {
                                    return (
                                        <VictoryScatter
                                            key={`chart-${chartIndex}-lineScatter-${dataSetName}`}
                                            data={dataSets[dataSetName]}
                                            style={{data: {fillOpacity: 0.5}}}
                                            color={chart.dataSetNames[dataSetName]}
                                            label={(d)=>d.y}
                                            labelComponent={<VictoryTooltip/>}
                                        />

                                    );
                                })}
                            </VictoryGroup>
                        ]
                    );
                    break;
                case 'bar':
                    // console.info(Object.keys(chart.dataSetNames));


                    if (chart.mode === 'stacked') {
                        chartComponents.push(
                            <VictoryStack
                                colorScale={chart.colorScale}

                            >
                                {Object.keys(chart.dataSetNames).map((dataSetName) => {
                                    if (chartArray[chartIndex].dataSetNames[dataSetName]) {
                                        return (
                                            <VictoryBar
                                                key={`chart-${chartIndex}-bar-${dataSetName}`}
                                                data={dataSets[dataSetName]}
                                                style={{data: {fill: chartArray[chartIndex].dataSetNames[dataSetName]}}}
                                                horizontal={orientation === 'left'}
                                            />
                                        );
                                    } else {
                                        return (
                                            <VictoryBar
                                                key={`chart-${chartIndex}-bar-${dataSetName}`}
                                                data={dataSets[dataSetName]}
                                                horizontal={orientation === 'left'}
                                            />
                                        );
                                    }

                                })}

                            </VictoryStack>
                            // </VictoryGroup>
                        );
                    } else {
                        chartComponents.push(
                            <VictoryGroup
                                colorScale={chart.colorScale}
                                offset={4}
                                style={{data: {width: 4}}}
                            >
                                {Object.keys(chart.dataSetNames).map((dataSetName) => {
                                    if (chartArray[chartIndex].dataSetNames[dataSetName]) {
                                        return (
                                            <VictoryBar
                                                key={`chart-${chartIndex}-bar-${dataSetName}`}
                                                data={dataSets[dataSetName]}
                                                style={{
                                                    data: {
                                                        fill: chartArray[chartIndex].dataSetNames[dataSetName],
                                                        fillOpacity: 0.5
                                                    }
                                                }}
                                                horizontal={orientation === 'left'}
                                                containerComponent={<VictoryContainer responsive={false}/>}
                                                width={1}

                                            />
                                        );
                                    } else {
                                        return (
                                            <VictoryBar
                                                key={`chart-${chartIndex}-bar-${dataSetName}`}
                                                data={dataSets[dataSetName]}
                                                style={{data: {fillOpacity: 0.5}}}
                                                horizontal={orientation === 'left'}
                                                width={1}
                                                containerComponent={<VictoryContainer responsive={false}/>}

                                            />
                                        );
                                    }

                                })}
                            </VictoryGroup>
                        );
                    }


                    break;
                case 'area':
                    // console.info(Object.keys(chart.dataSetNames));
                    if (chart.mode === 'stacked') {
                        chartComponents.push(
                            <VictoryStack
                                colorScale={chart.colorScale}
                            >

                                {Object.keys(chart.dataSetNames).map((dataSetName) => {
                                    return (
                                        <VictoryGroup
                                            key={`chart-${chartIndex}-area-${dataSetName}`}
                                            data={dataSets[dataSetName]}
                                        >
                                            <VictoryArea
                                                style={{data: {fillOpacity: 0.5}}}
                                            />
                                            <VictoryPortal>
                                                <VictoryScatter

                                                    size={1}
                                                />
                                            </VictoryPortal>
                                        </VictoryGroup>
                                    );
                                })}


                            </VictoryStack>
                        );
                    } else {
                        chartComponents.push(
                            [
                                <VictoryGroup
                                    colorScale={chart.colorScale}
                                >
                                    {Object.keys(chart.dataSetNames).map((dataSetName) => {
                                        return (
                                            <VictoryGroup
                                                key={`chart-${chartIndex}-area-${dataSetName}`}
                                                data={dataSets[dataSetName]}
                                                color={chart.dataSetNames[dataSetName]}
                                            >
                                                <VictoryArea
                                                    style={{data: {fillOpacity: 0.5}}}

                                                />

                                            </VictoryGroup>
                                        );
                                    })}

                                </VictoryGroup>,
                                <VictoryGroup
                                    colorScale={chart.colorScale}
                                >
                                    {Object.keys(chart.dataSetNames).map((dataSetName) => {
                                        return (
                                            <VictoryGroup
                                                key={`chart-${chartIndex}-areaScatter-${dataSetName}`}
                                                data={dataSets[dataSetName]}
                                                color={chart.dataSetNames[dataSetName]}
                                            >
                                                <VictoryScatter
                                                    style={{data: {fillOpacity: 0.5}}}

                                                />

                                            </VictoryGroup>
                                        );
                                    })}

                                </VictoryGroup>
                            ]
                        );
                    }
                    break;
            }
        });


        return (
            <div>
                <VictoryChart
                    width={800}
                    height={400}
                    theme={VictoryTheme.material}
                    container={<VictoryVoronoiContainer/>}
                >
                    {chartComponents}
                </VictoryChart>
            </div>


        );
    }
}

