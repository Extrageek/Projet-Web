import { assert, expect } from 'chai';

import { PuzzleManager } from './puzzle-manager.service';
import { Puzzle, PuzzleItem } from './../models/puzzle';

import * as puzzleManagerService from './puzzle-manager.service';

describe('Puzzle Manager Service', () => {
    it('should initialize a grid', done => {
        let puzzleManager: PuzzleManager = new puzzleManagerService.PuzzleManager();
        let puzzle1: Puzzle = new Puzzle();
        puzzle1 = puzzleManager.generateNewPuzzle();
        puzzle1._puzzle.forEach((row: PuzzleItem[]) => {
            row.forEach((item: PuzzleItem) => {
                console.log(item);
                //  assert(item.isHidden !== undefined);
                //  assert(item._value !== undefined);
                 assert(item !== undefined);
                // expect(item.isHidden).to.not.be.undefined;
                // expect(item._value).to.not.be.undefined;
            });
       });
       done();
    });
});
