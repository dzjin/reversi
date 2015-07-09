'use strict';

import React from 'react';
import ScoreItem from './ScoreItem';

let DOM = React.DOM;


export default class Score extends React.Component {
    render() {
        let colors = Object.getOwnPropertyNames(this.props.scores);
        let scoreItems = colors.map(oneColor =>
            React.createElement(ScoreItem, {
                key: oneColor,
                color: oneColor,
                isHighlighted: (this.props.highlighted === oneColor),
                score: this.props.scores[oneColor]
            })
        );

        return DOM.div({ className: 'scores' }, scoreItems);
    }
}

Score.propTypes = {
    scores: React.PropTypes.object.isRequired,
    highlighted: React.PropTypes.string
};

Score.defaultProps = {
    highlighted: null
};
