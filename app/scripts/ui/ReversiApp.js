'use strict';

import React from 'react';
import Score from './Score';
import Modal from './Modal';
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
            gameState: 'ready',
            isModalOpen: false
        };
    }

    modalCloseRequestHandler() {
        this.setState({ isModalOpen: false });
    }

    restartRequestHandler() {
        this.constructor(this.props);
        this.forceUpdate();
    }

    /**
     * @param {Array.<number>} coordinates
     */
    move(coordinates) {
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

    /**
     * @param {{ col: number, row: number, cellName: string, cellValue: * }} d
     */
    clickHandler({ col, row, cellName }) {
        if (this.state.gameState !== 'ready') { return; }

        this.move([ col, row ]);

        let isEnded = (this.game.onMove === null);
        if (isEnded) {
            this.setState({ gameState: 'ended' });

            let $lastMove = this.refs.boardContainer.
                getDOMNode().
                querySelector(`[data-cell-name="${cellName}"]`);
            one($lastMove, 'transitionend', () =>
                this.setState({ isModalOpen: true })
            );
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
        let highlight = (this.state.lastMove) ? [ this.state.lastMove ] : [];

        return React.createElement(ReactBoard, {
            size: this.game.board.size,
            values: this.state.disks,
            highlight,
            clickHandler: this.clickHandler.bind(this)
        });
    }

    /**
     * @return {ReactElement}
     */
    getModal() {
        switch (this.state.gameState) {
        case 'ended':
            let [ firstPlayer, secondPlayer ] = Game.players;
            let scores = this.game.scores;
            let winner;
            if (scores[firstPlayer] > scores[secondPlayer] ) {
                winner = firstPlayer;
            } else if (scores[firstPlayer] < scores[secondPlayer]) {
                winner = secondPlayer;
            } else {
                winner = null;
            }

            return React.createElement(Modal,
                { visible: this.state.isModalOpen },
                DOM.h2(null, 'The game ended'),
                this.getScoreElement(winner),
                DOM.div({ className: 'controls' },
                    DOM.a(
                        { className: 'btn btn--primary',
                            onClick: this.restartRequestHandler.bind(this) },
                        'restart'
                    ),
                    ' ',
                    DOM.a(
                        { className: 'btn',
                            onClick: this.modalCloseRequestHandler.bind(this) },
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
        return DOM.div({ className: 'app', 'data-state': this.state.gameState },
            DOM.header({ className: 'row row--center' },
                DOM.div({ className: 'col col--1of3' }, this.getScoreElement()),
                DOM.div({ className: 'col u-text-right' },
                    DOM.h1(null, capitalize(pkg.name)),
                    DOM.small(null, pkg.description)
                )
            ),
            DOM.main({ className: 'container' },
                DOM.div(
                    { className: 'ratio-1by1 center react-board-container',
                        ref: 'boardContainer' },
                    this.getReactBoardElement()
                )
            ),
            DOM.footer({ className: 'u-text-right' },
                'Fork me on ',
                DOM.a({ href: pkg.repository.url, target: '_blank' }, 'GitHub')
            ),
            this.getModal()
        );
    }
}
