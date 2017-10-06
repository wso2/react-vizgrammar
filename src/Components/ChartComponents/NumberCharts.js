import React from 'react';
import PropTypes from 'prop-types';
import {VictoryLabel } from  'victory';

export default class NumberCharts extends React.Component{
    constructor(props){
        super(props);
        this.state={
            height:props.config.height || 450,
            width:props.config.width || 800,
            value:null,
            prevValue:null
        };
    }


    componentDidMount(){
        this._handleData(this.props);
    }

    componentWillReceiveProps(nextProps){
        this._handleData(nextProps);
    }


    /**
     * handles data received by the props
     * @param props
     * @private
     */
    _handleData(props){
        console.info('awa');
        let {config,data,metadata} = props;
        let {prevValue,value} = this.state;
        let xIndex=metadata.names.indexOf(config.x);


        if(data.length>0){
            prevValue=value;
            value=data[data.length-1][xIndex];
        }

        this.setState({value,prevValue});

    }

    render(){
        let {config} = this.props;
        let {width,height,prevValue,value}=this.state;


        return(
            <svg height={'100%'} width={'100%'} viewBox={`0 0 ${width} ${height}`}>
                <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={width / 2} y={height/5}

                    text={config.title}
                    style={{fontSize: 30}}
                />
                <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={width / 2} y={height / 2}

                    text={value}
                    style={{fontSize: 45}}
                />

                <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={width / 2} y={(height / 2)+50}

                    text={(eval(prevValue-value)*(-1))}
                    style={{fontSize: 15}}
                />
                <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={width / 2} y={(height / 2)+70}

                    text={Math.round((eval(100*(prevValue-value)/prevValue)*(-1)))+'%'}
                    style={{fontSize: 15}}
                />
            </svg>
        );
    }
}


NumberCharts.propTypes={
    config:PropTypes.object.isRequired,
    metadata:PropTypes.object.isRequired,
    data:PropTypes.array
};