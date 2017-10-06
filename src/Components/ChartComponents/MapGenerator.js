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

import React from 'react';
import PropTypes from 'prop-types';
import {ComposableMap, ZoomableGroup, Geographies, Geography, Markers, Marker} from 'react-simple-maps';
import {VictoryLegend,VictoryContainer} from 'victory';
import worldMap from './resources/GeoJSON/world.json';
import europeMap from './resources/GeoJSON/europe.json';
import usaMap from './resources/GeoJSON/usa2.json';
import CountryInfo from './resources/GeoJSON/countryInfo.json';
import {feature} from 'topojson-client';
import ReactToolTip from 'react-tooltip';
import {getColorRangeArray} from './helper';
import * as d3 from 'd3';


export default class MapGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.height || 450,
            width: props.width || 800,
            mapData: [],
            markerData: [],
            config: props.config,
            // xIndex: props.metadata.names.indexOf(props.config.x),
            projectionConfig: {},
            mapType: props.config.charts[0].mapType,
            mapDataRange: [],
            colorType: 'linear',
            ordinalColorMap: [],
            colorIndex: 0,
            colorScale: [],
        };

    }

    componentDidMount() {
        // console.info('awa');
        this._handleDataReceived(this.props);

        // console.info(CountryInfo.filter((x)=>x.name==='United States')[0]['alpha-3']);
    }


    componentWillReceiveProps(nextProps) {
        this._handleDataReceived(nextProps);
    }

    componentWillUnmount() {
        this.setState({});
    }


    /**
     * This function converts the country name into
     * Alpha - 3 code in case a whole country name is given
     *
     * @param countryName
     * @returns {*}
     * @private
     */
    _convertCountryNamesToCode(countryName) {
        console.info(countryName);
        if (countryName.length === 3) {
            return countryName;
        } else {
            return CountryInfo.filter((x) => x.name === countryName)[0]['alpha-3'];
        }


    }


    _getLinearColor(value) {

        return d3.scaleLinear().range([this.state.colorScale[0], this.state.colorScale[1]]).domain(this.state.mapDataRange)(value);
    }

    //d3.scaleLinear().range([chart.colorScale[0], chart.colorScale[1]]).domain(this.state.scatterPlotRange)(d.color)

    /**
     * handles the data received by the component to render the map
     * @param props - current props of the component
     * @private
     */
    _handleDataReceived(props) {
        let {metadata, data, config} = props;
        let {projectionConfig, mapType, mapDataRange, mapData, colorType, ordinalColorMap, colorIndex, colorScale} = this.state;
        let mapConfig = config.charts[0];
        // console.info(mapConfig);
        let xIndex = metadata.names.indexOf(config.x);
        let yIndex = metadata.names.indexOf(mapConfig.y);
        colorScale = Array.isArray(mapConfig.colorScale) ? mapConfig.colorScale : getColorRangeArray(mapConfig.colorScale || 'category10');
        // console.info(mapConfig.mapType);
        mapType = mapConfig.mapType;
        switch (mapConfig.mapType) {
            case 'world':
                projectionConfig['scale'] = 120;
                break;
            case 'usa':
                projectionConfig['scale'] = 600;
                projectionConfig['yOffset'] = this.state.height / 1.2;
                projectionConfig['xOffset'] = this.state.width / 0.75;
                break;
            case 'europe':
                projectionConfig['scale'] = 400;
                projectionConfig['yOffset'] = this.state.height;
                // projectionConfig['xOffset'] = this.state.width / 0.75;
                break;
        }
        // console.info(yIndex);
        if (metadata.types[yIndex] === 'linear') {
            colorType = 'linear';
            data.map((datum) => {
                if (mapDataRange.length === 0) {
                    mapDataRange = [datum[yIndex], datum[yIndex]];
                }

                if (mapDataRange[0] > datum[yIndex]) {
                    mapDataRange[0] = datum[yIndex];
                }

                if (mapDataRange[1] < datum[yIndex]) {
                    mapDataRange[1] = datum[yIndex];
                }
                // console.info(this._convertCountryNamesToCode(datum[xIndex]));
                if (mapData.filter((x) => x.x === this._convertCountryNamesToCode(datum[xIndex])).length > 0) {
                    mapData.map((dat, datIndex) => {

                        if (dat.x === this._convertCountryNamesToCode(datum[xIndex])) {

                            mapData[datIndex].y = datum[yIndex];
                        }
                    });
                } else {
                    mapData.push({
                        givenName:datum[xIndex],
                        x: this._convertCountryNamesToCode(datum[xIndex]),
                        y: datum[yIndex]
                    });
                }

            });
        } else {
            colorType = 'ordinal';
            // console.info(data);
            data.map((datum) => {
                if (!ordinalColorMap.hasOwnProperty(datum[yIndex])) {
                    if (colorIndex >= colorScale.length) {
                        colorIndex = 0;
                    }
                    ordinalColorMap[datum[yIndex]] = colorScale[colorIndex];
                }

                mapData.push({
                    x: datum[xIndex],
                    color: datum[yIndex]
                });


            });
        }


        this.setState({
            projectionConfig,
            mapType,
            mapData,
            mapDataRange,
            colorType,
            ordinalColorMap,
            colorIndex,
            colorScale
        });

    }

    render() {
        let {config}=this.props;
        let {mapType, mapData, mapDataRange, colorType, ordinalColorMap} = this.state;
        let mapFeatureData = null;
        // let mapComponents = [];
        // console.info(mapType);

        console.info(mapData);
        switch (mapType) {
            case 'world':
                mapFeatureData = worldMap;
                break;
            case 'usa':
                mapFeatureData = usaMap;
                break;
            case 'europe':
                mapFeatureData = europeMap;
                break;
        }


        return (

            <div style={{overflow: 'hidden'}}>
                <div
                    style={{
                        float: 'left',
                        width: '85%',
                        display: 'inline'
                    }}
                >
                    <ComposableMap
                        projection={'mercator'}
                        projectionConfig={this.state.projectionConfig}
                        width={this.state.width}
                        heght={this.state.height}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                    >

                        <Geographies
                            geographyPaths={feature(mapFeatureData, mapFeatureData.objects[Object.keys(mapFeatureData.objects)[0]]).features}
                            disableOptimization={true}
                        >
                            {
                                (geographies, projection) => {
                                    console.info(geographies);


                                    return geographies.map((geography, i) => {
                                        let dataTip=mapData.filter((x) => x.x === geography.id);
                                        let toolTip=null;

                                        if(dataTip.length>0){
                                            toolTip=''+config.x+' : '+dataTip[0].givenName+', '+config.charts[0].y+' : '+dataTip[0].y;
                                        }

                                        console.info(this._getLinearColor(8.23));
                                        return (
                                            <Geography
                                                key={i}
                                                data-tip={toolTip ? toolTip.toString() : ''}
                                                geography={geography}
                                                projection={projection}
                                                style={{
                                                    default: {
                                                        fill: dataTip.length > 0 ?
                                                                            (colorType === 'linear' ?
                                                                                this._getLinearColor(dataTip[0].y) :
                                                                                ordinalColorMap[dataTip.y]) : '#ddd',
                                                        stroke: '#fff',
                                                        strokeWidth: 0.5,
                                                        outline: 'none'
                                                    },
                                                    hover: {
                                                        fill: dataTip.length > 0 ?
                                                            (colorType === 'linear' ?
                                                                this._getLinearColor(dataTip[0].y) :
                                                                ordinalColorMap[dataTip[0].y]) : '#ddd',
                                                        stroke:'#fff',
                                                        opacity:0.8,
                                                        strokeWidth: 0.5,
                                                        outline: 'none'

                                                    },
                                                    pressed: {
                                                        fill: '#3a79ff',
                                                        outline: 'none'
                                                    }
                                                }}


                                            />);
                                    });
                                }

                            }
                        </Geographies>


                    </ComposableMap>
                    <ReactToolTip/>

                </div>


                <div style={{width: '15%', height: 'auto', display: 'inline', float: 'right'}}>
                    {
                        colorType === 'linear' ?

                            <svg width={'100%'} height={'100%'}>
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset={'0%'} stopColor={this.state.colorScale[0]} stopOpacity={1}/>

                                        <stop offset={'100%'} stopColor={this.state.colorScale[1]} stopOpacity={1}/>
                                    </linearGradient>
                                </defs>
                                <g className='legend'>

                                    <text x={20} y={20}>{config.charts[0].y}</text>
                                    <text x={37} y={37}>{this.state.mapDataRange[1]}</text>
                                    <text x={37} y={132}>{this.state.mapDataRange[0]}</text>
                                    <rect x={20} y={30} fill='url(#grad1)' height={100} width={15}/>
                                </g>

                            </svg>
                            : <VictoryLegend
                                containerComponent={<VictoryContainer responsive={true}/>}
                                height={this.state.height}
                                width={300}
                                title="Legend"
                                style={{title: {fontSize: 25}, labels: {fontSize: 20}}}
                                data={Object.keys(ordinalColorMap).map((name)=>{
                                    return {name:name,symbol:{fill:ordinalColorMap[name]}};
                                })}
                            />

                    }

                </div>
            </div>

        );
    }
}

MapGenerator.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    config: PropTypes.object.isRequired,
    mapData: PropTypes.array,
    metadata: PropTypes.object,
    colorRange: PropTypes.array,
    colorScale: PropTypes.array,
    colorType: PropTypes.string
};