import React from 'react';
import {Row} from './util';
import './css/Table.css';
import VizG from '../Components/VizG';
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


    interval_jd=null;

    metadata = {
        names: ['rpm', 'torque', 'horsepower', 'EngineType', 'weight'],
        types: ['linear', 'linear', 'linear', 'ordinal', 'linear']
    };


    /*****************[START] Chart Config******************/
    lineChartConfig = {
        charts: [{type: 'arc', x: 'torque', color: 'EngineType', mode: 'donut'}],
        width: 300,
        height: 300
    };

    configPie = {
        charts : [{type: 'arc',  x : 'torque', color : 'EngineType', mode: 'pie'}],
        width: 300,
        height: 300
    };

    configT = {
        charts : [{type: 'arc',  x : 'torque', color : 'EngineType',colorScale:['steelblue', '#80ccff'],}],

        tooltip: {'enabled':false},
        legend:false, percentage:true, colorScale:['steelblue', '#80ccff'],
        width: 300,
        height: 300
    };




    /*****************[END] Chart Config******************/


    componentDidMount() {
        this.interval_jd=setInterval(() => {
            this.setState({
                data: [
                    [this.state.timer, this.state.timer === 20 ? null : Math.random() * 100, 10, 'piston'],
                    [this.state.timer, Math.random() * 100, 10, 'rotary'],
                    [this.state.timer, this.state.timer === 20 ? null : Math.random() * 100, 10, 'piston2'],
                    [this.state.timer, Math.random() * 100, 10, 'rotary2']
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
                <center><h1>Line Chart Config Samples</h1></center>
                <Row title="Donut Chart Sample" chart="line" media={true} actionBar={false}>
                    <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.state.data}/>
                    <br/><br/>
                    <div style={{display: 'block'}}>
                       <pre>
                           {
                               '{\n' +
                               '\tcharts : [{type:"arc", x:"torque", color:"EngineType", mode:"donut"}],\n' +
                               '\twidth: 300,\n' +
                               '\theight: 250\n' +
                               '}'

                           }
                       </pre>
                    </div>
                </Row>
                <Row title="Pie Chart Sample" chart="line" media={true} actionBar={false}>
                    <VizG config={this.configPie} metadata={this.metadata} data={this.state.data}/>
                    <br/>
                    <div>
                       <pre>
                           {
                               '{\n' +
                               '\tcharts : [{type: "arc",  x : "torque", color : "EngineType", mode: "pie"}],\n' +
                               '\twidth: 400,\n' +
                               '\theight: 300\n' +
                               '}'
                           }
                       </pre>
                    </div>
                </Row>

                <Row title="Donut Chart Sample" chart="line" media={true} actionBar={false}>
                    <VizG config={this.configT} metadata={this.metadata} data={this.state.data}/>
                    <br/><br/>
                    <div style={{display: 'block'}}>
                       <pre>
                           {
                               '{\n' +
                               '\tcharts : [{type:"arc", x:"torque", color:"EngineType", mode:"donut"}],\n' +
                               '\twidth: 300,\n' +
                               '\theight: 250\n' +
                               '}'

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

                {/* TODO: add innerRadius to the config */}
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
