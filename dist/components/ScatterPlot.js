'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _victory = require('victory');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _d = require('d3');

var _BaseChart2 = require('./BaseChart');

var _BaseChart3 = _interopRequireDefault(_BaseChart2);

var _VizGError = require('../VizGError');

var _VizGError2 = _interopRequireDefault(_VizGError);

var _ChartContainer = require('./ChartContainer');

var _ChartContainer2 = _interopRequireDefault(_ChartContainer);

var _LegendComponent = require('./LegendComponent');

var _LegendComponent2 = _interopRequireDefault(_LegendComponent);

var _victoryLightTheme = require('./resources/themes/victoryLightTheme');

var _victoryLightTheme2 = _interopRequireDefault(_victoryLightTheme);

var _victoryDarkTheme = require('./resources/themes/victoryDarkTheme');

var _victoryDarkTheme2 = _interopRequireDefault(_victoryDarkTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WSO2 Inc. licenses this file to you under the Apache License,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Version 2.0 (the "License"); you may not use this file except
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * software distributed under the License is distributed on an
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * KIND, either express or implied.  See the License for the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * specific language governing permissions and limitations
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Class to handle visualization of scatter plots.
 */
var ScatterPlot = function (_BaseChart) {
    _inherits(ScatterPlot, _BaseChart);

    function ScatterPlot(props) {
        _classCallCheck(this, ScatterPlot);

        var _this = _possibleConstructorReturn(this, (ScatterPlot.__proto__ || Object.getPrototypeOf(ScatterPlot)).call(this, props));

        _this.state = {
            dataSets: {},
            chartArray: [],
            xScale: 'linear',
            yDomain: [0, 1], // Range of y axis
            xDomain: [0, 1], // Range of x axis values
            isOrdinal: false, // x Axsis Ordinality
            domainPadding: 50
        };

        _this.sortDataBasedOnConfig = _this.sortDataBasedOnConfig.bind(_this);
        _this.handleMouseClickEvent = _this.handleMouseClickEvent.bind(_this);
        return _this;
    }

    _createClass(ScatterPlot, [{
        key: 'sortDataBasedOnConfig',
        value: function sortDataBasedOnConfig(props) {
            var config = props.config,
                data = props.data,
                metadata = props.metadata;
            var _state = this.state,
                dataSets = _state.dataSets,
                chartArray = _state.chartArray,
                xScale = _state.xScale,
                yDomain = _state.yDomain,
                xDomain = _state.xDomain,
                isOrdinal = _state.isOrdinal;

            if (chartArray.length === 0) chartArray = _BaseChart3.default.generateChartArray(config.charts);

            chartArray.forEach(function (chart, i) {
                var xIndex = _lodash2.default.indexOf(metadata.names, chart.x);
                var yIndex = _lodash2.default.indexOf(metadata.names, chart.y);
                var sizeIndex = _lodash2.default.indexOf(metadata.names, chart.size);
                var colorIndex = _lodash2.default.indexOf(metadata.names, chart.colorCategoryName);

                xScale = _BaseChart3.default.getXScale(metadata.types[xIndex]);
                if (xIndex === -1) throw new _VizGError2.default('ScatterPlot', 'x axis name \'' + chart.x + '\' is not found among metadata.');
                if (yIndex === -1) throw new _VizGError2.default('ScatterPlot', 'y axis name \'' + chart.y + '\' is not found among metadata.');
                if (chart.colorCategoryName && colorIndex === -1) throw new _VizGError2.default('ScatterPlot', 'color dimension name \'' + chart.colorCategoryName + '\' is not found among metadata.');
                if (chart.size && sizeIndex === -1) throw new _VizGError2.default('ScatterPlot', 'Size dimension name \'' + chart.size + '\' not found among metadata');

                // Forming the dataSet by mapping the dataset
                dataSets[chart.y] = dataSets[chart.y] || [];
                var dataSet = data.map(function (datum) {
                    return {
                        x: datum[xIndex],
                        y: datum[yIndex],
                        color: datum[colorIndex],
                        amount: datum[sizeIndex],
                        chartIndex: i
                    };
                });

                // DataSet would not be added to DataSets if DataSets already include that.
                if (_lodash2.default.isEmpty(dataSets) || !_lodash2.default.isEqual(_lodash2.default.sortBy(dataSets[chart.y]), _lodash2.default.sortBy(dataSet))) {
                    dataSet.forEach(function (element) {
                        dataSets[chart.y].push(element);
                    });
                }
                if (chart.colorCategoryName && metadata.types[colorIndex] === 'ordinal') {
                    var distinctColorValues = _lodash2.default.uniq(dataSet.map(function (record) {
                        return record.color;
                    }));
                    _lodash2.default.difference(distinctColorValues, _lodash2.default.keys(chart.dataSetNames)).forEach(function (key) {
                        var colorDomIn = _lodash2.default.indexOf(chart.colorDomain, key);
                        if (chart.colorIndex >= chart.colorScale.length) {
                            chart.colorIndex = 0;
                        }
                        if (colorDomIn < 0) {
                            chart.dataSetNames[key] = chart.colorScale[chart.colorIndex++];
                        } else if (colorDomIn > chart.colorScale.length) {
                            chart.dataSetNames[key] = chart.colorScale[0];
                        } else {
                            chart.dataSetNames[key] = chart.colorScale[colorDomIn];
                        }
                    });
                    if (_lodash2.default.isEmpty(dataSets)) {
                        _lodash2.default.mergeWith(dataSets, dataSet, function (objValue, srcValue) {
                            if (_lodash2.default.isArray(objValue)) {
                                return objValue.concat(srcValue);
                            }
                        });
                    }
                } else {
                    chart.dataSetNames[chart.y] = chart.colorScale[0];
                }
                if (config.charts[chart.id].maxLength) {
                    var maxLength = config.charts[chart.id].maxLength;
                    _lodash2.default.keys(chart.dataSetNames).forEach(function (key) {
                        var lengthDiff = dataSets[key].length - maxLength;
                        dataSets[key].splice(0, lengthDiff);
                    });
                }
                /**
                 * Setting up y range
                 * Fix Reason - if there are only one y value in the chart,
                 *  it will make the y axis tick points contain decimal values
                 */
                if (metadata.types[yIndex] === 'linear') {
                    var yRange = { min: null, max: null };
                    Object.values(dataSets).forEach(function (dataSetElement, index) {
                        var yValueSet = dataSetElement.map(function (val) {
                            return val.y;
                        });
                        if (index === 0) {
                            yRange.min = _lodash2.default.min(yValueSet);
                            yRange.max = _lodash2.default.max(yValueSet);
                        } else {
                            yRange.min = _lodash2.default.min([yRange.min, _lodash2.default.min(yValueSet)]);
                            yRange.max = _lodash2.default.max([yRange.max, _lodash2.default.max(yValueSet)]);
                        }
                        yDomain = [yRange.min, yRange.max];
                        if (yRange.min === yRange.max) {
                            yDomain = [yRange.min - yRange.min / 2, yRange.max + yRange.max / 2];
                        }
                    });
                }
                /**
                 * Setting up x range
                 * Fix Reason - if there are only one x value in the chart it will make the y axis tick points contain decimal values
                 */
                if (metadata.types[xIndex] === 'linear') {
                    var xRange = { min: null, max: null };
                    Object.values(dataSets).forEach(function (dataSetElement, i) {
                        var xValueSet = dataSetElement.map(function (val) {
                            return val.x;
                        });
                        if (i === 0) {
                            xRange.min = _lodash2.default.min(xValueSet);
                            xRange.max = _lodash2.default.max(xValueSet);
                        } else {
                            xRange.min = _lodash2.default.min([xRange.min, _lodash2.default.min(xValueSet)]);
                            xRange.max = _lodash2.default.max([xRange.max, _lodash2.default.max(xValueSet)]);
                        }
                        xDomain = [xRange.min, xRange.max];
                        if (xRange.min === xRange.max) {
                            xDomain = [xRange.min - xRange.min / 2, xRange.max + xRange.max / 2];
                        }
                    });
                } else {
                    xDomain = null;
                }

                // checking whether x Axis contain ordinal data
                isOrdinal = metadata.types[xIndex] === 'ordinal';
            });

            this.setState({ chartArray: chartArray, dataSets: dataSets, xScale: xScale, yDomain: yDomain, xDomain: xDomain, isOrdinal: isOrdinal });
        }
    }, {
        key: 'trimLegendLabel',
        value: function trimLegendLabel(characterLength, text) {
            if (text) {
                if (text.length > characterLength) {
                    return text.slice(0, 6) + '...' + text.slice(-(characterLength - 7));
                } else {
                    return text + new Array(16 - text.length).join(' ');
                }
            }
        }
    }, {
        key: 'handleMouseClickEvent',
        value: function handleMouseClickEvent(props) {
            var onClick = this.props.onClick;


            var chartInfo = this.state.chartArray[props.datum.chartIndex];

            var data = {};

            data[chartInfo.x] = props.datum.x;
            data[chartInfo.y] = props.datum.y;
            data.colorCategory = props.datum.color;
            data.size = props.datum.amount;

            return onClick && onClick(data);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                config = _props.config,
                metadata = _props.metadata,
                theme = _props.theme,
                width = _props.width,
                height = _props.height;
            var _state2 = this.state,
                chartArray = _state2.chartArray,
                dataSets = _state2.dataSets,
                xScale = _state2.xScale,
                isOrdinal = _state2.isOrdinal;

            var chartComponents = [];
            var legendComponents = [];
            var currentTheme = theme === 'light' ? _victoryLightTheme2.default : _victoryDarkTheme2.default;

            chartArray.forEach(function (chart) {
                var colorIndex = _lodash2.default.indexOf(metadata.names, chart.colorCategoryName);

                _lodash2.default.keys(dataSets).forEach(function (key) {
                    /**
                     * Adding a null record if scatter plot dataset contains single data
                     *
                     * #Fix For - If the a dataset contain single record Victory has an issue,
                     * which is not being able to compare two values in the dataset
                     *
                     */
                    if (_lodash2.default.uniq(dataSets[key].map(function (record) {
                        return record.amount;
                    })).length === 1) {
                        if (isOrdinal) {
                            var changedRecord = _extends({}, dataSets[key][0]);
                            changedRecord.amount = null;
                            dataSets[key].unshift(changedRecord);
                        } else {
                            dataSets[key].unshift({ x: null, y: null, color: null, amount: null });
                        }
                    }
                    // Adding Legend records
                    _lodash2.default.keys(chart.dataSetNames).forEach(function (colorColumn) {
                        legendComponents.push({
                            name: _this2.trimLegendLabel(16, colorColumn),
                            fullName: colorColumn,
                            symbol: { fill: chart.dataSetNames[colorColumn] }
                        });
                    });
                    chartComponents.push(_react2.default.createElement(_victory.VictoryScatter, {
                        key: 'scatter-plot-' + chart.id,
                        data: dataSets[key],
                        bubbleProperty: 'amount',
                        maxBubbleSize: 15,
                        minBubbleSize: 5,
                        style: {
                            data: {
                                fill: function () {
                                    if (colorIndex > -1 && metadata.types[colorIndex] === 'linear') {
                                        return function (d) {
                                            return (0, _d.scaleLinear)().range([chart.colorScale[0], chart.colorScale[1]]).domain([_lodash2.default.min(dataSets[key].map(function (obj) {
                                                return obj.color;
                                            })), _lodash2.default.max(dataSets[key].map(function (obj) {
                                                return obj.color;
                                            }))])(d.color);
                                        };
                                    } else if (colorIndex > -1) {
                                        return function (d) {
                                            return chart.dataSetNames[d.color];
                                        };
                                    } else {
                                        return null;
                                    }
                                }()
                            }
                        },
                        labels: function labels(d) {
                            var text = config.charts[chart.id].x + ' : ' + d.x + '\n' + (config.charts[chart.id].y + ' : ' + d.y + '\n');
                            if (config.charts[chart.id].size) {
                                text += config.charts[chart.id].size + ' : ' + d.amount + '\n';
                            }

                            if (config.charts[chart.id].color) {
                                text += config.charts[chart.id].color + ' : ' + d.color;
                            }

                            return text;
                        },
                        labelComponent: _react2.default.createElement(_victory.VictoryTooltip, {
                            orientation: 'top',
                            pointerLength: 4,
                            cornerRadius: 2,
                            flyoutStyle: {
                                fill: currentTheme.tooltip.style.flyout.fill,
                                fillOpacity: currentTheme.tooltip.style.flyout.fillOpacity,
                                strokeWidth: currentTheme.tooltip.style.flyout.strokeWidth
                            },
                            style: { fill: currentTheme.tooltip.style.labels.fill }
                        }),
                        events: [{
                            target: 'data',
                            eventHandlers: {
                                onClick: function onClick() {
                                    return [{ target: 'data', mutation: function mutation(props) {
                                            return _this2.handleMouseClickEvent(props);
                                        } }];
                                }
                            }
                        }],
                        animate: config.animate ? { onEnter: { duration: 100 } } : null
                    }));
                });
            });

            var legendColumns = Math.floor(width / 160);
            var maxLegendItems = Math.floor((height - 100) / 25);
            var legendOffset = config.legend === true && legendComponents.length > maxLegendItems ? Math.ceil(legendComponents.length / legendColumns) * 30 + 50 : 50;

            return _react2.default.createElement(
                _ChartContainer2.default,
                {
                    width: this.props.width || width || 800,
                    height: this.props.height || height || 800,
                    config: config,
                    xScale: xScale,
                    yDomain: this.state.yDomain,
                    xDomain: this.state.xDomain,
                    dataSets: dataSets,
                    theme: theme,
                    isOrdinal: this.state.isOrdinal,
                    domainPadding: this.state.domainPadding,
                    legendOffset: legendOffset,
                    legendItems: legendComponents
                },
                chartComponents,
                config.legend ? _react2.default.createElement(_LegendComponent2.default, {
                    height: height,
                    width: width,
                    legendItems: legendComponents,
                    interaction: function interaction() {},
                    config: config
                }) : null
            );
        }
    }]);

    return ScatterPlot;
}(_BaseChart3.default);

exports.default = ScatterPlot;