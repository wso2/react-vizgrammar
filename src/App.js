import React from 'react';
import VizG from './Components/VizG';
import Perf from 'react-addons-perf';
import {Row} from './Samples/util';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [[1, 10, 23, 'piston'], [1, 20, 34, 'rotary']],
            data2: [[1, 10, 23, 'piston']],
            scatterPlot: [
                [1, 41600, 3.5, 79.91, 0.8, 'piston', 0.03],
                [2, 37800, 3.5, 79.65, 1.3, 'rotary', 0.06]],
            timer: 0
        };
    }

    metadata = {
        names: ['rpm', 'torque', 'horsepower', 'EngineType', 'weight'],
        types: ['linear', 'linear', 'linear', 'ordinal', 'linear']
    };


    /*****************[START] Chart Config******************/
    lineChartConfig = {
        x: 'rpm',
        charts: [{type: 'line', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston']}],
        maxLength: 30,
        width: 700,
        height: 450,
        // animation:true
    };

    singleAreaChartConfig = {
        x: 'rpm',
        charts: [{type: 'area', y: 'horsepower', fill: '#2ca02c'}],
        maxLength: 30,
        width: 700,
        height: 450,
        // animation:true
    };

    singleAreaChartConfig2 = {
        x: 'rpm',
        charts: [{type: 'area', y: 'torque',color:'EngineType' }],
        maxLength: 30,
        width: 700,
        height: 450,
        // animation:true
    };

    barChartConfig = {
        x: 'rpm',
        charts: [{type: 'bar', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston']}],
        maxLength: 30,
        width: 700,
        height: 450,
        // animation:true
    };

    scatterPlotConfig = {
        type: 'scatter',
        charts: [
            {
                type: 'scatter',
                x: 'rpm',
                y: 'torque',
                color: 'horsepower',
                size: 'weight',
                maxLength: 30
            }],

        width: 400,
        height: 450
    };

    /*****************[END] Chart Config******************/



    componentDidMount() {
        // Perf.start();
        // setTimeout(() => {
        //     // Perf.stop();
        //     Perf.printWasted();
        //     console.info('haha');
        // }, 60000*5);
        // setTimeout(() => {
        //     // Perf.stop();
        //     Perf.printWasted();
        //     console.info('haha');
        // }, 60000 * 10);
        // setTimeout(() => {
        //     Perf.stop();
        //     Perf.printWasted();
        //     console.info('haha');
        // }, 60000 * 15);

        setInterval(() => {
            // Perf.start();
            let randomY = (this.state.timer+7)*5;
            this.setState({
                data: [
                    [this.state.timer, this.state.timer === 20 ? null : randomY * 2, 10, 'piston'],
                    [this.state.timer, randomY * 3, 10, 'rotary'],

                ],
                data2: [

                    [this.state.timer, randomY * 8, randomY, 'rotary']
                ],
                scatterPlot: [[this.state.timer, randomY * 2, randomY * 3, 'rotary', randomY * 5], [this.state.timer, randomY * 5, randomY * 6, 'rotary', randomY * 9]],
                timer: this.state.timer + 1
            });

        }, 500);
    }

    //<ChartWrapper config={this.areaChartConfig} metadata={this.metadata} data={this.state.data}/>
    render() {
        return (

            <div>
                <center><h1>Charting Config Samples</h1></center>
                <Row media={true} chart={'line'} title={'Line Charts'} actionBar={true}>
                    <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.state.data}/>
                </Row>
                <Row media={true} chart={'line'} title={'Bar Charts'} actionBar={true}>
                    <VizG config={this.barChartConfig} metadata={this.metadata} data={this.state.data}/>
                </Row>
                <Row media={true} chart={'line'} title={'Area Charts'} actionBar={true}>
                    <VizG config={this.singleAreaChartConfig} metadata={this.metadata} data={this.state.data2}/>
                </Row>
                <Row media={true} chart={'line'} title={'Area Charts'} actionBar={true}>
                    <VizG config={this.scatterPlotConfig} metadata={this.metadata} data={this.state.scatterPlot}/>
                </Row>
                {/* <div>
                    <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.state.data}/>
                </div>
                <div>
                    <VizG config={this.barChartConfig} metadata={this.metadata} data={this.state.data}/>
                </div>
                <div>
                    <VizG config={this.singleAreaChartConfig2} metadata={this.metadata} data={this.state.data}/>
                </div> */}


                {/*<Row title="asd" chart="asd"/>*/}
            </div>

        );
    }
}