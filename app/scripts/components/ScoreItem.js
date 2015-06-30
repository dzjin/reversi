'use strict';

import React from 'react';
import { capitalize } from '../helpers';

let DOM = React.DOM;


export default class ScoreItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onMove: 'light',
            score: 0
        };
    }

    render() {
        let classes = [ this.props.color ];
        if (this.props.onMove === this.props.color) {
            classes.push('on-move');
        }

        return DOM.div({ className: classes.join(' ') },
            capitalize(this.props.color) + ': ' + this.props.score
        );
    }
}

ScoreItem.propTypes = {
    color: React.PropTypes.string.isRequired,
    onMove: React.PropTypes.string,
    score: React.PropTypes.number
};
