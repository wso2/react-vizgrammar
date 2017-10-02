import React, { Component } from 'react';
import {VictoryPie} from 'victory';
import Map from '../Components/MapComponents/App';

class Test extends Component {

    constructor(props) {
        super(props);

    }
    


    componentDidMount() {

    }
    

    render() {
        // console.log("AAAA"+this.state.data)
        return (
            <div>
                <Map />
            </div>
        );
    }
}

export default Test;