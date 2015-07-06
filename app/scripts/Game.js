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
            setField({ col: center, row: center }, first).
            setField({ col: center + 1, row: center }, second).
            setField({ col: center, row: center + 1 }, second).
            setField({ col: center + 1, row: center + 1 }, first);
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
     * @param {{ col: number, row: number }} from
     * @param {{ col: number, row: number }} to
     * @param {string=} color
     * @return {Array.<{ col: number, row: number }>}
     */
    getCapturedDisksFromOneRange(from, to, color = this.onMove) {
        let capturedDisks = [];

        let disks = this.board.getFields(from, to).slice(1);
        for (let { col, row, value } of disks) {
            switch (value) {
            case Board.EMPTY_FIELD:
                return [];
            case color:
                return capturedDisks;
            default: // opposite color
                capturedDisks.push({ col, row });
            }
        }

        return [];
    }

    /**
     * @param {{ col: number, row: number }}
     * @param {string=} color
     * @return {Array.<{ col: number, row: number }>}
     */
    getCapturedDisks({ col, row }, color = this.onMove) {
        let capturedDisks = [];

        /**
         * @param {{ col: number, row: number }} to
         * @return {Array.<{ col: number, row: number }>}
         */
        let getCapturedDisksUntil = (to) =>
            this.getCapturedDisksFromOneRange({ col, row }, to, color);

        let max = this.board.size - 1;
        let min = 0;
        let diff;

        // . * .
        // . - .
        // . . .
        capturedDisks.push(
            ...getCapturedDisksUntil({ col, row: max })
        );

        // . . *
        // . - .
        // . . .
        diff = Math.min(max - col, max - row);
        capturedDisks.push(
            ...getCapturedDisksUntil({ col: col + diff, row: row + diff })
        );

        // . . .
        // . - *
        // . . .
        capturedDisks.push(
            ...getCapturedDisksUntil({ col: max, row })
        );

        // . . .
        // . - .
        // . . *
        diff = Math.min(max - col, row);
        capturedDisks.push(
            ...getCapturedDisksUntil({ col: col + diff, row: row - diff })
        );

        // . . .
        // . - .
        // . * .
        capturedDisks.push(
            ...getCapturedDisksUntil({ col, row: min })
        );

        // . . .
        // . - .
        // * . .
        diff = Math.min(col, row);
        capturedDisks.push(
            ...getCapturedDisksUntil({ col: col - diff, row: row - diff })
        );

        // . . .
        // * - .
        // . . .
        capturedDisks.push(
            ...getCapturedDisksUntil({ col: min, row })
        );

        // * . .
        // . - .
        // . . .
        diff = Math.min(col, max - row);
        capturedDisks.push(
            ...getCapturedDisksUntil({ col: col - diff, row: row + diff })
        );

        return capturedDisks;
    }

    /**
     * @param {{ col: number, row: number }
     * @param {string=} color
     * @return {{ isValid: boolean, errorMsg: string|undefined }}
     */
    validateMove({ col, row }, color = this.onMove) {
        if (this.onMove !== color) {
            return { isValid: false, errorMsg: 'It\'s not your turn.' };
        }

        let fieldValue;
        try {
            fieldValue = this.board.getField({ col, row });
        } catch (e) {
            return { isValid: false, errorMsg: e.message };
        }

        if (fieldValue !== Board.EMPTY_FIELD) {
            return { isValid: false, errorMsg: 'The cell is not empty.' };
        }

        if (this.getCapturedDisks({ col, row }).length === 0) {
            return { isValid: false, errorMsg: 'No captured disk.' };
        }

        return { isValid: true };
    }

    /**
     * @param {string=} color
     * @return {Array.<{ col: number, row: number }>}
     */
    getValidMoves(color = this.onMove) {
        return this.board.getEmptyFields().
            filter((coordinates) =>
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
     * @param {{ col: number, row: number }}
     * @param {string=} color
     * @throws {Error}
     * @return {Game}
     */
    move({ col, row }, color = this.onMove) {
        let { isValid, errorMsg } = this.validateMove({ col, row }, color);
        if (!isValid) {
            throw new Error(`Invalid move! ${errorMsg}`);
        }

        this.board.setField({ col, row }, color);
        this.getCapturedDisks({ col, row }).forEach((oneField) =>
            this.board.setField(oneField, color)
        );

        let switched = 0;
        do {
            this.onMove = getOppositeColor(this.onMove);
            switched += 1;
        } while(switched < 3 && this.haveToPass());

        if (switched === 3) {
            this.onMove = null;
        }

        return this;
    }
}

Game.players = [ 'light', 'dark' ];
