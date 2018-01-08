import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Grid } from 'material-ui';
import VizG from 'react-vizgrammar';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.css';
import '../styles/snippet-highlight.css';
import ChartWrapper from '../ChartWrapper';


export default class LineChartSamples extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data2: [],
            timer: 0,
        };

        this.interval_id = null;
        this.metadata = {
            names: ['rpm', 'torque', 'horsepower', 'EngineType'],
            types: ['linear', 'linear', 'linear', 'ordinal'],
        };
        this.lineChartConfig = {
            x: 'rpm',
            charts: [{ type: 'line', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston'] }],
            maxLength: 7,
            legend: true,
        };

        this.singleLineChartConfig = {
            x: 'rpm',
            charts: [
                { type: 'line', y: 'horsepower', fill: '#2ca02c' },
                { type: 'line', y: 'torque', fill: '#ff7f0e' },
            ],
            maxLength: 7,
            legend: true,
        };
    }

    componentDidMount() {
        this.interval_id = setInterval(() => {
            this.setState({
                data: [
                    [this.state.timer, this.state.timer === 20 ? null : Math.random() * 100, 10, 'piston'],
                    [this.state.timer, Math.random() * 100, 10, 'rotary'],
                ],
                data2: [
                    [this.state.timer, Math.random() * 100, Math.random() * 100, 'rotary'],
                ],
                timer: this.state.timer + 1,
            });
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
    }

    syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar >
                        <Typography type="title" color="inherit" >
                            React-VizGrammar - Line Chart Samples
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container>
                    <Grid item xs={6} >
                        <ChartWrapper title="Group MultiLine Chart Sample" chart="line" media actionBar={false}>
                            <div style={{ height: 450 }}>
                                <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.state.data} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={
                                        { __html: this.syntaxHighlight(JSON.stringify(this.lineChartConfig, undefined, 4)) }
                                    }
                                />
                            </div>

                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={6} >
                        <ChartWrapper title="Group MultiLine Chart Sample" chart="line" media actionBar={false}>
                            <div style={{ height: 450 }}>
                                <VizG config={this.singleLineChartConfig} metadata={this.metadata} data={this.state.data2} />
                            </div>
                            <div>
                                <br /><br />
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: this.syntaxHighlight(JSON.stringify(this.singleLineChartConfig, undefined, 4)),
                                    }}
                                />
                            </div>

                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={6} >
                        <ChartWrapper title="Sample Data set" chart="line" media actionBar={false}>
                            <div>
                                metadata :
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: this.syntaxHighlight(JSON.stringify(this.metadata, undefined, 4)),
                                    }}
                                />
                                <br />
                                data :
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: this.syntaxHighlight(JSON.stringify(this.state.data, undefined, 4)),
                                    }}
                                />
                            </div>

                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={6} >
                        <ChartWrapper title="Chart JSON structure" chart="line" media actionBar={false}>
                            <Tree
                                showLine
                                defaultExpandAll
                                showIcon={false}
                            >
                                <TreeNode title="Chart Config">
                                    <TreeNode title="x - Independant Axis of the Chart" />
                                    <TreeNode title="charts - Array containing chart objects.">
                                        <TreeNode title="Chart Object">
                                            <TreeNode isLeaf  title="type - type of the chart in this case 'line'" />
                                            <TreeNode isLeaf title="y - dependant axis of the Line chart" />
                                            <TreeNode isLeaf title="color - Data field by which the color categorization should be done" />
                                            <TreeNode isLeaf title="colorScale - Array of colors in Hex format that will be used to plot the chart" />
                                            <TreeNode isLeaf title="colorDomain - If a certain category needs to be plotted in a certain color it can be declared in </br>this array and it will be plotted in the requried color" />
                                        </TreeNode>
                                        <TreeNode title="..." />
                                    </TreeNode>

                                </TreeNode>
                            </Tree>
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
