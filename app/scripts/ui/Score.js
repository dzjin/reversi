'use strict';

import React from 'react';
import ScoreItem from './ScoreItem';

let DOM = React.DOM;


const Score = function({ scores, highlighted }) {
    let colors = Object.getOwnPropertyNames(scores);
    let scoreItems = colors.map(oneColor =>
        React.createElement(ScoreItem, {
            key: oneColor,
            color: oneColor,
            isHighlighted: (highlighted === oneColor),
            score: scores[oneColor]
        })
    );

    return DOM.div({ className: 'scores' }, scoreItems);
};

Score.propTypes = {
    scores: React.PropTypes.object.isRequired,
    highlighted: React.PropTypes.string
};

Score.defaultProps = {
    highlighted: null
};

export default Score;
