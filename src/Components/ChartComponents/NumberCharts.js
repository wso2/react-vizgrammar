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

import React from 'react';
import PropTypes from 'prop-types';
import {VictoryLabel } from  'victory';

export default class NumberCharts extends React.Component{
    constructor(props){
        super(props);
        this.state={
            height:props.config.height || 450,
            width:props.config.width || 800,
            value:null,
            prevValue:null
        };
    }


    componentDidMount(){
        this._handleData(this.props);
    }

    componentWillReceiveProps(nextProps){
        this._handleData(nextProps);
    }


    /**
     * handles data received by the props
     * @param props
     * @private
     */
    _handleData(props){
        console.info('awa');
        let {config,data,metadata} = props;
        let {prevValue,value} = this.state;
        let xIndex=metadata.names.indexOf(config.x);


        if(data.length>0){
            prevValue=value;
            value=data[data.length-1][xIndex];
        }

        this.setState({value,prevValue});

    }

    render(){
        let {config} = this.props;
        let {width,height,prevValue,value}=this.state;


        return(
            <svg height={'100%'} width={'100%'} viewBox={`0 0 ${width} ${height}`}>
                <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={width / 2} y={height/5}

                    text={config.title}
                    style={{fontSize: 30}}
                />
                <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={width / 2} y={height / 2}

                    text={(value===null ? value : value.toFixed(2))}
                    style={{fontSize: 45}}
                />

                <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={width / 2} y={(height / 2)+50}

                    text={(prevValue<value? '+':'')+(eval(prevValue-value)*(-1))}
                    style={{fontSize: 15}}
                />
                <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={width / 2} y={(height / 2)+70}

                    text={(prevValue<value? '+':'')+(100*((prevValue-value)/prevValue)*(-1))+'%'}
                    style={{fontSize: 15}}
                />
            </svg>
        );
    }
}


NumberCharts.propTypes={
    config:PropTypes.object.isRequired,
    metadata:PropTypes.object.isRequired,
    data:PropTypes.array
};