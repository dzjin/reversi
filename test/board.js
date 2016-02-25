/*global describe, it, beforeEach */
'use strict';

import 'babel-polyfill';

import assert from 'assert';
import Board from '../app/scripts/Board';

let getAnEmptyArray = (size) =>
    (new Array(size)).fill(undefined);

describe('Board', () => {
    let size = 8;
    let board;
    beforeEach(() => {
        board = new Board(size);
    });

    describe('#constructor()', () => {
        it('should set the size property', () => {
            assert.equal(board.size, size);
        });

        it('should set the data property', () => {
            assert.deepEqual(
                board.data,
                getAnEmptyArray(size).
                    fill(getAnEmptyArray(size).fill(Board.EMPTY_FIELD))
            );
        });

        it('should set the occurrences property', () => {
            assert.equal(
                board.occurrences.get(Board.EMPTY_FIELD),
                Math.pow(size, 2)
            );
        });
    });

    describe('#areCoordinatesValid()', () => {
        it('should validate the coordinate', () => {
            assert.equal(board.areCoordinatesValid([ 0, 0 ]), true);
            assert.equal(
                board.areCoordinatesValid([ size - 1, size - 1 ]), true
            );
            assert.equal(board.areCoordinatesValid([ 0, -1 ]), false);
            assert.equal(board.areCoordinatesValid([ size, 0 ]), false);
        });
    });

    describe('#getCoordinatesBetween()', () => {
        it('should return with a shortest path between x and y', () => {
            let x;
            let y;

            /*  3 . . . .
             *  2 . . y .
             *  1 . * . .
             *  0 x . . .
             *    0 1 2 3
             */
            x = [ 0, 0 ];
            y = [ 2, 2 ];
            assert.deepEqual(
                board.getCoordinatesBetween(x, y), [ x, [ 1, 1 ], y ]
            );
            assert.deepEqual(
                board.getCoordinatesBetween(y, x), [ y, [ 1, 1 ], x ]
            );

            /*  3 . . . .
             *  2 . . . .
             *  1 . . . .
             *  0 x . . .
             *    0 1 2 3
             */
            assert.deepEqual(
                board.getCoordinatesBetween(x, x), [ x ]
            );

            /*  3 . . . .
             *  2 . . . y
             *  1 . * * .
             *  0 x . . .
             *    0 1 2 3
             */
            y = [ 3, 2 ];
            assert.deepEqual(
                board.getCoordinatesBetween(x, y), [ x, [ 1, 1 ], [ 2, 1 ], y ]
            );
        });
    });

    describe('#setField()', () => {
        it('should throw an error if the coordinates are invalid', () => {
            assert.throws(() => board.setField([ 0, size + 1 ]), Error);
        });

        it('should be chainable', () => {
            assert.equal(board.setField([ 0, 0 ]) instanceof Board, true);
        });

        it('should set the field value', () => {
            assert.notEqual(board.data[1][2], 'test');
            board.setField([ 1, 2 ], 'test');
            assert.equal(board.data[1][2], 'test');
        });

        it('should clear the field value without a second parameter', () => {
            board.setField([ 1, 2 ], 'test');
            assert.equal(board.data[1][2], 'test');
            board.setField([ 1, 2 ]);
            assert.equal(board.data[1][2], Board.EMPTY_FIELD);
        });
    });

    describe('#setFields()', () => {
        it('should throw an error if the coordinates are invalid', () => {
            assert.throws(
                () => board.setFields([ 0, 0 ], [ 0, size + 1 ]), Error
            );
        });

        it('should be chainable', () => {
            assert.equal(
                board.setFields([ 0, 0 ], [ 1, 1 ]) instanceof Board, true
            );
        });

        it('should set the field values', () => {
            assert.notEqual(board.data[1][2], 'test');
            assert.notEqual(board.data[2][2], 'test');
            board.setFields([ 1, 2 ], [ 2, 2 ], 'test');
            assert.equal(board.data[1][2], 'test');
            assert.equal(board.data[2][2], 'test');
        });

        it('should clear the field value without a second parameter', () => {
            board.setFields([ 1, 2 ], [ 2, 2 ], 'test');
            assert.equal(board.data[1][2], 'test');
            assert.equal(board.data[2][2], 'test');
            board.setFields([ 1, 2 ], [ 2, 2 ]);
            assert.equal(board.data[1][2], Board.EMPTY_FIELD);
            assert.equal(board.data[2][2], Board.EMPTY_FIELD);
        });
    });

    describe('#getField()', () => {
        it('should throw an error if the coordinates are invalid', () => {
            assert.throws(() => board.getField([ -1, 0 ]));
        });

        it('should return white the field value', () => {
            board.setField([ 0, 0 ], 12);
            assert.equal(board.getField([ 0, 0 ]), 12);
        });
    });

    describe('#getFields()', () => {
        it('should throw an error if the coordinates are invalid', () => {
            assert.throws(() => board.getFields([ -1, 0 ], [ 0, 0 ]));
        });

        it('should return white the fields value', () => {
            board.setField([ 0, 0 ], 1);
            board.setField([ 0, 1 ], 2);
            assert.deepEqual(
                board.getFields([ 0, 0 ], [ 0, 1 ]),
                [
                    { coordinates: [ 0, 0 ], value: 1 },
                    { coordinates: [ 0, 1 ], value: 2 }
                ]
            );
        });
    });

    describe('#getEmptyFields()', () => {
        it('should return with the coordinates of the empty fields', () => {
            board = new Board(1);
            assert.deepEqual(board.getEmptyFields(), [ [ 0, 0 ] ]);
            board.setField([ 0, 0 ], 1);
            assert.deepEqual(board.getEmptyFields(), [ ]);
            board.setField([ 0, 0 ], Board.EMPTY_FIELD);
            assert.deepEqual(board.getEmptyFields(), [ [ 0, 0 ] ]);
        });
    });

    describe('#isFull()', () => {
        it('should return true if the board is full', () => {
            board = new Board(1);
            assert.equal(board.isFull(), false);
            board.setField([ 0, 0 ], 1);
            assert.equal(board.isFull(), true);
            board.setField([ 0, 0 ], Board.EMPTY_FIELD);
            assert.equal(board.isFull(), false);
        });
    });

    describe('#isEmpty()', () => {
        it('should return true if the board is empty', () => {
            board = new Board(1);
            assert.equal(board.isEmpty(), true);
            board.setField([ 0, 0 ], 1);
            assert.equal(board.isEmpty(), false);
            board.setField([ 0, 0 ], Board.EMPTY_FIELD);
            assert.equal(board.isEmpty(), true);
        });
    });

    describe('#toString()', () => {
        it('should draw the board', () => {
            board = new Board(2);
            assert.equal(board.toString(), '..\n..');
            board.setFields([ 0, 0 ], [ 1, 1 ], 'l');
            board.setFields([ 0, 1 ], [ 1, 0 ], 'd');
            assert.equal(board.toString(), 'dl\nld');
        });
    });

    describe('#[Symbol.iterator]()', () => {
        it('should iterate over the fields (in order)', () => {
            board = new Board(2);
            board.setField([ 0, 0 ], 1);

            let fields = [];
            for (let oneField of board) {
                fields.push(oneField);
            }

            assert.deepEqual(
                fields,
                [
                    { coordinates: [ 0, 0 ], value: 1 },
                    { coordinates: [ 0, 1 ], value: Board.EMPTY_FIELD },
                    { coordinates: [ 1, 0 ], value: Board.EMPTY_FIELD },
                    { coordinates: [ 1, 1 ], value: Board.EMPTY_FIELD }
                ]
            );
        });
    });
});
