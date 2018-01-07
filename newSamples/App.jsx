import React from 'react';
import { AppBar, Toolbar, Typography, Grid } from 'material-ui';
import ChartWrapper from './ChartWrapper';
import VizG from '../src/VizG';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            index: 0,
            scatterPlot: [],
            mapData: [
                ['Afghanistan', 4.23],
                ['EGY', 1.23],
                ['Afghanistan', 2.23],
                ['United States', 10.23],
                ['Albania', 3.23],
                ['United Kingdom', 7],
                ['Australia', 5],
                ['Ireland', 1],
                ['RUS', 15],
            ],
        };
        this.intervalObject = null;
        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'EngineType', 'weight'],
            types: ['linear', 'linear', 'linear', 'ordinal', 'linear'],
        };

        this.mapMetadata = {
            names: ['Country', 'Inflation'],
            types: ['ordinal', 'linear'],
        };

        this.mapConfig = {
            x: 'Country',
            charts: [{ type: 'map', y: 'Inflation', mapType: 'world' }],
            width: 400,
            height: 200,
        };

        this.lineChartConfig = {
            x: 'rpm',
            charts: [{ y: 'torque', color: 'EngineType', type: 'line' }],
            legend: true,
            maxLength: 30,
        };
        this.areaChartConfig = {
            x: 'rpm',
            charts: [{ y: 'torque', color: 'EngineType', type: 'area' }],
            legend: true,
            maxLength: 30,
        };
        this.barChartConfig = {
            x: 'rpm',
            charts: [{ y: 'torque', color: 'EngineType', type: 'bar' }],
            legend: true,
            maxLength: 30,
        };
        this.scatterPlotConfig = {
            type: 'scatter',
            charts: [
                {
                    type: 'scatter',
                    x: 'rpm',
                    y: 'torque',
                    color: 'horsepower',
                    size: 'weight',
                    maxLength: 30,
                }],

            width: 800,
            height: 450,
        };

        this.numConfig = {
            x: 'torque',
            title: 'Torque of Engine',
            charts: [{ type: 'number' }],
            width: 400,
            height: 200,
        };
    }

    componentDidMount() {
        this.intervalObject = setInterval(() => {
            this.setState({
                data: [
                    [this.state.index, Math.random() * 100, 10, 'piston'],
                    [this.state.index, Math.random() * 100, 10, 'rotary'],
                ],
                scatterPlot: [
                    [this.state.timer, Math.random() * 100, Math.random(), 'rotary', Math.random()],
                    [this.state.timer, Math.random() * 100, Math.random(), 'rotary', Math.random()],
                ],
                index: this.state.index + 1,
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalObject);
    }

    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar >
                        <Typography type="title" color="inherit" >
                            React-VizGrammar
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={24} >
                    <Grid item xs={6}>
                        <ChartWrapper
                            media
                            chart={'line'}
                            title={'Line Charts'}
                            actionBar
                        >
                            <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.state.data} />
                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={6}>
                        <ChartWrapper
                            media
                            chart={'area'}
                            title={'Area Charts'}
                            actionBar
                        >
                            <VizG config={this.areaChartConfig} metadata={this.metadata} data={this.state.data} />
                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={6}>
                        <ChartWrapper
                            media
                            chart={'bar'}
                            title={'Bar Charts'}
                            actionBar
                        >
                            <VizG config={this.barChartConfig} metadata={this.metadata} data={this.state.data} />
                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={6} >
                        <ChartWrapper
                            media
                            chart={'scatter'}
                            title={'Scatter Charts'}
                            actionBar
                        >
                            <VizG
                                config={this.scatterPlotConfig}
                                metadata={this.metadata}
                                data={this.state.scatterPlot}
                                height={360}
                            />
                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={6} >
                        <ChartWrapper
                            media
                            chart={'map'}
                            title={'Map Charts'}
                            actionBar
                        >
                            <VizG config={this.mapConfig} metadata={this.mapMetadata} data={this.state.mapData} />
                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={6} >
                        <ChartWrapper
                            media
                            chart={'number'}
                            title={'Number Charts'}
                            actionBar
                        >
                            <VizG config={this.numConfig} metadata={this.metadata} data={this.state.data} />
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
