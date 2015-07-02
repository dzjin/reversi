'use strict';

import Board from './Board';

/**
 * @param {string} color
 * @return {string}
 */
let getOppositeColor = function(color) {
    let [ first, second ] = Game.players;
    return (color === first) ? second : first;
};


export default class Game {
    /**
     * @param {number=} size
     */
    constructor(size = 8) {
        let [ first, second ] = Game.players;

        this.onMove = first;

        let center = Math.floor((size - 1) / 2);
        this.board = (new Board(size)).
            setField({ row: center, col: center, value: first }).
            setField({ row: center, col: center + 1, value: second }).
            setField({ row: center + 1, col: center, value: second }).
            setField({ row: center + 1, col: center + 1, value: first });
    }

    /**
     * @return {number}
     */
    get boardSize() {
        return this.board.size;
    }

    /**
     * @return {{ string, number }}
     */
    get scores() {
        return Game.players.reduce((soFar, color) => {
            soFar[color] = this.board.occurrences.get(color);
            return soFar;
        }, {});
    }

    /**
     * @return {Array.<Array.<*>>}
     */
    get disks() {
        return this.board.data;
    }

    /**
     * @return {{
     *   onMove: string,
     *   disks: Array.<Array.<string>>,
     *   scores: {string, number}
     * }}
     */
    getGameState() {
        return {
            onMove: this.onMove,
            scores: this.scores,
            disks: this.disks
        };
    }

    /**
     * @param {{ row: number, col: number, color: string= }
     * @return {{ isValid: boolean, errorMsg: string|undefined }}
     */
    validateMove({ row, col, color = this.onMove }) {
        if (Game.players.indexOf(color) === -1) {
            return { isValid: false, errorMsg: 'Invalid color.' };
        }

        if (this.onMove !== color) {
            return { isValid: false, errorMsg: 'It\'s not your turn.' };
        }

        let value;
        try {
            value = this.board.getField({ row, col });
        } catch (e) {
            return { isValid: false, errorMsg: e.message };
        }

        if (value !== Board.EMPTY_FIELD) {
            return { isValid: false, errorMsg: 'The cell is not empty.' };
        }

        return { isValid: true };
    }

    /**
     * @param {{ row: number, col: number, color: string= }
     * @throws {Error}
     * @return {Game}
     */
    move({ row, col, color = this.onMove }) {
        let { isValid, errorMsg } = this.validateMove({ row, col, color });
        if (!isValid) {
            throw new Error(`Invalid move! ${errorMsg}`);
        }

        this.board.setField({ row, col, value: color });

        this.onMove = getOppositeColor(color);

        return this;
    }
}

Game.players = [ 'light', 'dark' ];
