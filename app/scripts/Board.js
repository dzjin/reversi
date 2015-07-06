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
     * @param {Array.<number>} coordinates
     * @return {boolean}
     */
    areCoordinatesValid([ x, y ]) {
        return (
            x >= 0 && y < this.size &&
            x >= 0 && y < this.size
        );
    }

    /**
     * @param {Array.<number>} from
     * @param {Array.<number>} to
     * @return {Array.<Array.<number>>}
     */
    getCoordinatesBetween([ x1, y1 ], [ x2, y2 ]) {
        let dx = Math.abs(x1 - x2);
        let dy = Math.abs(y1 - y2);
        let length = Math.max(dx, dy) + 1;

        let xCoordinates = range(x1, x2, length).map(Math.round);
        let yCoordinates = range(y1, y2, length).map(Math.round);

        return zip(xCoordinates, yCoordinates);
    }

    /**
     * @param {Array.<number>} coordinates
     * @param {*=} value
     * @throws {Error}
     * @return {Board}
     */
    setField([ x, y ], value = Board.EMPTY_FIELD) {
        let prevValue = this.getField([ x, y ]);
        if (prevValue === value) {
            return this;
        }

        this.occurrences.
            set(prevValue, this.occurrences.get(prevValue) - 1).
            set(value, (this.occurrences.get(value) || 0) + 1);

        this.data[x][y] = value;

        return this;
    }

    /**
     * @param {Array.<number>} from
     * @param {Array.<number>} to
     * @param {*=} value
     * @throws {Error}
     * @return {Board}
     */
    setFields(from, to, value = Board.EMPTY_FIELD) {
        this.getCoordinatesBetween(from, to).
            forEach(coordinates => this.setField(coordinates, value));

        return this;
    }

    /**
     * @param {Array.<number>} coordinates
     * @throws {Error}
     * @return {*}
     */
    getField([ x, y ]) {
        if (!this.areCoordinatesValid([ x, y ])) {
            throw new Error('Invalid coordinates!');
        }

        return this.data[x][y];
    }

    /**
     * @param {Array.<number>} from
     * @param {Array.<number>} to
     * @throws {Error}
     * @return {Array.<{ coordinates: Array.<number>, value: * }>}
     */
    getFields(from, to) {
        return this.getCoordinatesBetween(from, to).
            map(coordinates => {
                return { coordinates, value: this.getField(coordinates) };
            });
    }

    /**
     * @return {Array.<Array.<number>>}
     */
    getEmptyFields() {
        return Array.from(this).
            filter(({ value }) => (value === Board.EMPTY_FIELD)).
            map(({ coordinates }) => coordinates);
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
            map((_, y) => {
                let valuesInOneRow = getAnEmptyArray(this.size).
                    map((_, x) => this.data[x][y]);

                return valuesInOneRow.
                    map(fieldValue => (fieldValue === Board.EMPTY_FIELD) ?
                        '.' : fieldValue.toString().substr(0, 1)
                    ).
                    join('');
            }).
            reverse().
            join('\n');
    }

    *[Symbol.iterator]() {
        for (let x = 0; x < this.size; x += 1) {
            for (let y = 0; y < this.size; y += 1) {
                yield { coordinates: [ x, y ], value: this.data[x][y] };
            }
        }
    }
}

Board.EMPTY_FIELD = null;
