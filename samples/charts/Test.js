import React, { Component } from 'react';

import VizG from '../../src/VizG.jsx';
import InlineCharts from '../../src/components/InlineChart.jsx';

// import Map from '../components/MapComponents/App';

class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                [0, 10, 1, 'Piston']
            ],
            staticDataSet: [],
            timer: 1
        };
    }


    componentDidMount() {
        // setInterval(() => {
        //     this.setState({
        //         data: [[Math.round(Math.random() * 100), Math.round(Math.random() * 100), 1, 'Piston'], [Math.round(Math.random() * 100), Math.round(Math.random() * 100), 1, 'rotary']],
        //         timer: this.state.timer + 1
        //     });
        // }, 1000);


            this.setState({
                staticDataSet: this.state.staticDataSet.concat([[10, 11, 12, 13],
                [11, 15, 12, 13],
                [12, 14, 12, 13],
                [13, 24, 12, 13],
                [14, -6, 12, 13],
                [15, 11, 12, 13],
                [16, 15, 12, 13],
                [17, 14, 12, 13],
                [18, 24, 12, 13],
                [19, 6, 12, 13],
                [20, 11, 12, 13],
                [21, 15, 12, 13],
                [22, 14, 12, 13],
                [23, 24, 12, 13],
                [24, 6, 12, 13],])
            });
    }

    mapConfig = {
        key: 'rpm',
        charts: [{
            type: 'table',
            y: 'torque',
            color: '*',
            columns: ['EngineType', 'torque', 'rpm'],
            columnTitles: ['Engine Type', 'Engine Torque', 'Engine RPM'],
        }
        ],
        maxLength: 7,
        width: 400,
        height: 200
    };


    sparkLineConfig = {
        x: 'rpm',
        charts: [{ type: 'spark-line', y: 'torque', fill: '#0fd8e2' }],
        maxLength: 30,
        width: 100,
        height: 40
        // animation: true
    };

    metadataWithTime = {
        'names': ['rpm', 'torque', 'horsepower', 'EngineType'],
        'types': ['time', 'linear', 'ordinal', 'ordinal']
    };

    dataWithT = [
        [new Date('2017-10-21 00:00:00'), 12, 12, 'piston'],
        [new Date('2017-10-22 00:00:00'), 24, 12, 'piston'],
        [new Date('2017-10-23 00:00:00'), 16, 12, 'piston']
    ];
    metadata = {
        'names': ['rpm', 'torque', 'horsepower', 'EngineType'],
        'types': ['linear', 'linear', 'ordinal', 'ordinal']
    };

    staticDataSet = [


    ];



    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <div className="col-md-6 tile" style={{height:100}}>
                    {/*<VizG config={this.sparkLineConfig} metadata={this.metadata} data={this.state.staticDataSet} />*/}
                    <InlineCharts config={this.sparkLineConfig} metadata={this.metadata} data={this.state.staticDataSet} />
                </div>
            </div>
        );
    }
}

export default Test;