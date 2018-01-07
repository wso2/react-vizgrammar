import React from 'react';
import { Card, CardActions, CardMedia, CardHeader, Button, CardContent } from 'material-ui';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class ChartWrapper extends React.Component {
    render() {
        return (
            <Card style={{ marginTop: 80 }} >
                <CardHeader title={this.props.title} subheader={this.props.subtitle} />
                <CardContent>
                    <div>
                        {this.props.children}
                    </div>
                </CardContent>
                <CardActions>
                    <Link to={'/' + this.props.chart + '-charts'}>
                        <Button raised color="primary">{this.props.actionBar ? 'View Usage' : ' '}</Button>
                    </Link>
                </CardActions>
            </Card>
        );
    }
}

ChartWrapper.defaultProps = {
    media: false,
    actionBar: false,
    subtitle: '',
    children: null,
};

ChartWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.element,
    chart: PropTypes.string.isRequired,
    actionBar: PropTypes.bool.isRequired,
};
