'use strict';

import React from 'react';
import ScoreItem from './ScoreItem';

let DOM = React.DOM;


export default React.createClass({
    displayName: 'Score',
    propTypes: {
        onMove: React.PropTypes.string,
        scores: React.PropTypes.shape({
            light: React.PropTypes.number.isRequired,
            dark: React.PropTypes.number.isRequired
        })
    },
    getDefaultProps() {
        return {
            onMove: 'light',
            scores: { light: 0, dark: 0 }
        };
    },
    render() {
        let scoreItems = [ 'light', 'dark' ].map(oneColor =>
            React.createElement(ScoreItem, {
                key: oneColor,
                color: oneColor,
                onMove: this.props.onMove,
                score: this.props.scores[oneColor]
            })
        );

        return DOM.div({ id: 'score' }, scoreItems);
    }
});
