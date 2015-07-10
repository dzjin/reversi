'use strict';

import React from 'react';
import { capitalize } from '../helpers';

let DOM = React.DOM;


export default class ScoreItem extends React.Component {
    render() {
        let className = this.props.color;
        if (this.props.isHighlighted) {
            className += ' highlighted';
        }

        return DOM.div({ className },
            capitalize(this.props.color) + ': ' + this.props.score
        );
    }
}

ScoreItem.propTypes = {
    color: React.PropTypes.string.isRequired,
    isHighlighted: React.PropTypes.bool,
    score: React.PropTypes.number
};

ScoreItem.defaultProps = {
    isHighlighted: false,
    score: 0
};
