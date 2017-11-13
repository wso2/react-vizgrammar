import React, { Component } from 'react';
import { VictoryPortal, VictoryLine, VictoryArea, VictoryBar, VictoryScatter, VictoryLegend } from 'victory';
import { getDefaultColorScale } from './helper';

/**
 * Test class for basic charts
 */
class BasicStuff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            dataBuffer: [],
            dataSets: {},
            chartArray: [],
            initialized: false,
            xDomain: [null, null],
            seriesMinX: null,
            seriesMaxX: null,
        };
    }

    componentDidMount() {
        this.handleAndSortData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.state.config) !== JSON.stringify(nextProps.config)) {
            this.state.config = nextProps.config;
            this.state.initialized = false;
            this.state.chartArray = [];
            this.state.dataSets = {};
            this.state.xDomain = [null, null];
            this.state.seriesMaxX = null;
            this.state.seriesMinX = null;
        }

        this.state.dataBuffer = this.state.dataBuffer.concat(nextProps.data);

        if (this.state.dataBuffer.length > this.state.config.maxLength) {
            this.state.dataBuffer.splice(0, (this.state.dataBuffer.length - this.state.config.maxLength));
        }

        this.handleAndSortData(nextProps);
    }

    handleAndSortData(props) {
        let { config, metadata, data } = this.props;
        let { initialized, chartArray, dataSets, xDomain, seriesMaxX, seriesMinX } = this.state;

        if (!initialized || chartArray.length === 0) {
            chartArray = config.charts.map((chart, chartIndex) => {
                return {
                    type: chart.type,
                    dataSetNames: {},
                    mode: chart.mode,
                    orientation: chart.orientation,
                    colorScale: Array.isArray(chart.colorScale) ? chart.colorScale :
                        getDefaultColorScale(),
                    colorIndex: 0,
                    id: chartArray.length,
                };
            });
        }

        chartArray.forEach(())


        this.setState({ initialized, chartArray, dataSets, xDomain, seriesMaxX, seriesMinX });
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

BasicStuff.propTypes = {

};

export default BasicStuff;
