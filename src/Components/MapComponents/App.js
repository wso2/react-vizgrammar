/**Created by Charuka Karunanayake*/

import React from 'react';
import Row from './RowComponent';
import Map from './Map';
import Topographies from './Topographies';
import Topography from './Topography';
import Markers from './Markers';
import Marker from './Marker';
import {scaleLinear} from 'd3-scale';
import ChartGen from './ChartGeneration';



export default class App extends React.Component {

    data = [
        {name: 'Tokyo', coordinates: [139.6917, 35.6895], population: 37843000},
        {name: 'Jakarta', coordinates: [106.8650, -6.1751], population: 30539000},
        {name: 'Delhi', coordinates: [77.1025, 28.7041], population: 24998000},
        {name: 'Manila', coordinates: [120.9842, 14.5995], population: 24123000},
        {name: 'Seoul', coordinates: [126.9780, 37.5665], population: 23480000},
        {name: 'Shanghai', coordinates: [121.4737, 31.2304], population: 23416000},
        {name: 'Karachi', coordinates: [67.0099, 24.8615], population: 22123000},
        {name: 'Beijing', coordinates: [116.4074, 39.9042], population: 21009000},
        {name: 'New York', coordinates: [-74.0059, 40.7128], population: 20630000},
        {name: 'Guangzhou', coordinates: [113.2644, 23.1291], population: 20597000},
        {name: 'Sao Paulo', coordinates: [-46.6333, -23.5505], population: 20365000},
        {name: 'Mexico City', coordinates: [-99.1332, 19.4326], population: 20063000},
        {name: 'Mumbai', coordinates: [72.8777, 19.0760], population: 17712000},
        {name: 'Osaka', coordinates: [135.5022, 34.6937], population: 17444000},
        {name: 'Moscow', coordinates: [37.6173, 55.7558], population: 16170000},
        {name: 'Dhaka', coordinates: [90.4125, 23.8103], population: 15669000},
        {name: 'Greater Cairo', coordinates: [31.2357, 30.0444], population: 15600000},
        {name: 'Los Angeles', coordinates: [-118.2437, 34.0522], population: 15058000},
        {name: 'Bangkok', coordinates: [100.5018, 13.7563], population: 14998000},
        {name: 'Kolkata', coordinates: [88.3639, 22.5726], population: 14667000},
        {name: 'Buenos Aires', coordinates: [-58.3816, -34.6037], population: 14122000},
        {name: 'Tehran', coordinates: [51.3890, 35.6892], population: 13532000},
        {name: 'Istanbul', coordinates: [28.9784, 41.0082], population: 13287000},
        {name: 'Lagos', coordinates: [3.3792, 6.5244], population: 13123000},
        {name: 'Shenzhen', coordinates: [114.0579, 22.5431], population: 12084000},
        {name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], population: 11727000},
        {name: 'Kinshasa', coordinates: [15.2663, -4.4419], population: 11587000},
        {name: 'Tianjin', coordinates: [117.3616, 39.3434], population: 10920000},
        {name: 'Paris', coordinates: [2.3522, 48.8566], population: 10858000},
        {name: 'Lima', coordinates: [-77.0428, -12.0464], population: 10750000}
    ];


    mapTest={
      type:'map',
      chart:{type:'world'},
      width:300,
      height:900
    };



    cityScale = scaleLinear()
        .domain([0, 37843000])
        .range([1, 25]);


    render() {
        return (
            <div>
                <Row title="World map Sample">
                    <Map width={800} height={900} config={{scale: 100}}>

                        <Topographies inbuiltMapType="world">
                            {(topographies, projection) => topographies.map((topography, i) => (
                                <Topography
                                    key={i}
                                    topography={topography}
                                    projection={projection}
                                    style={{
                                        default: {
                                            fill: topography.id==='AUS' ? '#FF5722': '#ace9f1',
                                            stroke: '#607D8B',
                                            strokeWidth: 0.75,
                                            outline: 'none',
                                        },
                                        hover: {
                                            fill: '#607D8B',
                                            stroke: '#607D8B',
                                            strokeWidth: 0.75,
                                            outline: 'none',
                                        },
                                        pressed: {
                                            fill: '#FF5722',
                                            stroke: '#607D8B',
                                            strokeWidth: 0.75,
                                            outline: 'none',
                                        },
                                    }}
                                    onClick={()=>{console.info(topography);}}
                                    tooltip={`Country ID : ${topography.id}`}
                                />

                            ))}
                        </Topographies>

                        <Markers>
                            {this.data.map((city, i) => (
                                <Marker
                                    key={i}
                                    marker={city}
                                >
                                    <circle
                                        cx={0}
                                        cy={0}
                                        r={this.cityScale(city.population)}
                                        fill='#0DFFE7'
                                        stroke='#ffffff'
                                        strokeWidth={2}
                                    />

                                </Marker>
                            ))}
                        </Markers>


                    </Map>

                </Row>
                <Row title="World map Sample 2">
                    <ChartGen config={this.mapTest} data={this.data} />
                </Row>
            </div>
        );
    }
}


