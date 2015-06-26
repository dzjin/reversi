'use strict';

import React from 'react';

let DOM = React.DOM;

const EMPTY_DISK = 0;
const LIGHT_DISK = 1;
const DARK_DISK = 2;


export default React.createClass({
    displayName: 'BoardCell',
    getInitialState: function() {
        return {
            value: this.props.value
        };
    },
    getDefaultProps: function() {
        return {
            value: EMPTY_DISK
        };
    },
    propTypes: {
        value: React.PropTypes.oneOf([ EMPTY_DISK, LIGHT_DISK, DARK_DISK ])
    },
    handleClick: function(e) {
        e.preventDefault();
        let opposite = (this.state.value === LIGHT_DISK) ?
            DARK_DISK : LIGHT_DISK;
        this.setState({ value: opposite });
    },
    render: function() {
        let disk;
        switch (this.state.value) {
        case EMPTY_DISK:
            disk = '';
            break;
        case LIGHT_DISK:
            disk = 'light';
            break;
        case DARK_DISK:
            disk = 'dark';
            break;
        }

        return DOM.div({
            className: 'col',
            'data-disk': disk,
            onClick: this.handleClick
        });
    }
});
