'use strict';

import React from 'react';
import BoardCell from './BoardCell';

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
let createEmptyRow = (size) =>
    createEmptyArray(size).fill(EMPTY_DISK);


export default React.createClass({
    displayName: 'BoardRow',
    getDefaultProps() {
        return {
            disks: createEmptyRow
        };
    },
    propTypes: {
        size: React.PropTypes.number.isRequired,
        disks: React.PropTypes.arrayOf(
            React.PropTypes.oneOf([ EMPTY_DISK, LIGHT_DISK, DARK_DISK ])
        )
    },
    render() {
        let cells = createEmptyArray(this.props.size).
            map((oneItem, index) =>
                React.createElement(BoardCell, {
                    key: index,
                    value: this.props.disks[index]
                })
            );

        return DOM.div({ className: 'col row' }, cells);
    }
});
