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
        this.state = this.game.getGameState();
    }

    /**
     * @param {{ row: number, col: number, cellName: string, cellValue: * }}
     */
    clickHandler({ row, col }) {
        try {
            let state = this.game.
                move({ row, col /*, color: this.props.myColor */ }).
                getGameState();

            this.setState(state);
        } catch (e) {
            console.error(e.message);
        }
    }

    render() {
        let ScoreElement = React.createElement(Score, {
            onMove: this.state.onMove,
            scores: this.state.scores
        });

        let ReactBoardElement = React.createElement(ReactBoard, {
            size: this.game.boardSize,
            values: this.state.disks,
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
