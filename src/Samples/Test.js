import React, {Component} from 'react';
import {VictoryPie} from 'victory';
import MapGenerator from '../Components/ChartComponents/MapGenerator';
import NumberCharts from '../Components/ChartComponents/NumberCharts';

// import Map from '../Components/MapComponents/App';

class Test extends Component {

    constructor(props) {
        super(props);
        this.state={
            data : [
                [0, 10, 1, 'Piston']
            ]
        };
    }


    componentDidMount() {
        setInterval(()=>{
           this.setState({
               data : [
                   [0, Math.round(Math.random()*100), 1, 'Piston']
               ]
           });
        },1000);
    }

    mapConfig = {
        x : 'torque',
        title :'Torque of Engine',
        charts : [{type: 'number'}],
        width: 400,
        height: 200
    };



    metadata = {
        'names' : ['rpm','torque','horsepower', 'EngineType'],
        'types' : ['linear','linear', 'ordinal','ordinal']
    };

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <div className="col-md-6 tile">
                    <NumberCharts config={this.mapConfig} metadata={this.metadata} data={this.state.data}/>
                </div>
            </div>
        );
    }
}

export default Test;