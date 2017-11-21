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
import LegendItem from './LegendItem.jsx';

export default class Legend extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            legendItems: [
                { name: 'test', symbol: { fill: 'red' } },
                { name: 'test2', symbol: { fill: 'blue' } },
                { name: 'test2', symbol: { fill: 'blue' } },
                { name: 'test2', symbol: { fill: 'blue' } },
                { name: 'test2', symbol: { fill: 'blue' } }
            ] || props.legendItems,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.state.legendItems) !== JSON.stringify(nextProps.legendItems)) {
            this.setState({
                legendItems: nextProps.legendItems,
            });
        }
    }

    render() {
        return (
            <div style={{ width: '100%' }}>
                {
                    this.state.legendItems.map((legendItem) => {
                        return (
                            <LegendItem
                                itemName={legendItem.name}
                                itemColor={legendItem.symbol.fill}
                                itemTextColor={this.props.style ? this.props.style.labels.fill : null}
                                onMouseOver={this.props.onMouseOver}
                                onMouseOut={this.props.onMouseOut}
                                onClick={this.props.onClick}
                                data={this.legendItem}
                                orientation={this.props.orientation || 'top'}
                            />
                        );
                    })
                }
            </div>
        );
    }

}

Legend.defaultProps = {
    legendItems: [],
    style: null,
    onClick: null,
    onMouseOver: null,
    onMouseOut: null,
    orientation: null,
};

Legend.propTypes = {
    legendItems: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        symbol: PropTypes.shape({
            fill: PropTypes.string,
        }),
        chartIndex: PropTypes.number,
    })),
    style: PropTypes.shape({
        labels: PropTypes.shape({
            fill: PropTypes.string,
        }),
    }),
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    orientation: PropTypes.string,
};
