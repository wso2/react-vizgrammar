import React, {Component} from 'react';
import {VictoryPie} from 'victory';
import MapGenerator from '../components/ChartComponents/MapGenerator';
import NumberCharts from '../components/ChartComponents/NumberCharts';
import TableCharts from '../components/ChartComponents/TableCharts';
import MapChartConfigSample from './MapChartConfigSample';
import {Row} from '../Samples/util';

// import Map from '../components/MapComponents/App';

class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                ['Afghanistan', 4.23],
                ['EGY', 1.23],
                ['Afghanistan', 2.23],
                ['United States', 10.23],
                ['Albania', 3.23],
                ['United Kingdom', 7],
                ['Australia', 5],
                ['Ireland', 1],
                ['RUS', 15]

            ],
            data2: [
                ['Alabama', 4.23],
                ['Michigan', 1.23],
                ['Georgia', 8.23],
                ['Texas', 3.23],
                ['Hawaii', 2.23]
            ],
            timer: 1
        };
    }


    componentDidMount() {

    }

    mapConfig = {
        x: 'Country',
        charts: [{type: 'map', y: 'Inflation', mapType: 'world', colorScale: ['#1958ff', '#1eff36']}],
        width: 400,
        height: 200
    };

    europeConfig = {
        type: 'map',
        x: 'Country',
        renderer: 'canvas',
        charts: [{type: 'map', y: 'Inflation', mapType: 'europe', colorScale: ['#1958ff', '#1eff36']}],
        width: 500,
        height: 300
    };

    usaConfig = {
        type: 'map',
        x: 'Country',
        renderer: 'canvas',
        charts: [{type: 'map', y: 'Inflation', mapType: 'usa', colorScale: ['#1958ff', '#1eff36']}],
        width: 500,
        height: 300
    };


    metadata = {
        'names': ['Country', 'Inflation'],
        'types': ['ordinal', 'linear']
    };

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <Row title="World Map Sample" chart="line" media={true} actionBar={false}>
                    <MapGenerator config={this.mapConfig} metadata={this.metadata} data={this.state.data}/>
                    <pre>
                        {'{\n' +
                        '\tx : \'Country\',\n' +
                        '\tcharts : [{type: \'map\',  y : \'Inflation\',mapType:\'world\'}],\n' +
                        '\twidth: 400,\n' +
                        '\theight: 200\n' +
                        '}'}
                    </pre>
                </Row>
                <Row title="Europe Map Sample" chart="line" media={true} actionBar={false}>
                    <MapGenerator config={this.europeConfig} metadata={this.metadata} data={this.state.data}/>
                    <pre>
                        {'{\n' +
                        '\tx : \'Country\',\n' +
                        '\tcharts : [{type: \'map\',  y : \'Inflation\',mapType:\'europe\'}],\n' +
                        '\twidth: 400,\n' +
                        '\theight: 200\n' +
                        '}'}
                    </pre>
                </Row>
                <Row title="United States Map Sample" chart="line" media={true} actionBar={false}>
                    <MapGenerator config={this.usaConfig} metadata={this.metadata} data={this.state.data2}/>
                    <pre>
                        {'{\n' +
                        '\tx : \'County\',\n' +
                        '\tcharts : [{type: \'map\',  y : \'Inflation\',mapType:\'usa\'}],\n' +
                        '\twidth: 400,\n' +
                        '\theight: 200\n' +
                        '}'}
                    </pre>
                </Row>
                <Row title="Sample Data Set" chart="line" media={false} actionBar={false}>
                    {/*<MapGenerator config={this.usaConfig} metadata={this.metadata} data={this.state.data2}/>*/}
                    <pre>
                        {'data : [\n' +
                        '                [\'Afghanistan\',4.23],\n' +
                        '                [\'EGY\',1.23],\n' +
                        '                [\'Afghanistan\',2.23],\n' +
                        '                [\'United States\',10.23],\n' +
                        '                [\'Albania\',3.23],\n' +
                        '                [\'United Kingdom\',7],\n' +
                        '                [\'Australia\',5],\n' +
                        '                [\'Ireland\',1],\n' +
                        '                [\'RUS\',15]\n' +
                        '\n' +
                        '];'}
                        <br/>
                        {
                            '\n\nmetadata = {\n' +
                            '        \'names\' : [\'Country\',\'Inflation\'],\n' +
                            '        \'types\' : [\'ordinal\',\'linear\']\n' +
                            '};'
                        }
                    </pre>
                </Row>
                <Row title="API" chart="line" media={false} actionBar={false}>
                    {/*<MapGenerator config={this.usaConfig} metadata={this.metadata} data={this.state.data2}/>*/}
                    <pre>
                        <p>Main Properties</p>
                        <table>
                            <thead>
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>x</td>
                                <td>String</td>
                                <td>cAttribute name for X-axis</td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td>px</td>
                                <td>height of the chart</td>

                            </tr>

                            <tr>
                                <td>charts</td>
                                <td>object</td>
                                <td>Collection of charts</td>

                            </tr>
                            </tbody>
                        </table>
                        <br/>
                        <p>Chart Properties</p>
                        <table>
                            <thead>
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>type</td>
                                <td>String</td>
                                <td>type of chart(map)</td>
                            </tr>
                            <tr>
                                <td>y</td>
                                <td>String</td>
                                <td>Dependant Axis</td>

                            </tr>

                            <tr>
                                <td>mapType</td>
                                <td>string</td>
                                <td>Type of the map (world || usa || europe)</td>

                            </tr>
                            </tbody>
                        </table>
                    </pre>
                </Row>
            </div>
        );
    }
}

export default Test;