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
 * Class to handle the legend label and tooltip.
 */

export default class CustomLegend extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultEvents = VictoryTooltip.defaultEvents;
    render() {
        const { config, theme, datum } = this.props;
        return (
            <g data-tip={datum.initialName}>
                <VictoryLabel
                    {...this.props}
                    style={{
                        fontSize: config.style ? (config.style.legendTextSize ||
                            theme.legend.style.labels.fontSize) : theme.legend.style.labels.fontSize,
                        fill: config.style ? config.style.legendTextColor : theme.legend.style.labels.fill,
                    }}
                />
            </g>
        );
    }
}
