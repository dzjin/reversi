'use strict';

import React from 'react';
import BoardRow from './BoardRow';

let DOM = React.DOM;

const EMPTY_DISK = 0;
const LIGHT_DISK = 1;
const DARK_DISK = 2;

/**
 * @param {number} size
 */
let createEmptyArray = (size) =>
    Array.apply(null, { length: size });

/**
 * @param {number} size
 */
let createEmptyBoard = (size) =>
    createEmptyArray(size).map(() =>
        createEmptyArray(size).fill(EMPTY_DISK)
    );


export default React.createClass({
    displayName: 'Board',
    getDefaultProps() {
        return {
            disks: createEmptyBoard
        };
    },
    propTypes: {
        size: React.PropTypes.number.isRequired,
        disks: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(
                React.PropTypes.oneOf([ EMPTY_DISK, LIGHT_DISK, DARK_DISK ])
            )
        )
    },
    render() {
        let rows = createEmptyArray(this.props.size).
            map((oneItem, index) =>
                React.createElement(BoardRow, {
                    key: index,
                    size: this.props.size,
                    disks: this.props.disks[index]
                })
            );

        return DOM.div({ id: 'board', className: 'ratio-1by1 center' },
            DOM.div({ className: 'row row--full' }, rows)
        );
    }
});
