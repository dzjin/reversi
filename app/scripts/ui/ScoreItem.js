'use strict';

import React from 'react';
import { capitalize } from '../helpers';

let DOM = React.DOM;


const ScoreItem = function({ color, isHighlighted, score }) {
    let className = color;
    if (isHighlighted) {
        className += ' highlighted';
    }

    return DOM.div({ className }, capitalize(color) + ': ' + score);
};

ScoreItem.propTypes = {
    color: React.PropTypes.string.isRequired,
    isHighlighted: React.PropTypes.bool,
    score: React.PropTypes.number
};

ScoreItem.defaultProps = {
    isHighlighted: false,
    score: 0
};

export default ScoreItem;
