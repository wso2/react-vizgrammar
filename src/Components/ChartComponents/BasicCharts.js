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
    VictoryLine,
    VictoryBar,
    VictoryTheme,
    VictoryArea,
    VictoryPortal,
    VictoryTooltip,
    VictoryContainer,
    VictoryVoronoiContainer,
    VictoryLegend,
    VictoryScatter,
    VictoryAxis
} from 'victory';
import PropTypes from 'prop-types';

import {getColorRangeArray} from './helper';


export default class BasicCharts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.height || props.config.height || 450,
            width: props.width || props.config.width || 800,
            dataSets: {},
            chartArray: [],
            initialized: false,
            xScale: 'linear',
            orientation: 'bottom',
        };

        this._handleAndSortData = this._handleAndSortData.bind(this);
    }

    componentDidMount() {
        this._handleAndSortData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._handleAndSortData(nextProps);
    }

    componentWillUnmount() {
        this.setState({});
    }

    /**
     * Handles the sorting of data and populating the dataset
     * @param props
     * @private
     */
    _handleAndSortData(props) {
        let {config, metadata, data} = props;
        let {dataSets, chartArray, initialized, xScale, orientation} = this.state;
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
                    colorScale: Array.isArray(chart.colorScale) ? chart.colorScale : getColorRangeArray(chart.colorScale || 'category10'),
                    colorIndex: 0,

                });


            }


            data.map((datum) => {
                let dataSetName = metadata.names[yIndex];
                if (chart.color) {
                    let colorIndex = metadata.names.indexOf(chart.color);
                    dataSetName = colorIndex > -1 ? datum[colorIndex] : dataSetName;
                }

                dataSets[dataSetName] = dataSets[dataSetName] || [];

                dataSets[dataSetName].push({x: datum[xIndex], y: datum[yIndex]});


                if (dataSets[dataSetName].length > config.maxLength) {

                    dataSets[dataSetName].shift();
                }


                if (!chartArray[chartIndex].dataSetNames.hasOwnProperty(dataSetName)) {
                    if (chartArray[chartIndex].colorIndex >= chartArray[chartIndex].colorScale.length) {
                        chartArray[chartIndex].colorIndex = 0;
                    }

                    if (chart.colorDomain) {
                        let colorIn = chart.colorDomain.indexOf(dataSetName);
                        chartArray[chartIndex].dataSetNames[dataSetName] = colorIn >= 0 ? (colorIn < chartArray[chartIndex].colorScale.length ? chartArray[chartIndex].colorScale[colorIn] : chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++] ) : chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    } else {
                        chartArray[chartIndex].dataSetNames[dataSetName] = chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    }

                    chartArray[chartIndex].dataSetNames[dataSetName] = chart.fill || chartArray[chartIndex].dataSetNames[dataSetName];


                }

            });
        });

        initialized=true;

        this.setState({dataSets, chartArray, initialized, xScale, orientation});

    }


    render() {

        let {config} = this.props;
        let {height, width, chartArray, dataSets, xScale} = this.state;
        let chartComponents = [];
        let legendItems = [];
        let horizontal = false;
        let lineCharts = [];
        let areaCharts = [];
        let barcharts = [];

        chartArray.map((chart, chartIndex) => {
          switch (chart.type){
              case 'line':
                  Object.keys(chart.dataSetNames).map((dataSetName) => {
                      legendItems.push({name: dataSetName, symbol: {fill: chart.dataSetNames[dataSetName]}});
                      lineCharts.push(
                          <VictoryGroup
                              key={`chart-${chartIndex}-${chart.type}-${dataSetName}`}
                              data={dataSets[dataSetName]}
                              color={chart.dataSetNames[dataSetName]}
                          >
                              <VictoryLine/>
                              <VictoryPortal>
                                  <VictoryScatter
                                      labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                      labelComponent={
                                          <VictoryTooltip
                                              orientation='bottom'
                                          />
                                      }
                                      size={(d, a) => {
                                          return a ? 20 : 6;
                                      }}
                                  />
                              </VictoryPortal>
                          </VictoryGroup>
                      );
                  });
                  break;
              case 'area': {
                  let areaLocal = [];
                  Object.keys(chart.dataSetNames).map((dataSetName) => {
                      legendItems.push({name: dataSetName, symbol: {fill: chart.dataSetNames[dataSetName]}});

                      areaLocal.push(
                          <VictoryGroup
                              key={`chart-${chartIndex}-${chart.type}-${dataSetName}`}
                              data={dataSets[dataSetName]}
                              color={chart.dataSetNames[dataSetName]}
                              style={{data: {fillOpacity: 0.5}}}
                          >
                              <VictoryArea/>
                              <VictoryPortal>
                                  <VictoryScatter
                                      labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                      labelComponent={
                                          <VictoryTooltip
                                              orientation='bottom'
                                          />
                                      }
                                      size={(d, a) => {
                                          return a ? 20 : 6;
                                      }}
                                  />
                              </VictoryPortal>
                          </VictoryGroup>
                      );
                  });

                  if (chart.mode === 'stacked') {
                      areaCharts.push(
                          <VictoryStack>
                              {areaLocal}
                          </VictoryStack>
                      );
                  } else {
                      areaCharts = areaCharts.concat(areaLocal);

                  }

                  break;
              }
              case 'bar': {
                  let localBar = [];

                  horizontal = horizontal ? horizontal : chart.orientation === 'left';

                  Object.keys(chart.dataSetNames).map((dataSetName) => {
                      legendItems.push({name: dataSetName, symbol: {fill: chart.dataSetNames[dataSetName]}});
                      localBar.push(
                          <VictoryBar
                              labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                              labelComponent={
                                  <VictoryTooltip
                                      orientation='bottom'
                                  />
                              }
                              data={dataSets[dataSetName]}
                              color={chart.dataSetNames[dataSetName]}

                          />
                      );

                  });

                  if (chart.mode === 'stacked') {
                      barcharts.push(
                          <VictoryStack>
                              {localBar}
                          </VictoryStack>
                      );
                  } else {
                      barcharts = barcharts.concat(localBar);
                  }


                  break;
              }
          }
        });


        if (areaCharts.length > 0) chartComponents = chartComponents.concat(areaCharts);
        if (lineCharts.length > 0) chartComponents = chartComponents.concat(lineCharts);
        if (barcharts.length > 0) {

            let barWidth = (horizontal ? height : width) / (config.maxLength * (barcharts.length>1 ? barcharts.length : 2))-config.maxLength-2;

            chartComponents.push(
                <VictoryGroup
                    horizontal={horizontal}
                    offset={barWidth}
                    style={{data: {width: barWidth}}}
                >
                    {barcharts}
                </VictoryGroup>
            );
        }


        return (
            <div style={{overflow: 'hidden'}}>
                <div style={{float: 'left', width: '80%', display: 'inline'}}>

                    <VictoryChart
                        width={width}
                        height={height}
                        theme={VictoryTheme.material}
                        container={<VictoryVoronoiContainer/>}
                        scale={{ x:{xScale} }}
                    >
                    <VictoryAxis crossAxis
                        style={{axisLabel:{padding:35}}}
                        label={config.x}
                        standalone={false}
                    />
                    <VictoryAxis dependentAxis crossAxis
                        style={{axisLabel:{padding:35}}}
                        label={config.charts.length > 1 ? '' : config.charts[0].y}
                        standalone={false}
                    />
                        {chartComponents}

                    </VictoryChart>


                </div>

                <div style={{width: '20%', display: 'inline', float: 'right'}}>
                    <VictoryLegend
                        containerComponent={<VictoryContainer responsive={true}/>}
                        height={this.state.height}
                        width={300}
                        title="Legend"
                        style={{title: {fontSize: 25}, labels: {fontSize: 20}}}
                        data={legendItems.length > 0 ? legendItems : [{
                            name: 'undefined',
                            symbol: {fill: '#333'}
                        }]}
                    />
                </div>

            </div>
        );
    }
}

BasicCharts.propTypes = {
    data: PropTypes.array,
    config: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};