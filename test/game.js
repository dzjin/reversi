/*global describe, it, beforeEach */
'use strict';

import assert from 'assert';
import Board from '../app/scripts/Board';
import Game from '../app/scripts/Game';

describe('Game', () => {
    let size = 8;
    let game;
    beforeEach(() => {
        game = new Game(size);
    });

    describe('#constructor()', () => {
        it('should set the onMove property', () => {
            assert.ok(Game.players.indexOf(game.onMove) > -1);
        });

        it('should set the board property', () => {
            assert.ok(game.board instanceof Board);
            let initialBoard = [
                '........',
                '........',
                '........',
                '...ld...',
                '...dl...',
                '........',
                '........',
                '........'
            ];
            assert.equal(game.board.toString(), initialBoard.join('\n'));
        });
    });

    describe('#score', () => {
        it('should set the score', () => {
            assert.deepEqual(game.scores, {
                [Game.players[0]]: 2,
                [Game.players[1]]: 2
            });
        });
    });
});
