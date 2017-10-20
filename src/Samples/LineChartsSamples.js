import React from 'react';
import { Row } from './util';
import './css/Table.css';
import VizG from '../Components/VizG';
import { VictoryLine } from 'victory';
// import t from 'GridTest';


export default class LineChartConfigSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [[1, 10, 23, 'piston'], [1, 20, 34, 'rotary']],
            data2: [[1, 10, 23, 'piston']],
            timer: 0
        };
    }

    interval_id = null;

    metadata = {
        names: ['rpm', 'torque', 'horsepower', 'EngineType', 'weight'],
        types: ['linear', 'linear', 'linear', 'ordinal', 'linear']
    };


    /*****************[START] Chart Config******************/
    lineChartConfig = {
        x: 'rpm',
        charts: [{ type: 'line', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston'] }],
        maxLength: 7,
        width: 700,
        height: 450,
        // animation: true
    };

    singleLineChartConfig = {
        x: 'rpm',
        charts: [{ type: 'line', y: 'horsepower', fill: '#2ca02c' }, { type: 'line', y: 'torque', fill: '#ff7f0e' }],
        maxLength: 7,
        width: 700,
        height: 450,
        // animation: true
    };

    sparkLineConfig = {
        x: 'rpm',
        charts: [{ type: 'spark-line', y: 'horsepower', fill: '#0fd8e2' }],
        maxLength: 7,
        width: 120,
        height: 10,
        // animation: true
    };

    /*****************[END] Chart Config******************/


    componentDidMount() {
        this.interval_id = setInterval(() => {
            this.setState({
                data: [
                    [this.state.timer, this.state.timer === 20 ? null : Math.random() * 100, 10, 'piston'],
                    [this.state.timer, Math.random() * 100, 10, 'rotary']
                ],
                data2: [

                    [this.state.timer, Math.random() * 100, Math.random() * 100, 'rotary']
                ],
                timer: this.state.timer + 1
            });

        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
    }

    render() {
        return (
            <div>
                <center><h1>Line Chart Config Samples</h1></center>
                <Row title="Group MultiLine Chart Sample" chart="line" media={true} actionBar={false}>
                    <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.state.data} />
                    <br /><br />
                    <div style={{ display: 'block' }}>
                        <pre>
                            {'{\n' +
                                '\tx: \'rpm\',\n' +
                                '\tcharts: [\n\t    { type: \'line\', y: \'torque\', color: \'EngineType\',colorDomain:[\'\',\'\',\'piston\']}\n\t],\n' +
                                '\tmaxLength: 7,\n' +
                                '\twidth: 700,\n' +
                                '\theight: 450,\n' +
                                '\tanimation:true\n}'

                            }
                        </pre>
                    </div>
                </Row>
                <Row title="Multi Line Chart Sample" chart="line" media={true} actionBar={false}>
                    <VizG config={this.singleLineChartConfig} metadata={this.metadata} data={this.state.data2} />
                    <br />
                    <div>
                        <pre>
                            {'{\n' +
                                '\tx: \'rpm\',\n' +
                                '\tcharts: [\n\t    { type: \'line\', y: \'horsepower\', fill:\'#2ca02c\'}\n\t    { type: \'line\', y: \'torque\', fill:\'#ff7f0e\'}\n\t],\n' +
                                '\tmaxLength: 7,\n' +
                                '\twidth: 700,\n' +
                                '\theight: 450,\n' +
                                '\tanimation:true\n}'

                            }
                        </pre>
                    </div>
                </Row>


                <Row title="Sample Data Set" chart="line">
                    <div>
                        <pre>
                            {
                                'metadata = {\n' +
                                '\tnames: [\'rpm\', \'torque\', \'horsepower\', \'EngineType\'],\n' +
                                '\ttypes: [\'linear\', \'linear\', \'linear\', \'ordinal\']\n' +
                                '};\n' +
                                '\ndata = [[1, 10, 23, \'piston\'], [1, 20, 34, \'rotary\']];'
                            }
                        </pre>
                    </div>
                </Row>
                <Row title="API" chart="line">
                    <div>
                        <pre>
                            <p>Main Properties</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Property</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                    </tr>
                                    <tr>
                                        <td>blah</td>
                                        <td>blah</td>
                                        <td>


                                            <span>
                                            <VizG config={this.sparkLineConfig} metadata={this.metadata} data={this.state.data2} />
                                            </span>



                                        </td>
                                    </tr>
                                    <tr>
                                        <td>x</td>
                                        <td>string</td>
                                        <td>independent axis</td>
                                    </tr>
                                    <tr>
                                        <td>charts</td>
                                        <td>array(Object)</td>
                                        <td>Charts to be plotted</td>
                                    </tr>
                                    <tr>
                                        <td>maxLength</td>
                                        <td>int</td>
                                        <td>Maximum length of the dataSet displayed</td>
                                    </tr>
                                    <tr>
                                        <td>height</td>
                                        <td>int</td>
                                        <td>Height of the chart in pixels</td>
                                    </tr>
                                </tbody>

                            </table>
                            <br />
                            <p>Chart Object Properties</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Property</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                    </tr>
                                    <tr>
                                        <td>type</td>
                                        <td>string</td>
                                        <td>type of the chart required (line)</td>
                                    </tr>
                                    <tr>
                                        <td>y</td>
                                        <td>string</td>
                                        <td>dependent axis</td>
                                    </tr>
                                    <tr>
                                        <td>color</td>
                                        <td>string</td>
                                        <td>attribute name for color categorization</td>
                                    </tr>
                                    <tr>
                                        <td>mode</td>
                                        <td>string</td>
                                        <td>type of the line curve (see <a href="https://github.com/d3/d3-shape#curves">d3-documentation</a> for possible curve types)</td>
                                    </tr>
                                    <tr>
                                        <td>colorScale</td>
                                        <td>string | Array(string)</td>
                                        <td>color set to use in the charts for predefined colors check <a
                                            href="https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#categorical-colors">d3-documentation</a></td>
                                    </tr>
                                    <tr>
                                        <td>colorDomain</td>
                                        <td>Array(string)</td>
                                        <td>if a certain category is required to be plotted in a certain color</td>
                                    </tr>
                                </tbody>
                            </table>
                        </pre>
                    </div>
                </Row>
            </div>
        );
    }
}
