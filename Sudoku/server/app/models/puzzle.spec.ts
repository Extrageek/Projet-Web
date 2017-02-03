import { assert } from 'chai';
declare var jQuery: any;
import { Puzzle, PuzzleItem, puzzleSeed } from '../models/puzzle';
describe('Puzzle', () => {
    // Testing Puzzle item.
    it("should create a PuzzleItem that contains 3 and is hidden", () => {
        // Must be completed
        let item: PuzzleItem = new PuzzleItem(3, true);
        // Check the expected result
        assert(item.isHidden === true, "Should be hidden");
        assert(item._value === 3, "Should contain the number 3");
    });
    it("should create a PuzzleItem that contains 3 and is hidden", () => {
        // Must be completed
        let item: PuzzleItem = new PuzzleItem(null, false);
        // Check the expected result
        assert(item._hide === false, "Should not be hidden");
        assert(item._value === null, "Should not contain a value");
    });
    it("should swap items right", () => {
        // Must be completed
        let item1: PuzzleItem = new PuzzleItem(6, true);
        let item2: PuzzleItem = new PuzzleItem(3, false);
        item1.swap(item2);
        // Check the expected result
        assert(item1.isHidden === false, "Should not be hidden");
        assert(item1._value === 3, "Should contain 3");
        assert(item2.isHidden === true, "Should be hidden");
        assert(item2._value === 6, "Should contain 6");
        item2.swap(item1);
        // Check the expected result
        assert(item1.isHidden === true, "Should be hidden");
        assert(item1._value === 6, "Should contain 6");
        assert(item2.isHidden === false, "Should not be hidden");
        assert(item2._value === 3, "Should contain 3");
    });
    // Testing puzzle constructor
    it("should initialize grid to puzzleSeed", () => {
        let puzzle: Puzzle = new Puzzle();
        assert(puzzle._puzzle === puzzleSeed, "Error constructing puzzle");
    });
    // Testing puzzle operations
    it("should swap Columns 0 and 1", () => {
        let puzzle: Puzzle = new Puzzle();
        let solutionGrid = [
            [
                new PuzzleItem(1, true), new PuzzleItem(4, true), new PuzzleItem(5, true),
                new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true),
                new PuzzleItem(9, true), new PuzzleItem(7, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(6, false), new PuzzleItem(3, true), new PuzzleItem(2, false),
                new PuzzleItem(4, false), new PuzzleItem(7, true), new PuzzleItem(9, true),
                new PuzzleItem(1, true), new PuzzleItem(8, false), new PuzzleItem(5, true)
            ],
            [
                new PuzzleItem(8, true), new PuzzleItem(7, false), new PuzzleItem(9, true),
                new PuzzleItem(2, false), new PuzzleItem(1, true), new PuzzleItem(5, false),
                new PuzzleItem(3, true), new PuzzleItem(6, true), new PuzzleItem(4, true)
            ],
            [
                new PuzzleItem(2, true), new PuzzleItem(9, true), new PuzzleItem(6, false),
                new PuzzleItem(3, true), new PuzzleItem(4, true), new PuzzleItem(1, true),
                new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(8, false)
            ],
            [
                new PuzzleItem(3, true), new PuzzleItem(1, true), new PuzzleItem(8, true),
                new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(6, true),
                new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(9, true)
            ],
            [
                new PuzzleItem(7, false), new PuzzleItem(5, true), new PuzzleItem(4, true),
                new PuzzleItem(9, true), new PuzzleItem(8, true), new PuzzleItem(2, true),
                new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)
            ],
            [
                new PuzzleItem(5, true), new PuzzleItem(2, false), new PuzzleItem(7, true),
                new PuzzleItem(1, false), new PuzzleItem(6, true), new PuzzleItem(4, false),
                new PuzzleItem(8, false), new PuzzleItem(9, true), new PuzzleItem(3, true)
            ],
            [
                new PuzzleItem(4, true), new PuzzleItem(8, true), new PuzzleItem(3, true),
                new PuzzleItem(5, false), new PuzzleItem(9, true), new PuzzleItem(7, true),
                new PuzzleItem(2, true), new PuzzleItem(1, true), new PuzzleItem(6, true)
            ],
            [
                new PuzzleItem(9, true), new PuzzleItem(6, true), new PuzzleItem(1, true),
                new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(3, true),
                new PuzzleItem(5, true), new PuzzleItem(4, true), new PuzzleItem(7, false)
            ]
        ];
        puzzle.swapColumn(0, 1);
        assert(puzzle._puzzle === solutionGrid, "Error swaping columns");
    });
    it("should swap rows 0 and 1", () => {
        let puzzle: Puzzle = new Puzzle();
        let solutionGrid = [
            [
                new PuzzleItem(3, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
                new PuzzleItem(4, false), new PuzzleItem(7, true), new PuzzleItem(9, true),
                new PuzzleItem(1, true), new PuzzleItem(8, false), new PuzzleItem(5, true)
            ],
            [
                new PuzzleItem(4, true), new PuzzleItem(1, true), new PuzzleItem(5, true),
                new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true),
                new PuzzleItem(9, true), new PuzzleItem(7, true), new PuzzleItem(2, false)
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
        puzzle.swapRow(0, 1);
        assert(puzzle._puzzle === solutionGrid, "Error swaping rows");
    });
});