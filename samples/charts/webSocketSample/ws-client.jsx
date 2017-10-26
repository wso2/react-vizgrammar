import React, { Component } from 'react';
import VizG from '../../../src/VizG.jsx';
import GadgetConfig from './gadgetConfig';
import Axios from 'axios';


class WebSocketClient extends Component {

    websocket = null;
    websocketEndpoint = 'ws://localhost:8080/data-provider';
    pollingEndPoint = null;
    lastRow = 0;
    firstPollingAttempt = false;
    isErrorOccured = false;
    pollingInterval = null;
    isWebsocketAlive = false;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            metadata: null,
        };
        this._wsHandleOnClose = this._wsHandleOnClose.bind(this);
        this._wsHandleOnError = this._wsHandleOnError.bind(this);
        this._wsHandleOnMessage = this._wsHandleOnMessage.bind(this);
    }


    componentDidMount() {
        console.info('awa');
        switch (GadgetConfig['provider-conf'].providerType) {
            case 'rdbms':
                this.pollingEndPoint = 'http://localhost:8080/chart-gen-service/poll-db';
                this._initiateWebSocket();
                break;
        }

        console.info(new Date(1508822226));

        // Axios
        // .post('http://localhost:8080/chart-gen-service/poll-db',JSON.stringify(GadgetConfig['provider-conf'])+';'+this.lastRow)
        // .then((response)=>{
        //     console.info(response);
        // })
        // .catch((error)=>{
        //     console.error(error);
        // });
    }



    /**
     * Initialize and start the websocket
     * 
     */
    _initiateWebSocket() {
        this.websocket = new WebSocket(this.websocketEndpoint);
        this.websocket.onopen = () => {
            this.websocket.send(GadgetConfig['provider-conf'].providerType + ';' + JSON.stringify(GadgetConfig['provider-conf']) + ';' + this.lastRow);
            this.isWebsocketAlive = true;
        };
        this.websocket.onclose = this._wsHandleOnClose;
        this.websocket.onmessage = this._wsHandleOnMessage;
        this.websocket.onerror = this._wsHandleOnError;

    }

    /**
     * initiate a ping message on the endpoint
     */
    _initiatePing() {
        this.websocket = new WebSocket(this.websocketEndpoint);
        this.websocket.onmessage = this._wsHandleOnMessage;
        this.websocket.onopen = () => {
            this.websocket.send('ping');
        };
    }


    /**
     * handle onerror event of the websocket
     * @param error 
     */
    _wsHandleOnError(error) {
        console.error('Error: Cannot connect to Websocket URL:' + error + ' .Hence closing the connection!');
        this.isErrorOccured = true;
        this.isWebsocketAlive = false;
        console.info('onerror');
    }


    /**
     * handle onmessage event of the websocket
     * @param message 
     */
    _wsHandleOnMessage(message) {
        console.info(message);
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

            this.lastRow = message.data.split(';')[2];

            console.info(this.lastRowNumber);
        }

        if (message.data === 'pong') {
            this.isWebsocketAlive = true;
        }

    }

    /**
     * handle on close event of the websocket
     * @param evt 
     */
    _wsHandleOnClose() {

        this._startPolling();

    }

    /**
     * start polling in the case where websocket fails
     */
    _startPolling() {

        this.pollingInterval = setTimeout(() => {
            if (this.isWebsocketAlive) {
                this._stopPolling();
                this._initiateWebSocket();
            } else {
                this._initiatePing();
                let contentType = { headers: { 'Content-Length': 0, 'Content-Type': 'text/plain' }, responseType: 'text' };
                this._initiatePing();
                Axios
                    .post('http://localhost:8080/chart-gen-service/poll-db', JSON.stringify(GadgetConfig['provider-conf']) + ';' + this.lastRow, contentType)
                    .then((response) => {
                        console.info(response);
                        if (!this.state.metadata) {
                            let tmpMeta = JSON.parse(response.split('|')[0].split(';')[1]);
                            this.setState({
                                metadata: tmpMeta
                            });
                        }

                        let data = JSON.parse(response.split('|')[1].split(';')[1]);
                        this.setState({
                            data: data
                        });



                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }, GadgetConfig['provider-conf'].pollingInterval);
    }


    _stopPolling() {
        clearInterval(this.pollingInterval);
    }




    render() {
        return (
            <div>
                {
                    this.state.metadata ?
                        <VizG config={GadgetConfig['chart-conf']} metadata={this.state.metadata} data={this.state.data} /> : null
                }
            </div>
        );
    }
}

export default WebSocketClient;