'use strict';

import React from 'react';
import Score from './Score';
import ReactBoard from 'ReactBoard';
import { capitalize, one } from '../helpers';
import Game from '../Game';
import pkg from '../../../package.json';

let DOM = React.DOM;


export default class ReversiApp extends React.Component {
    constructor(props) {
        super(props);

        this.game = new Game();
        this.state = {
            onMove: this.game.onMove,
            scores: this.game.scores,
            disks: this.game.board.data,
            lastMove: null,
            gameState: 'ready'
        };
    }

    /**
     * @param {
     *   { col: number, row: number, cellName: string, cellValue: * }
     * } data
     */
    clickHandler({ col, row }) {
        if (this.state.gameState !== 'ready') { return; }

        let coordinates = [ col, row ];
        try {
            this.game.move(coordinates);
        } catch (e) {
            this.setState({ gameState: 'error' });

            let $boardContainer = this.refs.boardContainer.getDOMNode();
            one($boardContainer, 'animationend', () =>
                this.setState({ gameState: 'ready' })
            );
            return;
        }

        this.setState({
            onMove: this.game.onMove,
            scores: this.game.scores,
            disks: this.game.board.data,
            lastMove: coordinates
        });
    }

    render() {
        let ScoreElement = React.createElement(Score, {
            onMove: this.state.onMove,
            scores: this.state.scores
        });

        let highlight = (this.state.lastMove) ? [ this.state.lastMove ] : [];

        let ReactBoardElement = React.createElement(ReactBoard, {
            size: this.game.board.size,
            values: this.state.disks,
            highlight,
            clickHandler: this.clickHandler.bind(this)
        });

        return DOM.div({ className: 'app', 'data-state': this.state.gameState },
            DOM.header({ className: 'row row--center' },
                DOM.div({ className: 'col' }, ScoreElement),
                DOM.div({ className: 'col u-text-right' },
                    DOM.h1(null, capitalize(pkg.name)),
                    DOM.small(null, pkg.description)
                )
            ),
            DOM.main({ className: 'container' },
                DOM.div(
                    {
                        className: 'ratio-1by1 center react-board-container',
                        ref: 'boardContainer'
                    },
                    ReactBoardElement
                )
            ),
            DOM.footer({ className: 'u-text-right' },
                'Fork me on ',
                DOM.a({ href: pkg.repository.url, target: '_blank' }, 'GitHub')
            )
        );
    }
}
