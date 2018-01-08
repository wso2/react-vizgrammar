import React from 'react';
import { Card, CardActions, CardHeader, Button, CardContent } from 'material-ui';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class ChartWrapper extends React.Component {
    render() {
        return (
            <Card style={{ marginTop: 80 }} >
                <CardHeader title={this.props.title} subheader={this.props.subtitle} />
                <CardContent>

                    {this.props.children}

                </CardContent>
                {
                    this.props.actionBar ?
                        <CardContent style={{ height: 50 }}>
                            <Link to={'/' + this.props.chart + '-charts'} style={{ textDecoration: 'none', float: 'right' }}>
                                <Button raised color="primary">{this.props.actionBar ? 'View Usage' : ' '}</Button>
                            </Link>
                        </CardContent> : null
                }
            </Card>
        );
    }
}

ChartWrapper.defaultProps = {
    media: false,
    actionBar: false,
    subtitle: '',
    children: null,
    height: 450,
};

ChartWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.element,
    chart: PropTypes.string.isRequired,
    actionBar: PropTypes.bool.isRequired,
    height: PropTypes.number,
};
