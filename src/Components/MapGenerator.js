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
import {ComposableMap, ZoomableGroup, Geographies, Geography} from 'react-simple-maps';
import worldMap from './resources/GeoJSON/world.json';
import europeMap from './resources/GeoJSON/europe.json';
import usaMap from './resources/GeoJSON/usa2.json';
import {feature} from 'topojson-client';

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
            mapType: props.config.charts[0].mapType
        };
    }

    componentDidMount() {
        console.info('awa');
        this._handleDataReceived(this.props);
    }


    componentWillReceiveProps(nextProps) {
        this._handleDataReceived(nextProps);
    }

    componentWillUnmount() {
        this.setState({});
    }


    /**
     * handles the data received by the component to render the map
     * @param props - current props of the component
     * @private
     */
    _handleDataReceived(props) {
        let {metadata, data, config} = props;
        let mapConfig = config.charts[0];
        let {projectionConfig, mapType} = this.state;
        console.info(mapConfig.mapType);
        mapType = mapConfig.mapType;
        switch (mapConfig.mapType) {
            case 'world':
                projectionConfig['scale'] = 120;
                break;
            case 'usa':
                projectionConfig['scale']=600;
                projectionConfig['yOffset']=this.state.height/1.2;
                projectionConfig['xOffset']=this.state.width/0.75;
                break;
            case 'europe':
                projectionConfig['scale']=120;
                break;
        }


        this.setState({projectionConfig, mapType});

    }

    render() {
        let {mapType} = this.state;
        let mapFeatureData=null;
        let mapComponents=[];
        console.info(mapType);
        switch (mapType){
            case 'world':
                mapFeatureData=worldMap;
                break;
            case 'usa':
                mapFeatureData=usaMap;
                break;
            case 'europe':
                mapFeatureData=worldMap;
                break;
        }

        mapComponents.push(

        );


        return (

                <ComposableMap
                    projection={'mercator'}
                    projectionConfig={this.state.projectionConfig}
                    width={this.state.width}
                    heght={this.state.height}
                    style={{
                        width:'100%',
                        height:'100%'
                    }}
                >
                    {
                        mapType==='europe' ?
                            <ZoomableGroup
                                center={[25.106111,62.5775]}
                                zoom={3}
                            >
                                <Geographies
                                    geographyPaths={feature(mapFeatureData,mapFeatureData.objects[Object.keys(mapFeatureData.objects)[0]]).features}
                                    disableOptimization={true}
                                >
                                    {
                                        (geographies,projection)=>{
                                            console.info(geographies);

                                            return geographies.map((geography,i)=>(
                                                <Geography
                                                    key={i}
                                                    geography={geography}
                                                    projection={projection}
                                                    style={{
                                                        default:{
                                                            fill:'#ddd',
                                                            stroke:'#fff',
                                                            strokeWidth:0.5,
                                                            outline:'none'
                                                        },
                                                        hover:{
                                                            fill:'#fbff79',

                                                            strokeWidth:0.5,
                                                            outline:'none'

                                                        },
                                                        pressed:{
                                                            fill:'#3a79ff',
                                                            outline:'none'
                                                        }
                                                    }}


                                                />
                                            ));
                                        }

                                    }
                                </Geographies>
                            </ZoomableGroup> :
                            <Geographies
                                geographyPaths={feature(mapFeatureData,mapFeatureData.objects[Object.keys(mapFeatureData.objects)[0]]).features}
                                disableOptimization={true}
                            >
                                {
                                    (geographies,projection)=>{
                                        console.info(geographies);

                                        return geographies.map((geography,i)=>(
                                            <Geography
                                                key={i}
                                                geography={geography}
                                                projection={projection}
                                                style={{
                                                    default:{
                                                        fill:'#ddd',
                                                        stroke:'#fff',
                                                        strokeWidth:0.5,
                                                        outline:'none'
                                                    },
                                                    hover:{
                                                        fill:'#fbff79',

                                                        strokeWidth:0.5,
                                                        outline:'none'

                                                    },
                                                    pressed:{
                                                        fill:'#3a79ff',
                                                        outline:'none'
                                                    }
                                                }}


                                            />
                                        ));
                                    }

                                }
                            </Geographies>
                    }
                </ComposableMap>

        );
    }
}

MapGenerator.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    config: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    metadata: PropTypes.object
};