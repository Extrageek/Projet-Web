import { assert } from 'chai';

declare var jQuery: any;

import { Puzzle, PuzzleItem } from '../models/puzzle';

import { INITIAL_PUZZLE_SEED } from '../services/mock-data';

describe('Puzzle', () => {

   // Testing puzzle constructor
   it("should initialize grid to INITIAL_PUZZLE_SEED", () => {
       let puzzle: Puzzle = new Puzzle(INITIAL_PUZZLE_SEED);
       assert(puzzle._puzzle === INITIAL_PUZZLE_SEED, "Error constructing puzzle");
   });

   // Testing Puzzle item.
   it("should create a PuzzleItem that contains 3 and is hidden", () => {
       // Must be completed
       let item: PuzzleItem = new PuzzleItem(3, true);

       // Check the expected result
       assert(item._hide === true, "Should be hidden");
       assert(item._value === 3, "Should contain the number 3");
   });

   it("should create a PuzzleItem that contains 3 and is hidden", () => {
       // Must be completed
       let item: PuzzleItem = new PuzzleItem(null, false);

       // Check the expected result
       assert(item._hide === false, "Should not be hidden");
       assert(item._value === null, "Should not contain a value");
   });
});
