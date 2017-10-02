import React from 'react';
import Map from './Map';
import Topography from './Topography';
import Topographies from './Topographies';
// import ReactTooltip from 'react-tooltip';

class ChartGeneration extends React.Component{

    constructor(props){
        super(props);

    }

    render(){
        return(
            <div>
                {
                    this.props.config.type === 'map'? generateMap(this.props.config,this.props.data) : null
                }
            </div>
        );
    }

}

function generateMap(config,data) {
    let chartScale=null;

    if(config.chart.type==='world'){

        let scale=(100+(config.width-800)*60/200).toFixed(0);
        console.log(scale);
        chartScale={scale:scale};

    }

    return(
        <Map width={800} height={900} config={chartScale}>

            <Topographies inbuiltMapType="world">
                {(topographies, projection) => topographies.map((topography, i) => (
                    <Topography
                        key={i}
                        topography={topography}
                        projection={projection}
                        style={{
                            default: {
                                fill: '#ECEFF1',
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
                        tooltip={topography.id}
                    />
                ))}
            </Topographies>
            {/*<ReactTooltip/>*/}
        </Map>
    );

}





export default ChartGeneration;