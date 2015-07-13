'use strict';

import Board from './Board';


export default class Game {
    /**
     * @param {number=} size
     */
    constructor(size = 8) {
        let [ firstPlayer, secondPlayer ] = Game.players;

        this.onMove = firstPlayer;

        let center = Math.floor((size - 1) / 2);
        this.board = (new Board(size)).
            setField([ center, center ], firstPlayer).
            setField([ center + 1, center ], secondPlayer).
            setField([ center, center + 1 ], secondPlayer).
            setField([ center + 1, center + 1 ], firstPlayer);
    }

    /**
     * @return {{ string, number }}
     */
    get scores() {
        return Game.players.reduce((soFar, player) => {
            soFar[player] = this.board.occurrences.get(player);
            return soFar;
        }, {});
    }

    /**
     * @param {Array.<number>} from
     * @param {Array.<number>} to
     * @param {string=} color
     * @return {Array.<Array.<number>>}
     */
    getCapturedDisksFromOneRange(from, to, color = this.onMove) {
        let capturedDisks = [];

        let disks = this.board.getFields(from, to).slice(1);
        for (let { coordinates, value } of disks) {
            switch (value) {
            case Board.EMPTY_FIELD:
                return [];
            case color:
                return capturedDisks;
            default: // opposite color
                capturedDisks.push(coordinates);
            }
        }

        return [];
    }

    /**
     * @param {Array.<number>} coordinates
     * @param {string=} color
     * @return {Array.<Array.<number>>}
     */
    getCapturedDisks([ x, y ], color = this.onMove) {
        let capturedDisks = [];

        /**
         * @param {Array.<number>} to
         * @return {Array.<Array.<number>>}
         */
        let getCapturedDisksUntil = to =>
            this.getCapturedDisksFromOneRange([ x, y ], to, color);

        let max = this.board.size - 1;
        let min = 0;
        let diff;

        // . * .
        // . - .
        // . . .
        capturedDisks.push(
            ...getCapturedDisksUntil([ x, max ])
        );

        // . . *
        // . - .
        // . . .
        diff = Math.min(max - x, max - y);
        capturedDisks.push(
            ...getCapturedDisksUntil([ x + diff, y + diff ])
        );

        // . . .
        // . - *
        // . . .
        capturedDisks.push(
            ...getCapturedDisksUntil([ max, y ])
        );

        // . . .
        // . - .
        // . . *
        diff = Math.min(max - x, y);
        capturedDisks.push(
            ...getCapturedDisksUntil([ x + diff, y - diff ])
        );

        // . . .
        // . - .
        // . * .
        capturedDisks.push(
            ...getCapturedDisksUntil([ x, min ])
        );

        // . . .
        // . - .
        // * . .
        diff = Math.min(x, y);
        capturedDisks.push(
            ...getCapturedDisksUntil([ x - diff, y - diff ])
        );

        // . . .
        // * - .
        // . . .
        capturedDisks.push(
            ...getCapturedDisksUntil([ min, y ])
        );

        // * . .
        // . - .
        // . . .
        diff = Math.min(x, max - y);
        capturedDisks.push(
            ...getCapturedDisksUntil([ x - diff, y + diff ])
        );

        return capturedDisks;
    }

    /**
     * @param {Array.<number>} coordinates
     * @param {string=} color
     * @return {{ isValid: boolean, errorMsg: string|undefined }}
     */
    validateMove(coordinates, color = this.onMove) {
        if (this.onMove !== color) {
            return { isValid: false, errorMsg: 'It\'s not your turn.' };
        }

        let fieldValue;
        try {
            fieldValue = this.board.getField(coordinates);
        } catch (e) {
            return { isValid: false, errorMsg: e.message };
        }

        if (fieldValue !== Board.EMPTY_FIELD) {
            return { isValid: false, errorMsg: 'The cell is not empty.' };
        }

        if (this.getCapturedDisks(coordinates).length === 0) {
            return { isValid: false, errorMsg: 'No captured disk.' };
        }

        return { isValid: true };
    }

    /**
     * @param {string=} color
     * @return {Array.<Array.<number>>}
     */
    getValidMoves(color = this.onMove) {
        return this.board.getEmptyFields().
            filter(coordinates =>
                this.validateMove(coordinates, color).isValid
            );
    }

    /**
     * @param {string=} color
     * @return {boolean}
     */
    haveToPass(color = this.onMove) {
        return (this.getValidMoves(color).length === 0);
    }

    /**
     * @param {Array.<number>} coordinates
     * @param {string=} color
     * @throws {Error}
     * @return {Game}
     */
    move(coordinates, color = this.onMove) {
        let { isValid, errorMsg } = this.validateMove(coordinates, color);
        if (!isValid) {
            throw new Error(`Invalid move! ${errorMsg}`);
        }

        this.board.setField(coordinates, color);
        this.getCapturedDisks(coordinates).forEach(oneField =>
            this.board.setField(oneField, color)
        );

        let switched = 0;
        do {
            this.onMove = (this.onMove === Game.players[0]) ?
                Game.players[1] : Game.players[0];
            switched += 1;
        } while (switched < 3 && this.haveToPass());

        if (switched === 3) {
            this.onMove = null;
        }

        return this;
    }
}

Game.players = [ 'dark', 'light' ];
