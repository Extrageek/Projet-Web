import { expect } from 'chai';

import { GridGenerationManager, Difficulty } from './grid-generation.service';
import { Puzzle, PuzzleItem } from './../models/puzzle';

const GRID_FULL = [
    [
        new PuzzleItem(4, true), new PuzzleItem(1, true), new PuzzleItem(5, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true),
        new PuzzleItem(9, true), new PuzzleItem(7, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(3, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(7, true), new PuzzleItem(9, true),
        new PuzzleItem(1, true), new PuzzleItem(8, false), new PuzzleItem(5, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, true), new PuzzleItem(9, true),
        new PuzzleItem(2, false), new PuzzleItem(1, true), new PuzzleItem(5, false),
        new PuzzleItem(3, true), new PuzzleItem(6, true), new PuzzleItem(4, true)
    ],
    [
        new PuzzleItem(9, true), new PuzzleItem(2, true), new PuzzleItem(6, false),
        new PuzzleItem(3, true), new PuzzleItem(4, true), new PuzzleItem(1, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(1, true), new PuzzleItem(3, true), new PuzzleItem(8, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(6, true),
        new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(9, true)
    ],
    [
        new PuzzleItem(5, true), new PuzzleItem(7, false), new PuzzleItem(4, true),
        new PuzzleItem(9, true), new PuzzleItem(8, true), new PuzzleItem(2, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(5, true), new PuzzleItem(7, true),
        new PuzzleItem(1, false), new PuzzleItem(6, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(9, true), new PuzzleItem(3, true)
    ],
    [
        new PuzzleItem(8, true), new PuzzleItem(4, true), new PuzzleItem(3, true),
        new PuzzleItem(5, false), new PuzzleItem(9, true), new PuzzleItem(7, true),
        new PuzzleItem(2, true), new PuzzleItem(1, true), new PuzzleItem(6, true)
    ],
    [
        new PuzzleItem(6, true), new PuzzleItem(9, true), new PuzzleItem(1, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(3, true),
        new PuzzleItem(5, true), new PuzzleItem(4, true), new PuzzleItem(7, false)
    ]
];

const GRID_HOLES = [
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(3, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(8, false), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(2, false), new PuzzleItem(null, true), new PuzzleItem(5, false),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(6, false),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(7, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(3, false), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(1, false), new PuzzleItem(null, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(7, false)
    ]
];

let gridGenerationManager = new GridGenerationManager();
describe('Puzzle Manager Service', () => {
    it('getNewPuzzle should get a new puzzle', function (done) {
        this.timeout(6000);
        gridGenerationManager.getNewPuzzle(Difficulty.HARD)
            .then((puzzle: Puzzle) => {
                expect(puzzle).to.be.instanceof(Puzzle);
                expect(puzzle._puzzle.length).to.be.equal(9);
                done();
            });
    });

    it('createPuzzleHoles should remove value from puzzleItem to be guessed', () => {
        let puzzle = new Puzzle();
        puzzle._puzzle = GRID_FULL;
        let puzzleHoles = new Puzzle();
        puzzleHoles._puzzle = GRID_HOLES;
        expect(gridGenerationManager.createPuzzleHoles(puzzle)).to.be.deep.equal(puzzleHoles);
    });

    it('createPuzzleHoles should throw an error when the parameter is null', () => {
        expect(() => {
            gridGenerationManager.createPuzzleHoles(null);
        }).to.throw(Error);
    });
});
