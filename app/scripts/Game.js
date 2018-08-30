'use strict';

import Board from './Board';


export default class Game {
    /**
     * @param {number=} size
     */
    constructor(size = 9) {
        let [firstPlayer, secondPlayer] = Game.players;

        this.onMove = firstPlayer;

        this.board = new Board(size);

        // Set the two rows
        [0,].forEach(r => {
            for (let i = 0; i < size; i++) {
                this.board.setField([r, i], firstPlayer);
            }
        });
        [8].forEach(r => {
            for (let i = 0; i < size; i++) {
                this.board.setField([r, i], secondPlayer);
            }
        });
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
        console.log('ARGS', arguments);
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
    getCapturedDisks([x, y], color = this.onMove) {
        console.log('Args', arguments)
        let capturedDisks = [];

        const coordinatesToCheck = [
            [x + 2, y],
            [x, y + 2],
            [x - 2, y],
            [x, y - 2],
        ];
        const normalCells = coordinatesToCheck.filter(coord => {
            return coord[0] >= 0 && coord[0] < this.board.size && coord[1] > 0 && coord[1] < this.board.size;
        });
        normalCells.forEach(coord => {
            capturedDisks.push(...this.getCapturedDisksFromOneRange([x, y], coord))
        });

        console.log('hello')

        const nearBy = this.getNearbyCells([x, y]).filter(r => {
            return r[0] == 0 && r[1] == 0
                || r[0] == 0 && r[1] == this.board.size - 1
                || r[0] == this.board.size - 1 && r[1] == 0
                || r[0] == this.board.size - 1 && r[1] == this.board.size - 1;
        });

        console.log('hello!', nearBy)
        // Are any corner pieces targeted?

        nearBy.forEach(cell => {
            const nearByBy = this.getNearbyCells(cell).filter(coord => {
                return coord[0] >= 0 && coord[0] < this.board.size && coord[1] > 0 && coord[1] < this.board.size;
            });
            let count = 0;
            nearByBy.forEach(r => {
                const val = this.board.getField(r);
                console.log('VALUE OF THE SURROUNDING CELL', r, val);
                if (val === this.onMove) {
                    count += 1;
                }
            })
            console.log('COUNT', count, this.onMove);
            if (count == 2) {
                capturedDisks.push(cell);
            }
        });
        console.log('captured disks', capturedDisks);
        return capturedDisks;
    }

    getNearbyCells([x, y]) {
        const nearBy = [
            [x + 1, y],
            [x, y + 1],
            [x - 1, y],
            [x, y - 1],
        ];
        return nearBy;
    }

    /**
     * @param {Array.<number>} coordinates
     * @param {string=} color
     * @return {{ isValid: boolean, errorMsg: string|undefined }}
     */
    validateMove(selectedCoords, coordinates, color = this.onMove) {
        if (this.onMove !== color) {
            return { isValid: false, errorMsg: 'It\'s not your turn.' };
        }

        let fieldValue;
        try {
            fieldValue = this.board.getField(coordinates);
            if (fieldValue != null) {
                return { isValid: false };
            }
        } catch (e) {
            return { isValid: false, errorMsg: e.message };
        }

        let movement;
        if (selectedCoords[1] == coordinates[1]) {
            movement = 'horizontal';
        }
        if (selectedCoords[0] == coordinates[0]) {
            movement = 'vertical';
        }
        if (!movement) return { isValid: false };

        // const empty = this.board.getEmptyFields();

        // console.log('EMPTY', empty)

        // idea
        // if the entire path exists, then we good
        if (movement == 'horizontal') {
            // const possibleHorizontal = empty.filter(r => r[1] == selectedCoords[1]);
            let min = Math.min(selectedCoords[0], coordinates[0]);
            let max = Math.max(selectedCoords[0], coordinates[0]);

            // console.log('Min, max', min, max);
            for (let i = min + 1; i < max; i++) {
                const taken = this.board.getField([i, coordinates[1]]);
                if (taken) {
                    return { isValid: false };
                }
            }
        }
        if (movement == 'vertical') {
            let min = Math.min(selectedCoords[1], coordinates[1]);
            let max = Math.max(selectedCoords[1], coordinates[1]);
            for (let i = min + 1; i < max; i++) {
                const taken = this.board.getField([coordinates[0], i]);
                if (taken) {
                    return { isValid: false };
                }
            }
        }
        return { isValid: true };
    }

    /**
     * @param {string=} color
     * @return {Array.<Array.<number>>}
     */
    getValidMoves(selectedCoords, color = this.onMove) {
        return this.board.getEmptyFields().
            filter(coordinates =>
                this.validateMove(selectedCoords, coordinates, color).isValid
            );
    }

    /**
     * @param {string=} color
     * @return {boolean}
     */
    // haveToPass(color = this.onMove) {
    //     return (this.getValidMoves(color).length === 0);
    // }

    /**
     * @param {Array.<number>} coordinates
     * @param {string=} color
     * @throws {Error}
     * @return {Game}
     */
    move(from, coordinates, color = this.onMove) {
        let { isValid, errorMsg } = this.validateMove(from, coordinates, color);
        console.log(' get to here', isValid);
        if (!isValid) {
            throw new Error(`Invalid move! ${errorMsg}`);
        }

        this.board.setField(from, Board.EMPTY_FIELD);
        this.board.setField(coordinates, color);
        console.log('checkpt 1')
        this.getCapturedDisks(coordinates).forEach(oneField => {
            console.log('SETTING FIELD', oneField);
            this.board.setField(oneField, Board.EMPTY_FIELD)
        });
        console.log('checkpt 2')


        // let switched = 0;
        // do {
        this.onMove = (this.onMove === Game.players[0]) ?
            Game.players[1] : Game.players[0];

        //     console.log('ON MOVE', this.onMove);
        //     switched += 1;
        // } while (switched < 3 && this.haveToPass());

        // if (switched === 3) {
        //     this.onMove = null;
        // }

        return this;
    }
}

Game.players = ['dark', 'light'];
