import { assert } from 'chai';

import { Puzzle, PuzzleItem, puzzleSeed } from './puzzle';

describe('PuzzleItem', () => {
    it('should be hidden and contain 1', () => {
        let item: PuzzleItem = new PuzzleItem(1, true);
        assert(item.isHidden === true, "should be hidden");
        assert(item._value === 1, "should contain 1");
    });

    it('should be shown and contain null', () => {
        let item: PuzzleItem = new PuzzleItem(null, false);
        assert(item.isHidden === false, "should be shown");
        assert(item._value === null, "should contain null");
    });

    it('should swap and swap back', () => {
        let item1: PuzzleItem = new PuzzleItem(1, true);
        let item2: PuzzleItem = new PuzzleItem(2, false);
        item1.swap(item2);
        assert(item1.isHidden === false, "should not be hidden");
        assert(item1._value === 2, "should contain 2");
        assert(item2.isHidden === true, "should be hidden");
        assert(item2._value === 1, "should contain 1");
        item1.swap(item2);
        assert(item1.isHidden === true, "should be hidden");
        assert(item1._value === 1, "should contain 1");
        assert(item2.isHidden === false, "should not be hidden");
        assert(item2._value === 2, "should contain 2");
    });
});

describe('Puzzle', () => {
    it('should initialize grid and contain puzzleSeed', () => {
        let puzzle: Puzzle = new Puzzle();
        assert(puzzle._puzzle === puzzleSeed, "should contain puzzleSeed");
    });

    // Puzzle operations
    it('should swap column 0 with 1', () => {
        let puzzle: Puzzle = new Puzzle();
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];
        let cell00 = puzzle._puzzle[0][1]._value;
        let cell01 = puzzle._puzzle[0][0]._value;
        let cell10 = puzzle._puzzle[1][1]._value;
        let cell11 = puzzle._puzzle[1][0]._value;
        puzzle.swapColumn(0, 1);
        assert(puzzle._puzzle[0][0]._value === cell00, "should have swapped");
        assert(puzzle._puzzle[0][1]._value === cell01, "should have swapped");
        assert(puzzle._puzzle[1][0]._value === cell10, "should have swapped");
        assert(puzzle._puzzle[1][1]._value === cell11, "should have swapped");
    });

    it('should swap row 0 with 1', () => {
        let puzzle: Puzzle = new Puzzle();
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];

        let cell00 = puzzle._puzzle[1][0]._value;
        let cell01 = puzzle._puzzle[1][1]._value;
        let cell10 = puzzle._puzzle[0][0]._value;
        let cell11 = puzzle._puzzle[0][1]._value;
        puzzle.swapRow(0, 1);
        assert(puzzle._puzzle[0][0]._value === cell00, "should have swapped");
        assert(puzzle._puzzle[0][1]._value === cell01, "should have swapped");
        assert(puzzle._puzzle[1][0]._value === cell10, "should have swapped");
        assert(puzzle._puzzle[1][1]._value === cell11, "should have swapped");
    });

    it('should invert puzzle on horizontal axis', () => {
        let puzzle: Puzzle = new Puzzle();
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];

        let cell00 = puzzle._puzzle[1][0]._value;
        let cell01 = puzzle._puzzle[1][1]._value;
        let cell10 = puzzle._puzzle[0][0]._value;
        let cell11 = puzzle._puzzle[0][1]._value;
        puzzle.swapRow(0, 1);
        assert(puzzle._puzzle[0][0]._value === cell00, "should have swapped");
        assert(puzzle._puzzle[0][1]._value === cell01, "should have swapped");
        assert(puzzle._puzzle[1][0]._value === cell10, "should have swapped");
        assert(puzzle._puzzle[1][1]._value === cell11, "should have swapped");
    });

    it('should swap column 0 with 1', () => {
        let puzzle: Puzzle = new Puzzle();
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];
        let cell00 = puzzle._puzzle[0][1]._value;
        let cell01 = puzzle._puzzle[0][0]._value;
        let cell10 = puzzle._puzzle[1][1]._value;
        let cell11 = puzzle._puzzle[1][0]._value;
        puzzle.swapColumn(0, 1);
        assert(puzzle._puzzle[0][0]._value === cell00, "should have swapped");
        assert(puzzle._puzzle[0][1]._value === cell01, "should have swapped");
        assert(puzzle._puzzle[1][0]._value === cell10, "should have swapped");
        assert(puzzle._puzzle[1][1]._value === cell11, "should have swapped");
    });
});
