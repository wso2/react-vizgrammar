import React from 'react';
import {geoPath} from 'd3-geo';
import PropTypes from 'prop-types'

class Topography extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            pressed: false
        };

        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseExit = this.handleMouseExit.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

    }

    handleMouseClick(evt) {
        evt.persist();

        return this.props.onClick && this.props.onClick(this.props.topography, evt);
    }

    handleMouseEnter(evt) {
        evt.persist();
        this.setState({
            hover: true
        }, () => this.props.onMouseEnter && this.props.onMouseEnter(this.props.topography, evt));

    }

    handleMouseExit(evt) {
        evt.persist();
        this.setState({
            hover: false
        }, () => this.props.onMouseLeave && this.props.onMouseLeave(this.props.topography, evt));

    }


    handleMouseMove(evt) {
        evt.persist();
        if (this.state.pressed) return;
        if (!this.state.hover) this.setState({hover: true}, () => this.props.onMouseMove && this.props.onMouseMove(this.props.topography, evt));

    }


    handleMouseDown(evt) {
        evt.persist();
        this.setState({pressed: true}, () => this.props.onMouseDown && this.props.onMouseDown(this.props.topography, evt));

    }

    handleMouseUp(evt) {
        evt.persist();
        this.setState({pressed: false}, () => this.props.onMouseUp && this.props.onMouseUp(this.props.topography, evt));

    }



    render() {

        return (
            <path
                d={geoPath().projection(this.props.projection)(this.props.topography)}

                style={this.props.style[this.state.pressed || this.state.hover ? (this.state.pressed ? 'pressed' : 'hover') : 'default']}

                onClick={this.handleMouseClick}
                onMouseDown={this.handleMouseDown}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseExit}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}

            >
                <title>{this.props.tooltip}</title>
            </path>
        );
    }

}

Topography.propTypes = {
    tooltip:PropTypes.string,
    topography:PropTypes.array,
    onClick:PropTypes.func,
    onMouseDown:PropTypes.func,


};


// function calculateResizeFactor(actual,base){
//     return 1/100*(100/actual*base);
// }

export default Topography;