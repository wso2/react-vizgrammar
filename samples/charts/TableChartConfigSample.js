import React, {Component} from 'react';
import TableCharts from '../../src/components/TableChart.jsx';
import {Row} from './util';

// import Map from '../components/MapComponents/App';

class TableChartConfigSample extends Component {

    constructor(props) {
        super(props);
        this.state={
            data : [
                [0, 10, 1, 'Piston']
            ],
            timer:1
        };
    }


    componentDidMount() {
        setInterval(()=>{
            this.setState({
                data : [[Math.round(Math.random()*100), Math.round(Math.random()*100), 1, 'Piston'],[Math.round(Math.random()*100), Math.round(Math.random()*100), 1, 'rotary']]   ,
                timer: this.state.timer+1
            });
        },1000);
    }

    mapConfig = {
        key : 'rpm',
        charts : [{ type: 'table',
            y : 'torque',
            color: '*',
            columns:['EngineType',  'torque', 'rpm'],
            columnTitles:['Engine Type',  'Engine Torque', 'Engine RPM'],
        }
        ],
        maxLength: 7,
        width: 400,
        height: 200
    };



    metadata = {
        'names' : ['rpm','torque','horsepower', 'EngineType'],
        'types' : ['linear','linear', 'ordinal','ordinal']
    };

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <Row title="Table Chart Sample" chart="line" media={true} actionBar={false}>
                    <TableCharts config={this.mapConfig} metadata={this.metadata} data={this.state.data}/>
                    <br/>
                    <br/>
                    <pre>
                        {
                            '{\n' +

                            '\tcharts : [\n\t{\n\t\ttype: \'table\',\n' +
                            '\t\tcolumns:[\'EngineType\',  \'torque\', \'rpm\'],\n' +
                            '\t\tcolumnTitles:[\'Engine Type\',  \'Engine Torque\', \'Engine RPM\'],\n' +
                            '\t}' +
                            '],\n' +
                            '\tmaxLength: 7,\n' +
                            '\twidth: 400,\n' +
                            '\theight: 200\n' +
                            '}'
                        }
                    </pre>
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
                <Row title="Sample Data Set" chart="line">
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
                       </pre>
                    </div>
                </Row>
            </div>
        );
    }
}

export default TableChartConfigSample;