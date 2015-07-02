'use strict';

/**
 * @param {number} size
 * @return {Array.<undefined>}
 */
let getAnEmptyArray = function(size) {
    return (new Array(size)).fill(undefined);
};


export default class Board {
    /**
     * @param {number} size
     */
    constructor(size) {
        this.size = size;

        this.data = getAnEmptyArray(size).
            map(() => getAnEmptyArray(size).fill(Board.EMPTY_FIELD));

        this.occurrences = new Map();
        this.occurrences.set(Board.EMPTY_FIELD, Math.pow(size, 2));
    }

    /**
     * @param {{ row: number, col: number }}
     * @return {boolean}
     */
    areCoordinatesValid({ row, col }) {
        return (
            row >= 0 && row < this.size &&
            col >= 0 && col < this.size
        );
    }

    /**
     * @param {{ row: number, col: number, value: *= }}
     * @return {Board}
     */
    setField({ row, col, value = Board.EMPTY_FIELD }) {
        let prevValue = this.getField({ row, col });
        if (prevValue === value) {
            return this;
        }

        this.occurrences.
            set(prevValue, this.occurrences.get(prevValue) - 1).
            set(value, (this.occurrences.get(value) || 0) + 1);

        this.data[row][col] = value;

        return this;
    }

    /**
     * @param {{ row: number, col: number }}
     * @throws {Error}
     * @return {*}
     */
    getField({ row, col }) {
        if (!this.areCoordinatesValid({ row, col })) {
            throw new Error('Invalid coordinates!');
        }

        return this.data[row][col];
    }

    /**
     * @return {boolean}
     */
    isFull() {
        return (this.occurrences.get(Board.EMPTY_FIELD) === 0);
    }

    /**
     * @return {string}
     */
    toString() {
        return this.data.
            reduce((soFar, oneRow) => {
                let rowRepresentation = oneRow.reduce((soFar, field) => {
                    let str = (field === Board.EMPTY_FIELD) ?
                        '.' : field.toString().substr(0, 1);
                    return soFar + str;
                }, '');

                return soFar.concat(rowRepresentation);
            }, []).
            reverse().
            join('\n');
    }
}

Board.EMPTY_FIELD = null;
