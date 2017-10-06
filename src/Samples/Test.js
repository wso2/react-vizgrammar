import React, {Component} from 'react';
import {VictoryPie} from 'victory';
import MapGenerator from '../Components/ChartComponents/MapGenerator';

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

    data = [
        ['Afghanistan', 4.23],
        ['EGY', 1.23],
        ['Afghanistan', 2.23],
        ['United States', 8.23]
    ];

    metadata = {
        'names': ['Country', 'Inflation'],
        'types': ['ordinal', 'linear']

    };

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <div className="col-md-6 tile">
                    <MapGenerator
                        config={this.mapConfig}
                        metadata={this.metadata}
                        data={this.data}
                        colorScale={['#403bff', '#2bff4d']}
                        colorType={'linear'}
                    />
                </div>
            </div>
        );
    }
}

export default Test;