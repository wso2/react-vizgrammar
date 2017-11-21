/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import PropTypes from 'prop-types';
import { VictoryLegend, VictoryContainer } from 'victory';

export default class Legend extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ width: '20%', display: 'inline', float: 'right' }}>
                <VictoryLegend
                    containerComponent={<VictoryContainer responsive />}
                    height={this.state.height}
                    width={300}
                    title="Legend"
                    style={{
                        title: { fontSize: 25, fill: config.legendTitleColor },
                        labels: { fontSize: 20, fill: config.legendTextColor },
                    }}
                    data={legendItems.length > 0 ? legendItems : [{
                        name: 'undefined',
                        symbol: { fill: '#333' },
                    }]}
                    events={[
                        {
                            target: 'data',
                            eventHandlers: {
                                onClick: config.interactiveLegend ? () => { // TODO: update doc with the attribute
                                    return [
                                        {
                                            target: 'data',
                                            mutation: (props) => {
                                                console.info(props.index);

                                                const ignoreIndex = ignoreArray
                                                    .map(d => d.name)
                                                    .indexOf(props.datum.name);
                                                if (ignoreIndex > -1) {
                                                    ignoreArray.splice(ignoreIndex, 1);
                                                } else {
                                                    ignoreArray.push({ name: props.datum.name });
                                                }
                                                console.info(ignoreArray);
                                                this.setState({
                                                    ignoreArray,
                                                });
                                            },
                                        }, {
                                            target: 'labels',
                                            mutation: (props) => {
                                                const fill = props.style && props.style.fill;
                                                return fill === 'grey' ? null : { style: { fill: 'grey' } };
                                            },
                                        },
                                    ];
                                } : null,
                            },
                        },
                    ]}
                />
            </div>
        );
    }
}
