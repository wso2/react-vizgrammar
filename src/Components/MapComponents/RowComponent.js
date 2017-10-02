import React from 'react';
import PropTypes from 'prop-types';

class Row extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (

            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{this.props.title}</h3>
                </div>
                <div className="panel-body">
                    <div className="text-right">
                        {/*<a href="charts/line">View Usage</a>*/}
                        {this.props.children}
                    </div>
                </div>
            </div>

        );
    }
}

Row.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
};

export default Row;
