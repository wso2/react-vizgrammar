import React, {Component} from 'react';
import {VictoryPie} from 'victory';
import MapGenerator from '../Components/ChartComponents/MapGenerator';
import NumberCharts from '../Components/ChartComponents/NumberCharts';
import TableCharts from "../Components/ChartComponents/TableCharts";

// import Map from '../Components/MapComponents/App';

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



    metadata = {
        'names' : ['rpm','torque','horsepower', 'EngineType'],
        'types' : ['linear','linear', 'ordinal','ordinal']
    };

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <div className="col-md-6 tile">
                    <TableCharts config={this.mapConfig} metadata={this.metadata} data={this.state.data}/>
                </div>
            </div>
        );
    }
}

export default Test;