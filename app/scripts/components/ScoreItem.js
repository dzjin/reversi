'use strict';

import React from 'react';
import { capitalize } from '../helpers';

let DOM = React.DOM;


export default class ScoreItem extends React.Component {
    render() {
        let classes = [ this.props.color ];
        if (this.props.isOnMove) {
            classes.push('on-move');
        }

        return DOM.div({ className: classes.join(' ') },
            capitalize(this.props.color) + ': ' + this.props.score
        );
    }
}

ScoreItem.propTypes = {
    color: React.PropTypes.string.isRequired,
    isOnMove: React.PropTypes.bool,
    score: React.PropTypes.number
};

ScoreItem.defaultProps = {
    isOnMove: false,
    scores: 0
};
