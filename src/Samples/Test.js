import React, {Component} from 'react';
import {VictoryPie} from 'victory';
import MapGenerator from '../components/ChartComponents/MapGenerator';
import NumberCharts from '../components/ChartComponents/NumberCharts';
import TableCharts from '../components/ChartComponents/TableCharts';
import VizG from '../components/VizG';

// import Map from '../components/MapComponents/App';

class Test extends Component {

    constructor(props) {
        super(props);
        this.state={
            data : [
                [0, 10, 1, 'Piston']
            ],
            timer:1
        };
    }


    componentDidMount() {
        setInterval(()=>{
           this.setState({
               data : [[Math.round(Math.random()*100), Math.round(Math.random()*100), 1, 'Piston'],[Math.round(Math.random()*100), Math.round(Math.random()*100), 1, 'rotary']]   ,
               timer: this.state.timer+1
           });
        },1000);
    }

    mapConfig = {
        key : 'rpm',
        charts : [{ type: 'table',
            y : 'torque',
            color: '*',
            columns:['EngineType',  'torque', 'rpm'],
            columnTitles:['Engine Type',  'Engine Torque', 'Engine RPM'],
            }
        ],
        maxLength: 7,
        width: 400,
        height: 200
    };


    sparkLineConfig = {
        x: 'rpm',
        charts: [{ type: 'line', y: 'torque', fill: '#0fd8e2' }],
        maxLength: 7,
        width: 800,
        height: 400,
        // animation: true
    };

    metadataWithTime = {
        'names' : ['rpm','torque','horsepower', 'EngineType'],
        'types' : ['time','linear', 'ordinal','ordinal']
    };

    dataWithT=[
        [new Date('2017-10-21 00:00:00'),12,12,'piston'],
        [new Date('2017-10-22 00:00:00'),24,12,'piston'],
        [new Date('2017-10-23 00:00:00'),16,12,'piston']
    ]
    metadata = {
        'names' : ['rpm','torque','horsepower', 'EngineType'],
        'types' : ['linear','linear', 'ordinal','ordinal']
    };

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <div className="col-md-6 tile">
                    <VizG config={this.sparkLineConfig} metadata={this.metadataWithTime} data={this.dataWithT}/>
                </div>
            </div>
        );
    }
}

export default Test;