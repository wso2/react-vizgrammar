import React from 'react';

class Marker extends React.Component{

    constructor(){
        super();

        this.state={
            hover:true,
            pressed:true
        };

        this.handleOnClick=this.handleOnClick.bind(this);
        this.handleOnMouseDown=this.handleOnMouseDown.bind(this);
        this.handleOnMouseEnter=this.handleOnMouseEnter.bind(this);
        this.handleOnMouseExit=this.handleOnMouseEnter.bind(this);
        this.handleOnMouseUp=this.handleOnMouseUp.bind(this);
    }

    handleOnClick(evt){
        if(!this.props.onClick) return;

        evt.persist();
        return this.props.onClick && this.props.onClick(this.props.marker,evt);
    }

    handleOnMouseDown(evt){
        evt.persist();
        this.setState({
            pressed:true
        });

        return this.props.onMouseDown && this.props.onClick(this.props.marker,evt);
    }

    handleOnMouseUp(evt){
        evt.persist();
        this.setState({
            pressed:false
        });

        return this.props.onMouseUp && this.props.onMouseUp(this.props.marker,evt);
    }

    handleOnMouseEnter(evt){
        evt.persist();
        this.setState({
            hover:true
        });

        return this.props.onMouseEnter && this.props.onMouseEnter(this.props.marker,evt);

    }

    handleOnMouseExit(evt){
        evt.persist();
        this.setState({
            hover:false
        });

        return this.props.onMouseExit && this.props.onMouseExit(this.props.marker,evt);
    }



    render(){
        return(
            <g
                className="marker"
                transform={`translate(
                    ${(this.props.projection)(this.props.marker.coordinates)[0]}
                    ${(this.props.projection)(this.props.marker.coordinates)[1]}
                )`}

                style={this.props.style[this.state.pressed || this.state.hover ? (this.state.pressed ? 'pressed': 'hover'):'default']}
                onClick={this.handleOnClick}
                onMouseEnter={this.handleOnMouseEnter}
                onMouseLeave={this.handleOnMouseExit}
                onMouseDown={this.handleOnMouseDown}
                onMouseUp={this.handleOnMouseUp}

            >
                {this.props.children}
            </g>
        );
    }

}


Marker.defaultProps={
  style:{
      default:{},
      hover:{},
      pressed:{}

  }
};


export default Marker;