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

export default class MapGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.height || 450,
            width: props.width || 800,
            mapData: [],
            markerData: [],
            config: props.config,

        };
    }

    componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {
        let {metadata, config, data} = this.props;

    }

    render() {

        return (
            <div style={{overflow: 'hidden'}}>

            </div>
        );
    }
}

MapGenerator.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    config: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};