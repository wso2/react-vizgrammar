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
import { VictoryLegend, VictoryPortal, VictoryContainer } from 'victory';
import CustomLegend from './CustomLegend';

/**
 * Class to handle the visualization of legends.
 */
export default class LegendComponent extends React.Component {
    render() {
        const { config, height, width, legendItems, interaction, theme } = this.props;
        const maxLegendItems = Math.floor((height - 100) / 25);
        const legendColumns = Math.floor(width / 160);
        return (
            <VictoryPortal>
                <VictoryLegend
                    x={
                        (() => {
                            if (!config.legendOrientation && legendItems.length < maxLegendItems) {
                                return (width - (150 + (config.legendOffset ? config.legendOffset : 0)));
                            } else if (config.legendOrientation === 'right') {
                                return (width - (150 + (config.legendOffset ? config.legendOffset : 0)));
                            } else if (config.legendOrientation === 'left') {
                                return config.legendOffset ? config.legendOffset : 0;
                            } else if (legendItems.length > (maxLegendItems - 1)) {
                                return config.legendOffset ? config.legendOffset : 20;
                            } else return config.legendOffset ? config.legendOffset : 100;
                        })()
                    }
                    y={
                        (() => {
                            if (!config.legendOrientation && legendItems.length < maxLegendItems) return 0;
                            else if (config.legendOrientation === 'top') {
                                return 0;
                            } else if (config.legendOrientation === 'bottom' || legendItems.length >
                                (maxLegendItems - 1)) {
                                return height - (Math.ceil(legendItems.length / legendColumns) * 30);
                            } else return 0;
                        })()
                    }
                    standalone
                    containerComponent={<VictoryContainer responsive />}
                    centerTitle
                    height={height}
                    width={width}
                    orientation={
                        !config.legendOrientation ?
                            (() => {
                                if (legendItems.length > (maxLegendItems - 1) ) {
                                    return 'horizontal';
                                } else {
                                    return 'vertical';
                                }
                            })() :
                            (() => {
                                if (config.legendOrientation === 'left' || config.legendOrientation === 'right') {
                                    return 'vertical';
                                } else {
                                    return 'horizontal';
                                }
                            })()
                    }
                    style={{
                        title: {
                            fontSize: (config.style ? (config.style.legendTitleSize ||
                                theme.legend.style.title.fontSize) : theme.legend.style.title.fontSize),
                            fill: config.style ? config.style.legendTitleColor : theme.legend.style.title.fill,
                        },
                    }}
                    data={legendItems.length > 0 ? legendItems : [{
                        name: 'undefined',
                        symbol: { fill: '#333' },
                    }]}
                    itemsPerRow={config.legendOrientation === 'top' || config.legendOrientation === 'bottom' ||
                        legendItems.length > maxLegendItems ? legendColumns : null}
                    events={[
                        {
                            target: 'data',
                            eventHandlers: {
                                onClick: () => {
                                    return [{ target: 'data', mutation: interaction }];
                                },
                            },
                        },
                    ]}
                    labelComponent={
                        <CustomLegend
                            config={config}
                            theme={theme}
                        />
                    }
                />
            </VictoryPortal>
        );
    }
}
