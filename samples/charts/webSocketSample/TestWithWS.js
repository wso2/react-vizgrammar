import React, { Component } from 'react';
import VizG from '../../../src/VizG.jsx';
import GadgetConf from './gadgetConfig.json';
import Axios from 'axios';


class TestWithWS extends Component {
    ws = null;
    lastRowNumber = 0;
    pingInterval = null;
    isWebSocketOpen = false;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            metadata: null,
        };

        this.handleOnMessage = this.handleOnMessage.bind(this);
        this.handleOnError = this.handleOnError.bind(this);
        this._handleOnClose=this._handleOnClose.bind(this);
    }


    // componentWillMount() {
    //     clearInterval(this.pingInterval);
    //     this.ws.onclose = function () { };
    //     this.ws.close();
    // }


    componentDidMount() {
        console.info(GadgetConf['provider-conf']);
        switch (GadgetConf['provider-conf'].providerType) {
            case 'rdbms':
                this.ws = new WebSocket('ws://localhost:8080/data-provider');
                this.ws.onmessage = this.handleOnMessage;
                this.ws.onerror = this.handleOnError;
                this.ws.onclose=this._handleOnClose;
                this.ws.onopen = () => {
                    this.ws.send('rdbms;' + JSON.stringify(GadgetConf['provider-conf'])+';'+this.lastRowNumber);
                    this.isWebSocketOpen = true;
                    
                };
                break;
        }
        let d = new Date;
        let v = d.getMilliseconds();
        console.info(new Date(v.toString));


    }

    handleOnMessage(message) {
        console.info(message.data+'&'+this.lastRowNumber);
        if (message.data.split(';')[0] === 'metadata') {

            console.info(JSON.parse(message.data.split(';')[1]));
            this.setState({
                metadata: JSON.parse(message.data.split(';')[1]),
            });

        }

        if (message.data.split(';')[0] === 'data') {

            this.setState({
                data: JSON.parse(message.data.split(';')[1]),
            });

            this.lastRowNumber = message.data.split(';')[2];

            console.info(this.lastRowNumber);
        }

        if(message.data==='success'){
            this.isWebSocketOpen=true;
        }



    }

    handleOnError() {
        // let req = GadgetConf['provider-conf'];
        // setInterval(() => {
        //     Axios
        //         .post(
        //             'http://localhost:8080/chart-gen-service/poll-db',
        //             req,
        //             {
        //                 headers: { 'Content-Length': 0, 'Content-Type': 'text/plain' },
        //                 responseType: 'text'
        //         }).then((response) => {
        //             console.info(response);
        //         })
        //         .catch((error) => {
        //             console.info(error);
        //         });
        // }, GadgetConf['provider-conf'].pollingInterval);
        console.info('onerror');
    }

    _handleOnClose(evt){
        console.info('onclose');
    }

    render() {
        return (
            <div>
                {
                    this.state.metadata ?
                        <VizG config={GadgetConf['chart-conf']} data={this.state.data} metadata={this.state.metadata} /> :
                        null
                }
            </div>
        );
    }
}

export default TestWithWS;
