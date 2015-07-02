'use strict';

import React from 'react';
import Score from './Score';
import ReactBoard from 'ReactBoard';
import { capitalize } from '../helpers';
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
            disks: this.game.disks,
            lastMove: null
        };
    }

    /**
     * @param {{ row: number, col: number, cellName: string, cellValue: * }}
     */
    clickHandler({ row, col }) {
        try {
            this.game.move({ row, col, color: this.props.myColor });
        } catch (e) {
            console.error(e.message);
            return;
        }

        this.setState({
            onMove: this.game.onMove,
            scores: this.game.scores,
            disks: this.game.disks,
            lastMove: null
        });

        // for DEBUG
        if (this.game.board.isFull()) { return; }
        let tick = setInterval(() => {
            let row = Math.floor(Math.random() * 8);
            let col = Math.floor(Math.random() * 8);

            try {
                this.game.move({ row, col, color: Game.players[1] });
            } catch (e) {
                return;
            }

            this.setState({
                onMove: this.game.onMove,
                scores: this.game.scores,
                disks: this.game.disks,
                lastMove: [ row, col ]
            });
            clearInterval(tick);
        }, 500);
    }

    render() {
        let ScoreElement = React.createElement(Score, {
            onMove: this.state.onMove,
            scores: this.state.scores
        });

        let ReactBoardElement = React.createElement(ReactBoard, {
            size: this.game.boardSize,
            values: this.state.disks,
            highlight: this.state.lastMove ? [ this.state.lastMove ] : [],
            clickHandler: this.clickHandler.bind(this)
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

ReversiApp.propTypes = {
    myColor: React.PropTypes.string
};

ReversiApp.defaultProps = {
    myColor: Game.players[0]
};
