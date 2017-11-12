/*
 *  Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

import React, { Component } from 'react';

import GadgetConf from './gadgetConfig.json';
import VizG from '../../../src/VizG.jsx';

export default class LatestShipmentsLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            metadata: {
                names:['name','amount','date'],
                types:['ordinal','linear','linear']
            },
            messageData: {
                data:[]
            },
            date:new Date()
        };

        this.counter = 0;

        // this.handleResize = this.handleResize.bind(this);

        // this.props.glContainer.on('resize', this.handleResize);
        this.ws = null;

        this.config = {
            'x': 'date',
            'charts': [
                {
                    'type': 'line',
                    'y': 'amount',
                    'color': 'name'
                }
            ],
            'maxLength': 30,
            'height': 450,
            'width': 800,
            xAxisTickAngle: -30,
            tickLabelColor:'#777'
        };
    }

    componentDidMount() {
        console.info(GadgetConf['provider-conf']);
        switch (GadgetConf['provider-conf'].providerType) {
            case 'rdbms':
                this.ws = new WebSocket('ws://localhost:9290/data-provider/rdbms');
                this.ws.onerror = () => console.info('Connection interrupted!');
                this.ws.onclose = () => console.info('Connection closed!');
                this.ws.onopen = () => {
                    this.ws.send(JSON.stringify(GadgetConf['provider-conf']));
                };
                this.ws.onmessage = (message) => {
                    console.log(JSON.parse(message.data));
                    let dataSet = JSON.parse(message.data);

                    if (dataSet.data.length !== this.state.messageData.data.length) {
                        // let metadata = dataSet.metadata;
                        let sentData = dataSet.data;

                        for (let i = 0; i < this.state.messageData.data.length; i++) {
                            sentData.shift();
                        }                       
                    
                        let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                        let d=days[this.state.date.getDay()]+' '+this.state.date.getDate();
                        sentData=sentData.map(e=>e.concat([d]));
                        let date=this.state.date;
                        this.setState({
                            data: sentData,
                            messageData: JSON.parse(message.data),
                            date:date.setDate(date.getDate()+1)
                        });


                    }
                };

                break;
        }
    }

    render() {
        return (
            <section>
                {
                    this.state.metadata ?
                        <VizG
                            config={this.config}
                            data={this.state.data}
                            metadata={this.state.metadata}
                        /> : null
                }
            </section>
        );
    }

    // handleResize() {
    //     this.setState({width: this.props.glContainer.width, height: this.props.glContainer.height});
    // }
}

