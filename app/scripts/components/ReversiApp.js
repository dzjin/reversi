'use strict';

import React from 'react';
import Score from './Score';
import ReactBoard from 'ReactBoard';
import { capitalize } from '../helpers';
import pkg from '../../../package.json';

let DOM = React.DOM;

const BOARD_SIZE = 8;

/**
 * @return {Array.<Array.<string>>}
 */
let createInitialBoard = () => {
    let disks = (new Array(8)).
        fill(null).
        map(() => (new Array(BOARD_SIZE)).fill(''));

    let center = Math.floor((BOARD_SIZE - 1) / 2);

    disks[center][center] = 'light';
    disks[center][center + 1] = 'dark';
    disks[center + 1][center] = 'dark';
    disks[center + 1][center + 1] = 'light';

    return disks;
};

/**
 * @param {string} color
 * @return {string}
 */
let getOppositeColor = function(color) {
    return (color === 'light') ? 'dark' : 'light';
};


export default class ReversiApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onMove: 'light',
            scores: { light: 2, dark: 2 },
            disks: createInitialBoard(BOARD_SIZE)
        };
    }

    render() {
        let ScoreElement = React.createElement(Score, {
            onMove: this.state.onMove,
            scores: this.state.scores
        });

        let ReactBoardElement = React.createElement(ReactBoard, {
            size: BOARD_SIZE,
            values: this.state.disks,
            clickHandler: ({ row, col }) => {
                let disks = this.state.disks;
                disks[row][col] = getOppositeColor(disks[row][col]);

                this.setState({ disks });
            }
        });

        return DOM.div({ className: 'app' },
            DOM.header({ className: 'row row--center' },
                DOM.div({ className: 'col' }, ScoreElement),
                DOM.div({ className: 'col u-text-right' },
                    DOM.h1(null, capitalize(pkg.name)),
                    DOM.small(null, pkg.description)
                )
            ),
            DOM.main({ className: 'container' },
                DOM.div(
                    { className: 'ratio-1by1 center react-board-container' },
                    ReactBoardElement
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
}
