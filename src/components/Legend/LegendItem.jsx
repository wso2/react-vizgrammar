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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LegendItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            itemColor: props.itemColor,
            itemName: props.itemName,
            itemTextColor: props.itemTextColor,
            data: props.data,
        };
        this._onMouseClick = this._onMouseClick.bind(this);
        this._onMouseOver = this._onMouseOver.bind(this);
        this.onMouseOver = this._onMouseOver.bind(this);
    }

    /**
     * Handle Mouse click events
     * @param {*} evt Mouse Click event
     */
    _onMouseClick(evt) {
        evt.persist();
        const { data } = this.state;
        return this.props.onClick && this.props.onClick(data, evt);
    }

    _onMouseOver(evt) {
        return this.props.onMouseOver && this.props.onMouseOver(evt);
    }

    _onMouseOut(evt) {
        return this.props.onMouseOut && this.props.onMouseOut(evt);
    }


    render() {
        return (
            <div
                onClick={this._onMouseClick}
                onMouseOver={this.props.onMouseOver}
                onMouseOut={this.props.onMouseOut}
                style={{
                    paddingLeft: 9,
                    paddingRight: 10,
                    display: this.props.orientation === 'top' || this.props.orientation === 'bottom' ?
                                                            'inline-block' : null,
                }}
            >
                <span
                    style={{
                        background: this.state.disabled ? '#dcdcdc' : this.state.itemColor,
                        display: 'inline-block',
                        height: 10,
                        verticalAlign: 'middle',
                        width: 14,
                    }}
                />
                <span
                    style={{
                        marginLeft: 10,
                        color: this.state.itemTextColor,
                    }}
                >
                    {this.state.itemName}
                </span>
            </div>
        );
    }
}

LegendItem.defaultProps = {
    onClick: null,
    onMouseOver: null,
    onMouseOut: null,
    itemTextColor: '#000',
    orientation: null,
};

LegendItem.propTypes = {
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    itemName: PropTypes.string.isRequired,
    itemColor: PropTypes.string.isRequired,
    itemTextColor: PropTypes.string,
    orientation: PropTypes.string,
};
