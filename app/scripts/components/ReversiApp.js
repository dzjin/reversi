'use strict';

import React from 'react';
import Score from './Score';
import ReactBoard from 'ReactBoard';
import { capitalize } from '../helpers';
import pkg from '../../../package.json';

let DOM = React.DOM;

const EMPTY_DISK = '';
const LIGHT_DISK = 'light';
const DARK_DISK = 'dark';

/**
 * @param {number} size
 */
let createInitialBoard = (size) => {
    let disks = (new Array(size)).
        fill(undefined).
        map(() =>
            (new Array(size)).fill(EMPTY_DISK)
        );

    let center = Math.floor((size - 1) / 2);

    disks[center][center] = LIGHT_DISK;
    disks[center][center + 1] = DARK_DISK;
    disks[center + 1][center] = DARK_DISK;
    disks[center + 1][center + 1] = LIGHT_DISK;

    return disks;
};


export default React.createClass({
    displayName: 'ReversiApp',
    getInitialState() {
        return {
            onMove: 'light',
            scores: { light: 2, dark: 2 },
            disks: createInitialBoard(this.props.size)
        };
    },
    propTypes: {
        size: React.PropTypes.number.isRequired
    },
    render() {
        return DOM.div({ className: 'app' },
            DOM.header({ className: 'row row--center' },
                DOM.div({ className: 'col' },
                    React.createElement(Score, {
                        onMove: this.state.onMove,
                        scores: this.state.scores
                    })
                ),
                DOM.div({ className: 'col u-text-right' },
                    DOM.h1(null, capitalize(pkg.name)),
                    DOM.small(null, pkg.description)
                )
            ),
            DOM.main({ className: 'container' },
                DOM.div(
                    { className: 'ratio-1by1 center react-board-container' },
                    React.createElement(ReactBoard, {
                        size: this.props.size,
                        values: this.state.disks,
                        clickHandler: ({ row, col }) => {
                            let disks = this.state.disks;
                            switch (disks[row][col]) {
                            case LIGHT_DISK:
                                disks[row][col] = DARK_DISK;
                                break;
                            default:
                                disks[row][col] = LIGHT_DISK;
                                break;
                            }

                            this.setState({ disks });
                        }
                    })
                )
            ),
            DOM.footer({ className: 'u-text-right' },
                'Fork me on ',
                DOM.a({ href: pkg.repository.url, target: '_blank' },
                    'GitHub'
                )
            )
        );
    }
});
