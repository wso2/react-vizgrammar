import React, {Component} from 'react';
import {VictoryPie} from 'victory';
import MapGenerator from '../Components/ChartComponents/MapGenerator';
import NumberCharts from '../Components/ChartComponents/NumberCharts';
import TableCharts from '../Components/ChartComponents/TableCharts';
import MapChartConfigSample from "./MapChartConfigSample";
import {Row} from '../Samples/util';

// import Map from '../Components/MapComponents/App';

class Test extends Component {

    constructor(props) {
        super(props);
        this.state={
            data : [
                ["Afghanistan",4.23],
                ["EGY",1.23],
                ["Afghanistan",2.23],
                ["United States",8.23]
            ],
            timer:1
        };
    }


    componentDidMount() {

    }

    mapConfig = {
        x : 'Country',
        charts : [{type: 'map',  y : 'Inflation',mapType:'world'}],
        width: 400,
        height: 200
    };



    metadata = {
        'names' : ['Country','Inflation'],
        'types' : ['ordinal','linear']
    };

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <Row title="Group MultiLine Chart Sample" chart="line" media={true} actionBar={false}>
                    <MapGenerator config={this.mapConfig} metadata={this.metadata} data={this.state.data}/>
                </Row>
            </div>
        );
    }
}

export default Test;