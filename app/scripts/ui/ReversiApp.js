'use strict';

import React from 'react';
import Score from './Score';
import Modal from './Modal';
import ReactBoard from 'react-board';
import { capitalize, one } from '../helpers';
import Game from '../Game';
import pkg from '../../../package.json';

let DOM = React.DOM;


export default class ReversiApp extends React.Component {
    constructor(props) {
        super(props);

        this.clickHandler = this.clickHandler.bind(this);
        this.restartRequestHandler = this.restartRequestHandler.bind(this);
        this.modalCloseRequestHandler = this.modalCloseRequestHandler.
            bind(this);

        this.game = new Game();
        this.state = this.getFirstState();
    }

    getFirstState(game) {
        return {
            onMove: this.game.onMove,
            scores: this.game.scores,
            disks: this.game.board.data,
            lastMove: null,
            gameState: 'ready',
            isModalOpen: false,
            invalidMoves: 0
        };
    }

    modalCloseRequestHandler() {
        this.setState({ isModalOpen: false });
    }

    restartRequestHandler() {
        this.game = new Game();
        this.setState(this.getFirstState());
    }

    /**
     * @param {Array.<number>} coordinates
     */
    move(coordinates) {
        try {
            this.game.move(coordinates);
        } catch (e) {
            this.setState({ gameState: 'error' });

            let $boardContainer = this.refs.boardContainer;
            one($boardContainer, 'animationend', () =>
                this.setState({
                    gameState: 'ready',
                    invalidMoves: this.state.invalidMoves + 1
                })
            );
            return;
        }

        this.setState({
            onMove: this.game.onMove,
            scores: this.game.scores,
            disks: this.game.board.data,
            invalidMoves: 0,
            lastMove: coordinates
        });
    }

    /**
     * @param {{ col: number, row: number, cellName: string, cellValue: * }} d
     */
    clickHandler({ col, row }) {
        if (this.state.gameState !== 'ready') { return; }

        this.move([ col, row ]);

        let isEnded = (this.game.onMove === null);
        if (isEnded) {
            this.setState({ gameState: 'ended' });
            setTimeout(() => this.setState({ isModalOpen: true }), 300);
        }
    }

    /**
     * @param {string=} highlighted
     * @return {ReactElement}
     */
    getScoreElement(highlighted = this.state.onMove) {
        return React.createElement(Score, {
            highlighted,
            scores: this.state.scores
        });
    }

    /**
     * @return {ReactElement}
     */
    getReactBoardElement() {
        let highlight;
        if (this.state.invalidMoves > 2) {
            highlight = this.game.getValidMoves();
        } else if (this.state.lastMove !== null) {
            highlight = [ this.state.lastMove ];
        }

        return React.createElement(ReactBoard, {
            size: this.game.board.size,
            values: this.state.disks,
            highlight,
            clickHandler: this.clickHandler
        });
    }

    /**
     * @return {ReactElement}
     */
    getModalElement() {
        switch (this.state.gameState) {
        case 'ended':
            let [ firstPlayer, secondPlayer ] = Game.players;
            let scores = this.game.scores;
            let winner;
            if (scores[firstPlayer] > scores[secondPlayer]) {
                winner = firstPlayer;
            } else if (scores[firstPlayer] < scores[secondPlayer]) {
                winner = secondPlayer;
            } else {
                winner = null;
            }

            return React.createElement(Modal,
                { isVisible: this.state.isModalOpen },
                DOM.h2(null, 'The game ended'),
                this.getScoreElement(winner),
                DOM.div({ className: 'controls' },
                    DOM.a(
                        { className: 'btn btn--primary',
                            onClick: this.restartRequestHandler },
                        'restart'
                    ),
                    ' ',
                    DOM.a(
                        { className: 'btn',
                            onClick: this.modalCloseRequestHandler },
                        'close'
                    )
                )
            );
        default:
            return null;
        }
    }

    /**
     * @return {ReactElement}
     */
    render() {
        return DOM.div(
            { className: 'stretch-height-container',
                'data-state': this.state.gameState },
            DOM.header({ className: 'row row--center' },
                DOM.div({ className: 'col col--1of3' }, this.getScoreElement()),
                DOM.div({ className: 'col u-text-right' },
                    DOM.h1(null, capitalize(pkg.name)),
                    DOM.small({ className: 'u-hidden-xs' }, pkg.description)
                )
            ),
            DOM.main({ className: 'container stretch-height' },
                DOM.div(
                    { className: 'ratio-1by1 center react-board-container',
                        ref: 'boardContainer' },
                    this.getReactBoardElement()
                )
            ),
            DOM.footer({ className: 'u-text-right' },
                DOM.a({ href: 'https://en.wikipedia.org/wiki/Reversi#Rules',
                    target: '_blank' },
                    'Rules'
                ),
                ', ',
                DOM.a({ href: pkg.repository.url, target: '_blank' }, 'GitHub')
            ),
            this.getModalElement()
        );
    }
}
