import React from 'react';
import PropTypes from 'prop-types';
// import Topographies from './Topographies';
// import Topography from './Topography';
import Projection from './Projection';
import {scaleLinear} from 'd3-scale';

// import ProjectionConfig from './ProjectionConfig';

class Map extends React.Component {
    constructor(props) {
        super(props);

    }

    projection(width, height, config) {
        return Projection(width, height, config);
    }

    legendScale(domain) {
        return scaleLinear().domain(domain).range([0, 100]);
    }


    render() {

        return (
            <svg width={this.props.width} height={this.props.height}
                 viewBox={`0 0 ${this.props.width} ${this.props.height}`}>
                {/*{React.cloneElement(this.props.children[0], {*/}
                {/*projection: this.projection(this.props.width, this.props.height, this.props.config)*/}

                {/*})}*/}


                <defs>
                    {
                        this.props.legend ?
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                {/*<stop offset="0%" stopColor='rgb(255,255,255)' stopOpacity={1} />*/}
                                {/*<stop offset="100%" stopColor='rgb(rgba(38,50,56)' stopOpacity={1} />*/}
                                {this.props.legend.domain.map((domain,i)=>{
                                    console.info(domain,this.props.legend.range[i]);
                                    return(

                                        <stop key={i} offset={`${this.legendScale([this.props.legend.domain[0],this.props.legend.domain[this.props.legend.domain.length-1]])(domain)}%`} stopColor={this.props.legend.range[i]} stopOpacity={1} />
                                    );
                                })}
                            </linearGradient>
                            :
                            null
                    }

                </defs>
                {
                    this.props.legend ?
                        <g className='legend'>

                            <text x='10' y={450}>Map legend</text>
                            <rect x='10' y={460} fill='url(#grad1)' height='15' width='200'></rect>
                        </g> : null
                }

                {
                    Array.isArray(this.props.children) ?
                        this.props.children.map((child, i) => (
                            React.cloneElement(child, {
                                projection: this.projection(this.props.width, this.props.height, this.props.config),
                                key: 'mapchild-' + i
                            })
                        )) :

                        React.cloneElement(this.props.children, {
                            projection: this.projection(this.props.width, this.props.height, this.props.config)

                        })

                }

            </svg>
        );
    }
}


Map.defaultProps = {
    width: 800,
    height: 450
};

Map.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element
    ]).isRequired,
    config: PropTypes.array

};


export default Map;