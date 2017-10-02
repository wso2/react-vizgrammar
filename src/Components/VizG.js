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
    VictoryVoronoiContainer,
    VictoryLegend,
    VictoryPie,
    VictoryLabel
} from 'victory';
import React from 'react';
import * as d3 from 'd3';
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
            width: props.width || props.config.width || 800,
            height: props.height || props.config.height || 450,
            multiDimensional: false,
            nOfCategories: 1,
            scatterPlotRange:[],
            legend:true,
            chartType:'general',
            randomUpdater:0
        };

        this._sortAndPopulateDataSet = this._sortAndPopulateDataSet.bind(this);

    }


    componentDidMount() {
        console.info('cdm');
        this._sortAndPopulateDataSet(this.props);
    }

    
    componentWillReceiveProps(nextProps) {
        
        this._sortAndPopulateDataSet(nextProps);
    }

    /**
     * generates a data set for the given value
     * @param value for data set should be generated
     * @private
     */
    _getPercentDataForPieChart(value){
        return [{x:'primary',y:value},{x:'secondary',y:100-value}]
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
        let {dataSets, initialized, orientation, randomUpdater, chartArray, legend, xScale, multiDimensional,scatterPlotRange,nOfCategories,chartType} = this.state;

        if (config.charts.length > 1) {
            multiDimensional = true;
        }
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
                        colorScale: Array.isArray(chart.colorScale) ? chart.colorScale : this._getColorRangeArray(chart.colorScale || 'category10'),
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
                    // console.info(yIndex);
                    dataSets[dataSetName].push({x: datum[xIndex], y: datum[yIndex]});

                    // console.info(chart.maxLength);
                    if (dataSets[dataSetName].length > config.maxLength) {
                        // console.info('check');
                        dataSets[dataSetName].shift();
                    }

                    // console.info(chartArray[chartIndex].dataSetNames);
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

                        chartArray[chartIndex].dataSetNames[dataSetName]=chart.fill || chartArray[chartIndex].dataSetNames[dataSetName];


                    }
                    // console.info(chartArray[chartIndex].dataSetNames);
                    nOfCategories=Object.keys(chartArray[chartIndex].dataSetNames).length > nOfCategories ?  Object.keys(chartArray[chartIndex].dataSetNames).length : nOfCategories; 
                    // console.info(nOfCategories);
                });
                // console.info('awa');

            });
        } else if(config.type==='scatter'){
            config.charts.map((chart,chartIndex)=>{
                let xIndex = metadata.names.indexOf(chart.x);
                let yIndex = metadata.names.indexOf(chart.y);
                let colorIndex=metadata.names.indexOf(chart.color);
                let sizeIndex=metadata.names.indexOf(chart.size);

                if (!initialized) {
                    chartArray.push({
                        type: chart.type,
                        dataSetNames: {},
                        colorType: metadata.types[colorIndex],
                        colorScale: Array.isArray(chart.colorScale) ? chart.colorScale : this._getColorRangeArray(chart.colorScale || 'category10'),
                        colorIndex:0
                    });
                }


                if(metadata.types[colorIndex]==='linear'){
                    legend=false;
                    data.map((datum)=>{

                        dataSets['scatterChart'+chartIndex]=dataSets['scatterChart'+chartIndex] || [];
                        dataSets['scatterChart'+chartIndex].push({x:datum[xIndex],y:datum[yIndex],color:datum[colorIndex],amount:datum[sizeIndex]});

                        if (dataSets['scatterChart'+chartIndex].length > chart.maxLength) {
                            // console.info('check');
                            dataSets['scatterChart'+chartIndex].shift();
                        }

                        // console.info(datum[sizeIndex]);
                        
                        if(scatterPlotRange.length===0){
                            scatterPlotRange=[datum[colorIndex],datum[colorIndex]];
                        }else {
                            scatterPlotRange[0]=scatterPlotRange[0]>datum[colorIndex] ? datum[colorIndex] : scatterPlotRange[0]
                            scatterPlotRange[1]=scatterPlotRange[1]<datum[colorIndex] ? datum[colorIndex] : scatterPlotRange[1]
                        }


                        chartArray[chartIndex].dataSetNames['scatterChart'+chartIndex] = chartArray[chartIndex].dataSetNames['scatterChart'+chartIndex] || null;      
                    });
                } else {
                    data.map((datum) => {
                        let dataSetName = 'scatterChart'+chartIndex;
                        if (chart.color) {
                            let colorIndex = metadata.names.indexOf(chart.color);
                            dataSetName = colorIndex > -1 ? datum[colorIndex] : dataSetName;
                        }
    
                        dataSets[dataSetName] = dataSets[dataSetName] || [];
                        // console.info(yIndex);
                        dataSets[dataSetName].push({x: datum[xIndex], y: datum[yIndex], amount:datum[sizeIndex]});
    
                        // console.info(chart.maxLength);
                        if (dataSets[dataSetName].length > config.maxLength) {
                            // console.info('check');
                            dataSets[dataSetName].shift();
                        }
    
                        // console.info(chartArray[chartIndex].dataSetNames);
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
    
                            // chartArray[chartIndex].dataSetNames[dataSetName]=chart.fill || chartArray[chartIndex].dataSetNames[dataSetName];
    
    
                        }
    
                    });
                }
            });
        } else {
            if(config.charts[0].type==='arc'){
                chartType='arc';
                //TODO: pie charts
                let arcConfig=config.charts[0];
                let xIndex=metadata.names.indexOf(arcConfig.x);
                let colorIndex=metadata.names.indexOf(arcConfig.color);
                if(!config.percentage){
                    
                    if (!initialized) {
                        chartArray.push({
                            type: arcConfig.type,
                            dataSetNames: {},
                            mode: arcConfig.mode,
                            colorScale: Array.isArray(arcConfig.colorScale) ? arcConfig.colorScale : this._getColorRangeArray(arcConfig.colorScale || 'category10'),
                            colorIndex: 0,
    
                        });                        
                    }

                    data.map((datum)=>{
                        randomUpdater++;
                        let dataSetName=datum[colorIndex];

                        if(dataSets[dataSetName]){
                            dataSets[dataSetName].y+=datum[xIndex];
                            
                        }else {
                            chartArray[0].colorIndex= chartArray[0].colorIndex>=chartArray[0].colorScale.length ? 0 : chartArray[0].colorIndex;
                            if(arcConfig.colorDomain){
                                let colorDomIndex=arcConfig.colorDomain.indexOf(dataSetName);

                                if(colorDomIndex>-1 && colorDomIndex<chartArray[0].colorScale.length ){
                                    dataSets[dataSetName]={x:dataSetName,y:datum[xIndex],fill:chartArray[0].colorScale[colorDomIndex]};
                                    chartArray[0].dataSetNames[dataSetName]=chartArray[0].colorIndex++;
                                }else {
                                    dataSets[dataSetName]={x:dataSetName,y:datum[xIndex],fill:chartArray[0].colorScale[chartArray[0].colorIndex]};
                                }

                            }else {
                                dataSets[dataSetName]={x:dataSetName,y:datum[xIndex],fill:chartArray[0].colorScale[chartArray[0].colorIndex]};
                            }

                            if(!chartArray[0].dataSetNames[dataSetName]){
                                chartArray[0].dataSetNames[dataSetName]=chartArray[0].colorScale[chartArray[0].colorIndex++];
                            }

                        } 
                    });
                } else {
                    chartType='percentage';
                    legend=false;
                    if (!initialized) {
                        chartArray.push({
                            type: arcConfig.type,
                            colorScale: Array.isArray(arcConfig.colorScale) ? arcConfig.colorScale : this._getColorRangeArray(arcConfig.colorScale || 'category10'),
                        });

                    }

                    data.map((datum)=>{
                        dataSets=this._getPercentDataForPieChart(datum[xIndex]);
                    });
                }             
            } else{
                //TODO: Table data set
                chartType='table';
            }
        }



        initialized = true;

        this.setState({
            dataSets: dataSets,
            chartArray: chartArray,
            xScale: xScale,
            orientation: orientation,
            initialized: initialized,
            multiDimensional: multiDimensional,
            scatterPlotRange:scatterPlotRange,
            nOfCategories:nOfCategories,
            legend:legend,
            chartType:chartType,
            randomUpdater:randomUpdater
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
        return scaleLinear().domain(domain).range(range)(value);
    }

    
    render() {
        let {metadata, config} = this.props;
        let {chartArray, dataSets, orientation, randomUpdater, xScale, multiDimensional, width, height,legend,chartType} = this.state;
        let chartComponents = [];
        let legendItems = [];
        let horizontal=false;
        let lineCharts = [];
        let areaCharts = [];
        let barcharts = [];
        console.info('hj');
        chartArray.map((chart, chartIndex) => {
            


            switch (chart.type) {
                case 'line':
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });
                        lineCharts.push(
                            <VictoryGroup
                                key={`chart-${chartIndex}-${chart.type}-${dataSetName}`}
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                            >
                                <VictoryLine/>
                                <VictoryPortal>
                                    <VictoryScatter 
                                        labels={(d)=> `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation='bottom'
                                            />
                                        }
                                        size={(d, a) => {return a ? 20 : 6;}}
                                    />
                                </VictoryPortal>
                            </VictoryGroup>
                        );
                    });
                    break;

                case 'area': {
                    let areaLocal = [];
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });

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
                                        labels={(d)=> `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation='bottom'
                                            />
                                        }
                                        size={(d, a) => {return a ? 20 : 6;}}
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

                    horizontal=horizontal ? horizontal : chart.orientation==='left';
                    
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });
                        localBar.push(
                            <VictoryBar
                                labels={(d)=> `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
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
                case 'scatter':
                    if(chart.colorType==='linear'){
                        Object.keys(chart.dataSetNames).map((dataSetName)=>{
                            chartComponents.push(
                                <VictoryScatter
                                    bubbleProperty='amount'
                                    maxBubbleSize={20}
                                    minBubbleSize={5}
                                    style={{data:{fill:(d)=>{
                                        {/* console.info(d3.scaleLinear().range(['#FFFFDD', '#3E9583', '#1F2D86']).domain(this.state.scatterPlotRange)(d.color)); */}
                                        return d3.scaleLinear().range([chart.colorScale[0],chart.colorScale[1]]).domain(this.state.scatterPlotRange)(d.color);
                                    }}}}
                                    data={dataSets[dataSetName]}
                                    labels={(d)=> `${config.charts[chartIndex].x}:${d.x}\n
                                                   ${config.charts[chartIndex].y}:${d.y}\n
                                                   ${config.charts[chartIndex].size}:${d.amount}
                                                   ${config.charts[chartIndex].color}:${d.color}`}
                                    labelComponent={
                                        <VictoryTooltip
                                            orientation='bottom'
                                        />
                                    }

                                />
                            );
                        });
                    } else {
                        Object.keys(chart.dataSetNames).map((dataSetName)=>{
                            chartComponents.push(
                                <VictoryScatter
                                    bubbleProperty='amount'
                                    maxBubbleSize={20}
                                    minBubbleSize={5}
                                    style={{data:{fill:chart.dataSetNames[dataSetName]}}}
                                    data={dataSets[dataSetName]}
                                    labels={(d)=> `${config.charts[chartIndex].x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}\n${config.charts[chartIndex].size}:${d.amount}\n${config.charts[chartIndex].color}:${d.color}`}
                                    labelComponent={
                                        <VictoryTooltip
                                            orientation='bottom'
                                        />
                                    }

                                />
                            );
                        });
                    }

                    break;
                
                case 'arc':{

                    let pieChartData=[];
                    let total=0;
                    if(chartType!=='percentage'){
                        Object.keys(chart.dataSetNames).map((dataSetName)=>{
                            // console.info(chart.dataSetNames[dataSetName]);
                            legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });
                            total+=dataSets[dataSetName].y;
                            pieChartData.push(dataSets[dataSetName]);
                        });
                    }

                    chartComponents.push(
                        <svg width='100%' height={'100%'} viewBox={`0 0 ${height} ${width}`}>
                            <VictoryPie
                                height={height}
                                width={width}
                                colorScale={chart.colorScale}
                                data={chartType==='percentage'? dataSets : pieChartData}
                                labelComponent={<VictoryTooltip width={50} height={25} />}
                                labels={chartType==='percentage'? null : (d)=>`${d.x} : ${(d.y/total)*100}%`}
                                style={{labels:{fontSize:9}}}
                                labelRadius={10}
                                innerRadius={chart.mode==='donut' || chartType==='percentage' ? height/2.5 : 0}
                                randomUpdater={randomUpdater}
                            />
                            {
                                chartType==='percentage'?
                                    <VictoryLabel
                                        textAnchor="middle" verticalAnchor="middle"
                                        x={height/2} y={width/2}
                                        text={`${Math.round(dataSets[0].y)}%`}
                                        style={{ fontSize: 45 }}
                                    />:null
                            }
                        </svg>
                    );
                    // console.info(pieChartData);
                    // console.info(chartComponents);
                    break;
                }


            }


            
            // chartComponents.concat(areaCharts);
            // chartComponents.concat(lineCharts);
            // chartComponents.push(<VictoryGroup/>)
        });

        if (areaCharts.length > 0) chartComponents = chartComponents.concat(areaCharts);
        if (lineCharts.length > 0) chartComponents = chartComponents.concat(lineCharts);
        if (barcharts.length > 0) {
            // console.info('bar length',barcharts.length);
            let barWidth = (horizontal ? width : height) / (config.maxLength * barcharts.length);
            // if(!horizontal) console.info(barWidth);
            // if(multiDimensional) console.info(barcharts);
            chartComponents.push(
                <VictoryGroup
                    horizontal={horizontal}
                    offset={barWidth<0 ? 1 : barWidth > 2 ? barWidth - 2 : barWidth}
                    style={{data: {width: barWidth < 0 ? 1 : barWidth > 2 ? barWidth - 2 : barWidth}}}
                >
                    {barcharts}
                </VictoryGroup>
            );
        }
        // console.info(legendItems);

        return (
            <div style={{overflow: 'hidden'}}>
                <div style={{float: 'left', width: legend ? '80%':'100%', display:'inline'}}>
                    {
                        chartType==='general' ?
                            <VictoryChart
                                width={800}
                                height={400}
                                theme={VictoryTheme.material}
                                container={<VictoryVoronoiContainer/>}
                            >
                                {chartComponents}

                            </VictoryChart>:
                            chartComponents

                    }
                </div>
                {
                    legend ?
                    <div style={{width: '20%', display:'inline',float:'right'}}>
                        <VictoryLegend
                            containerComponent={<VictoryContainer responsive={true}/>}
                            height={this.state.height}
                            width={300}
                            title="Legend"
                            style={{title: {fontSize: 25 },labels:{fontSize:20}}}
                            data={legendItems.length>0 ? legendItems : [{name:'undefined', symbol:{fill:'#333'}}]}
                        />
                    </div>:
                    null
                }
            </div>


        );
    }
}


VizG.propTypes = {
    config: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    metadata: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};
