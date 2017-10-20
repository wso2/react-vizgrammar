import React, { Component } from 'react';
import { VictoryLine, VictoryArea, VictoryGroup,  VictoryBar,  VictoryTooltip, VictoryStack } from 'victory';
import { getColorRangeArray } from './helper';
import PropTypes from 'prop-types';

class InlineChartsBasic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: props.height || props.config.height || 450,
            width: props.width || props.config.width || 800,
            dataSets: {},
            chartArray: [],
            initialized: false,
            xScale: 'linear',
            orientation: 'bottom',
        };

        this._handleAndSortData = this._handleAndSortData.bind(this);
    }


    componentDidMount() {
        this._handleAndSortData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._handleAndSortData(nextProps);
    }

    /**
     * populate data and render the chart
     * @param props
     */
    _handleAndSortData(props) {
        let { config, metadata, data } = props;
        let { dataSets, chartArray, initialized, xScale, orientation } = this.state;
        let xIndex = metadata.names.indexOf(config.x);
        xScale = metadata.types[xIndex] === 'time' ? 'time' : xScale;
        config.charts.map((chart, chartIndex) => {
            orientation = orientation === 'left' ? orientation : (chart.orientation || 'bottom');

            let yIndex = metadata.names.indexOf(chart.y);
            if (!initialized) {
                chartArray.push({
                    type: chart.type,
                    dataSetNames: {},
                    mode: chart.mode,
                    orientation: chart.orientation,
                    colorScale: Array.isArray(chart.colorScale) ? chart.colorScale : getColorRangeArray(chart.colorScale || 'category10'),
                    colorIndex: 0,

                });


            }


            data.map((datum) => {
                let dataSetName = metadata.names[yIndex];
                if (chart.color) {
                    let colorIndex = metadata.names.indexOf(chart.color);
                    dataSetName = colorIndex > -1 ? datum[colorIndex] : dataSetName;
                }

                dataSets[dataSetName] = dataSets[dataSetName] || [];

                dataSets[dataSetName].push({ x: datum[xIndex], y: datum[yIndex] });


                if (dataSets[dataSetName].length > config.maxLength) {

                    dataSets[dataSetName].shift();
                }


                if (!chartArray[chartIndex].dataSetNames.hasOwnProperty(dataSetName)) {
                    if (chartArray[chartIndex].colorIndex >= chartArray[chartIndex].colorScale.length) {
                        chartArray[chartIndex].colorIndex = 0;
                    }

                    if (chart.colorDomain) {
                        let colorIn = chart.colorDomain.indexOf(dataSetName);
                        chartArray[chartIndex].dataSetNames[dataSetName] = colorIn >= 0 ? (colorIn < chartArray[chartIndex].colorScale.length ? chartArray[chartIndex].colorScale[colorIn] : chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++]) : chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    } else {
                        chartArray[chartIndex].dataSetNames[dataSetName] = chartArray[chartIndex].colorScale[chartArray[chartIndex].colorIndex++];
                    }

                    chartArray[chartIndex].dataSetNames[dataSetName] = chart.fill || chartArray[chartIndex].dataSetNames[dataSetName];


                }

            });
        });

        initialized = true;

        this.setState({ dataSets, chartArray, initialized, xScale, orientation });
    }

    render() {

        let { config } = this.props;
        let { height, width, chartArray, dataSets} = this.state;
        let chartComponents = [];
        let legendItems = [];
        let horizontal = false;
        let lineCharts = [];
        let areaCharts = [];
        let barcharts = [];

        chartArray.map((chart, chartIndex) => {
            switch (chart.type) {
                case 'spark-line':
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });
                        lineCharts.push(
                            <VictoryGroup
                                key={`chart-${chartIndex}-${chart.type}-${dataSetName}`}
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                                height={height}
                                width={width}
                                padding={0}
                                style={{ data: { strokeWidth: 0.5 } }}

                            >
                                <VictoryLine />
                                {/* <VictoryPortal>
                                    <VictoryScatter
                                        labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation='bottom'
                                            />
                                        }
                                        size={(d, a) => {
                                            return a ? 20 : 6;
                                        }}
                                    />
                                </VictoryPortal> */}
                            </VictoryGroup>
                        );
                    });
                    break;
                case 'spark-area': {
                    let areaLocal = [];
                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });

                        areaLocal.push(
                            <VictoryGroup
                                key={`chart-${chartIndex}-${chart.type}-${dataSetName}`}
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                                style={{ data: { fillOpacity: 0.5, strokeWidth: 0.5 } }}
                                height={height}
                                width={width}
                                padding={0}

                            >
                                <VictoryArea />
                                {/* <VictoryPortal>
                                    <VictoryScatter
                                        labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation='bottom'
                                            />
                                        }
                                        size={(d, a) => {
                                            return a ? 20 : 6;
                                        }}
                                    />
                                </VictoryPortal> */}
                            </VictoryGroup>
                        );
                    });

                    if (chart.mode === 'stacked') {
                        areaCharts.push(
                            <VictoryStack
                                height={height}
                                width={width}
                                padding={0}
                            >
                                {areaLocal}
                            </VictoryStack>
                        );
                    } else {
                        areaCharts = areaCharts.concat(areaLocal);

                    }

                    break;
                }
                case 'spark-bar': {
                    let localBar = [];

                    horizontal = horizontal ? horizontal : chart.orientation === 'left';

                    Object.keys(chart.dataSetNames).map((dataSetName) => {
                        legendItems.push({ name: dataSetName, symbol: { fill: chart.dataSetNames[dataSetName] } });
                        localBar.push(
                            <VictoryBar
                                labels={(d) => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
                                labelComponent={
                                    <VictoryTooltip
                                        orientation='bottom'
                                    />
                                }
                                data={dataSets[dataSetName]}
                                color={chart.dataSetNames[dataSetName]}
                                height={height}
                                width={width}
                                padding={0}
                            />
                        );

                    });

                    if (chart.mode === 'stacked') {
                        barcharts.push(
                            <VictoryStack
                                height={height}
                                width={width}
                                padding={0}
                            >
                                {localBar}
                            </VictoryStack>
                        );
                    } else {
                        barcharts = barcharts.concat(localBar);
                    }


                    break;
                }
            }
        });


        if (areaCharts.length > 0) chartComponents = chartComponents.concat(areaCharts);
        if (lineCharts.length > 0) chartComponents = chartComponents.concat(lineCharts);
        if (barcharts.length > 0) {

            let barWidth = (horizontal ? height : width) / (config.maxLength * (barcharts.length > 1 ? barcharts.length : 2)) - 3;

            chartComponents.push(
                <VictoryGroup
                    horizontal={horizontal}
                    offset={barWidth}
                    style={{ data: { width: barWidth } }}
                    height={height}
                    width={width}
                    padding={5}
                >
                    {barcharts}
                </VictoryGroup>
            );
        }


        return (
            <div>{chartComponents}</div>
        );
    }
}

InlineChartsBasic.propTypes = {
    data: PropTypes.array,
    config: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};


export default InlineChartsBasic;
