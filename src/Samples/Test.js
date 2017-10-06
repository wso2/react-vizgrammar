import React, {Component} from 'react';
import {VictoryPie} from 'victory';
import MapGenerator from '../Components/MapGenerator';

// import Map from '../Components/MapComponents/App';

class Test extends Component {

    constructor(props) {
        super(props);

    }


    componentDidMount() {

    }

    mapConfig = {
        x: 'Country',
        charts: [{type: 'map', y: 'Inflation', mapType: 'world'}],
        width: 400,
        height: 200
    };

    data = [];

    metadata = {};

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <div className="col-md-6 tile">
                    <MapGenerator
                        config={this.mapConfig}
                        colorScale={['#403bff', '#2bff4d']}
                        colorType={'linear'}
                    />
                </div>
            </div>
        );
    }
}

export default Test;