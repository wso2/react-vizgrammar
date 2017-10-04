import React, { Component } from 'react';
import {VictoryPie} from 'victory';
import MapGenerator from '../Components/MapGenerator';
// import Map from '../Components/MapComponents/App';

class Test extends Component {

    constructor(props) {
        super(props);

    }
    


    componentDidMount() {

    }

    mapConfig={
        x : 'Country',
        charts : [{type: 'map',  y : 'Inflation',mapType:'usa'}],
        width: 400,
        height: 200
    };

    data=[];

    metadata={};

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <MapGenerator config={this.mapConfig} data={this.data}/>
            </div>
        );
    }
}

export default Test;