'use strict';

/**
 * @param {number} size
 * @return {Array.<undefined>}
 */
let getAnEmptyArray = function(size) {
    return (new Array(size)).fill(undefined);
};

/**
 * Get an inclusive range: [first..last]
 *
 * @param {number} start
 * @param {number} end
 * @param {number=} length
 * @return {Array.<number>}
 */
let range = function range(start, end, length = Math.abs(end - start) + 1) {
    let step = (length === 1) ? 0 : (end - start) / (length - 1);
    return getAnEmptyArray(length).
        map((v, i) => start + (step * i));
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
let zip = function(arr1, arr2) {
    return arr1.map((v, i) => [ v, arr2[i] ]);
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
     * @param {{ col: number, row: number }}
     * @return {boolean}
     */
    areCoordinatesValid({ col, row }) {
        return (
            col >= 0 && col < this.size &&
            row >= 0 && row < this.size
        );
    }

    /**
     * @param {{ col: number, row: number }} from
     * @param {{ col: number, row: number }} to
     * @return {Array.<{ col: number, row: number }>}
     */
    getCoordinatesBetween(from, to) {
        let dx = Math.abs(from.col - to.col);
        let dy = Math.abs(from.row - to.row);
        let length = Math.max(dx, dy) + 1;

        let colSteps = range(from.col, to.col, length).map(Math.round);
        let rowSteps = range(from.row, to.row, length).map(Math.round);

        return zip(colSteps, rowSteps).map(([ col, row ]) => {
            return { col, row };
        });
    }

    /**
     * @param {{ col: number, row: number }}
     * @param {*=} value
     * @return {Board}
     */
    setField({ col, row }, value = Board.EMPTY_FIELD) {
        let prevValue = this.getField({ col, row });
        if (prevValue === value) {
            return this;
        }

        this.occurrences.
            set(prevValue, this.occurrences.get(prevValue) - 1).
            set(value, (this.occurrences.get(value) || 0) + 1);

        this.data[col][row] = value;

        return this;
    }

    /**
     * @param {{ col: number, row: number }} from
     * @param {{ col: number, row: number }} to
     * @param {*=} value
     * @return {Board}
     */
    setFields(from, to, value = Board.EMPTY_FIELD) {
        this.getCoordinatesBetween(from, to).
            forEach(({ col, row }) => this.setField({ col, row }, value));

        return this;
    }

    /**
     * @param {{ col: number, row: number }}
     * @throws {Error}
     * @return {*}
     */
    getField({ col, row }) {
        if (!this.areCoordinatesValid({ col, row })) {
            throw new Error('Invalid coordinates!');
        }

        return this.data[col][row];
    }

    /**
     * @param {{ col: number, row: number }} from
     * @param {{ col: number, row: number }} to
     * @return {Array.<{ col: number, row: number, value: * }>}
     */
    getFields(from, to) {
        return this.getCoordinatesBetween(from, to).
            map(({ col, row }) => {
                return { col, row, value: this.getField({ col, row }) };
            });
    }

    /**
     * @return {boolean}
     */
    isFull() {
        return (this.occurrences.get(Board.EMPTY_FIELD) === 0);
    }

    /**
     * @return {boolean}
     */
    isEmpty() {
        return (
            this.occurrences.get(Board.EMPTY_FIELD) === Math.pow(this.size, 2)
        );
    }

    /**
     * @return {string}
     */
    toString() {
        return getAnEmptyArray(this.size).
            map((v, row) => {
                let valuesInOneRow = getAnEmptyArray(this.size).
                    map((v, col) => this.data[col][row]);

                return valuesInOneRow.
                    map((v) => (v === Board.EMPTY_FIELD) ?
                        '.' : v.toString().substr(0, 1)
                    ).
                    join('');
            }).
            reverse().
            join('\n');
    }
}

Board.EMPTY_FIELD = null;
