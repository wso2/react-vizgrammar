import React from 'react';
import {feature} from 'topojson-client';
import PropTypes from 'prop-types';
import worldMap from './jsonMapFiles/world';
import europeMap from './jsonMapFiles/europe';
import usaMap from './jsonMapFiles/usa';

class Topographies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topoGraphyPaths: []
        };

    }

    getTopographyPaths(topojsonURL) {
        if (!topojsonURL) {
            let topoGPaths=null;

            switch (this.props.inbuiltMapType){
                case 'world':
                    topoGPaths=worldMap;
                    break;

                case 'europe':
                    topoGPaths=europeMap;
                    break;
                case 'usa':
                    topoGPaths=usaMap;
                    break;
                default:
                    console.error('map type not identified');
                    return;
            }

            this.setState({
                topoGraphyPaths: feature(topoGPaths, topoGPaths.objects[Object.keys(topoGPaths.objects)[0]]).features,
            });


        } else {

            const req = new XMLHttpRequest();
            req.open('GET', topojsonURL, true);


            req.onload = () => {
                if (req.status >= 200 && req.status < 400) {
                    const topoGPaths = JSON.parse(req.responseText);
                    this.setState({
                        topoGraphyPaths: feature(topoGPaths, topoGPaths.objects[Object.keys(topoGPaths.objects)[0]]).features,
                    });
                    // console.log(this.state.topoGraphyPaths);
                    console.log(this.state.topoGraphyPaths);
                }
            };

            req.onerror = () => {
                console.log('There was a connection error');
            };

            req.send();
        }
    }


    componentDidMount() {
        this.getTopographyPaths(this.props.topojsonURL);
    }


    render() {
        return (
            <g className="geographies">
                {this.props.children(this.state.topoGraphyPaths, this.props.projection)}
            </g>
        );
    }

}


Topographies.propTypes = {
    children: PropTypes.func.isRequired,
    inbuiltMapType:PropTypes.string,
    topojsonURL:PropTypes.string
};

export default Topographies;

