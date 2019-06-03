/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { VictoryLabel, VictoryTooltip } from 'victory';

/**
 * Class to handle the tick label and tooltip.
 */

export default class CustomXaxisLabel extends React.Component {
    constructor(props) {
        super(props);
    }

    trimTickLabel(characterLength, text) {
        if (text.length > characterLength) {
            return text.slice(0, 6) + '...' + text.slice(-(characterLength - 7));
        } else {
            return text;
        }
    }

    static defaultEvents = VictoryTooltip.defaultEvents;
    render() {
        const { config, theme, tickAngle, text } = this.props;
        return (
            <g data-tip={text}>
                <VictoryLabel
                    {...this.props}
                    angle={(config.style && config.style.xAxisTickAngle) ? config.style.xAxisTickAngle : tickAngle}
                    theme={theme}
                    textAnchor={((config.style && config.style.xAxisTickAngle) || tickAngle === 45) ? 'start' : 'middle'}
                    text={this.trimTickLabel(12,text)}
                />
            </g>
        );
    }
}
