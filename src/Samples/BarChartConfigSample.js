import React from 'react';
import {Row} from './util';
import './css/Table.css';
import VizG from '../components/VizG';
// import t from 'GridTest';


export default class BarChartConfigSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [[1, 10, 23, 'piston'], [1, 20, 34, 'rotary']],
            data2: [[1, 10, 23, 'piston']],
            timer: 0
        };
    }

    metadata = {
        names: ['rpm', 'torque', 'horsepower', 'EngineType'],
        types: ['linear', 'linear', 'linear', 'ordinal']
    };


    interval_id=null;

    /*****************[START] Chart Config******************/
    barChartConfig = {
        x: 'rpm',
        charts: [{type: 'bar', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston']}],
        maxLength: 20,
        width: 700,
        height: 450,

    };

    barHorizontalChartConfig = {
        x: 'rpm',
        charts: [{type: 'bar', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston'], orientation: 'left'}],
        maxLength: 20,
        width: 700,
        height: 450,
        // animation: false
    };

    stackedBarChartConfig = {
        x: 'rpm',
        charts: [{type: 'bar', y: 'torque', color: 'EngineType', colorDomain: ['', '', 'piston'], mode: 'stacked'}],
        maxLength: 20,
        width: 700,
        height: 450,
        // animation: true
    };

    singleBarChartConfig = {
        x: 'rpm',
        charts: [{type: 'bar', y: 'horsepower', fill: '#2ca02c'}, {type: 'bar', y: 'torque', fill: '#ff7f0e'}],
        maxLength: 20,
        width: 700,
        height: 450,
        // animation: true
    };

    /*****************[END] Chart Config******************/


    componentDidMount() {
        this.interval_id=setInterval(() => {
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

    componentWillUnmount(){
        clearInterval(this.interval_id);
    }

    render() {
        return (
            <div>
                <center><h1>Bar Chart Config Samples</h1></center>
                <Row title="Group MultiLine Chart Sample" chart="line" media={true} actionBar={false}>
                    <VizG config={this.barChartConfig} metadata={this.metadata} data={this.state.data}/>
                    <br/>
                    <div>

                       <pre>
                           <p>Configuration: </p>

                           {'{\n' +
                           '\tx: \'rpm\',\n' +
                           '\tcharts: [\n\t    { type: \'bar\', y: \'torque\', color: \'EngineType\',colorDomain:[\'\',\'\',\'piston\']}\n\t],\n' +
                           '\tmaxLength: 7,\n' +
                           '\twidth: 700,\n' +
                           '\theight: 450,\n' +
                           '\tanimation:true\n}'

                           }
                       </pre>
                    </div>
                </Row>
                <Row title="Multi Line Chart Sample" chart="line" media={true} actionBar={false}>
                    <VizG config={this.singleBarChartConfig} metadata={this.metadata} data={this.state.data2}/>
                    <br/>
                    <div>
                       <pre>
                           <p>Configuration: </p>
                           {'{\n' +
                           '\tx: \'rpm\',\n' +
                           '\tcharts: [\n\t    { type: \'bar\', y: \'horsepower\', fill:\'#2ca02c\'}\n\t    { type: \'bar\', y: \'torque\', fill:\'#ff7f0e\'}\n\t],\n' +
                           '\tmaxLength: 7,\n' +
                           '\twidth: 700,\n' +
                           '\theight: 450,\n' +
                           '\tanimation:true\n}'

                           }
                       </pre>
                    </div>
                </Row>
                <Row title="Group MultiLine Chart Sample Horizontal" chart="line" media={true} actionBar={false}>
                    <VizG config={this.barHorizontalChartConfig} metadata={this.metadata} data={this.state.data}/>
                    <br/>
                    <div>

                       <pre>
                           <p>Configuration: </p>

                           {'{\n' +
                           '\tx: \'rpm\',\n' +
                           '\tcharts: [\n\t    { type: \'bar\', y: \'torque\', color: \'EngineType\',orientation:\'left\',colorDomain:[\'\',\'\',\'piston\']}\n\t],\n' +
                           '\tmaxLength: 7,\n' +
                           '\twidth: 700,\n' +
                           '\theight: 450,\n' +
                           '\tanimation:true\n}'

                           }
                       </pre>
                    </div>
                </Row>

                <Row title="Group MultiLine Chart Sample stacked" chart="line" media={true} actionBar={false}>
                    <VizG config={this.stackedBarChartConfig} metadata={this.metadata} data={this.state.data}/>
                    <br/>
                    <div>

                       <pre>
                           <p>Configuration: </p>

                           {'{\n' +
                           '\tx: \'rpm\',\n' +
                           '\tcharts: [\n\t    { type: \'bar\', y: \'torque\', color: \'EngineType\',mode:\'stacked\',colorDomain:[\'\',\'\',\'piston\']}\n\t],\n' +
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
                           <br/>
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
                                   <td>whether the chart should be stacked or not (default:null)</td>
                               </tr>
                               <tr>
                                   <td>orientation</td>
                                   <td>string</td>
                                   <td>orientation of the chart (default:vertical)</td>
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
