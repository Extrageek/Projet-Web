import { expect } from "chai";
import { Puzzle, PuzzleItem, puzzleSeed } from "./puzzle";

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

describe("PuzzleItem should", () => {
    it("be hidden and contain 1", () => {
        let item: PuzzleItem = new PuzzleItem(1, true);
        expect(item.isHidden, "should be hidden").to.equals(true);
        expect(item.value, "should contain 1").to.equals(1);
    });

    it("be shown and contain null", () => {
        let item: PuzzleItem = new PuzzleItem(null, false);
        expect(item.isHidden, "should be shown").to.equals(false);
        expect(item.value, "should contain null").to.equals(null);
    });

    it("swap and swap back", () => {
        let item1: PuzzleItem = new PuzzleItem(1, true);
        let item2: PuzzleItem = new PuzzleItem(2, false);
        item1.swap(item2);
        expect(item1.isHidden, "should not be hidden").to.equals(false);
        expect(item1.value, "should contain 2").to.equals(2);
        expect(item2.isHidden, "should be hidden").to.equals(true);
        expect(item2.value, "should contain 1").to.equals(1);
        item1.swap(item2);
        expect(item1.isHidden, "should be hidden").to.equals(true);
        expect(item1.value, "should contain 1").to.equals(1);
        expect(item2.isHidden, "should not be hidden").to.equals(false);
        expect(item2.value, "should contain 2").to.equals(2);
    });
});

describe("Puzzle should", () => {
    it("initialize grid and contain puzzleSeed", () => {
        let puzzle: Puzzle = new Puzzle();
        expect(puzzle._puzzle, "should contain puzzleSeed").to.be.deep.equal(puzzleSeed);
    });

    // Puzzle operations
    it("swap column 0 with 1", () => {
        let puzzle: Puzzle = new Puzzle();
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];
        let cell00 = puzzle._puzzle[0][1].value;
        let cell01 = puzzle._puzzle[0][0].value;
        let cell10 = puzzle._puzzle[1][1].value;
        let cell11 = puzzle._puzzle[1][0].value;
        puzzle.swapColumn(0, 1);
        expect(puzzle._puzzle[0][0].value, "should have swapped").to.equals(cell00);
        expect(puzzle._puzzle[0][1].value, "should have swapped").to.equals(cell01);
        expect(puzzle._puzzle[1][0].value, "should have swapped").to.equals(cell10);
        expect(puzzle._puzzle[1][1].value, "should have swapped").to.equals(cell11);
    });

    it("swap row 0 with 1", () => {
        let puzzle: Puzzle = new Puzzle();
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];

        let cell00 = puzzle._puzzle[1][0].value;
        let cell01 = puzzle._puzzle[1][1].value;
        let cell10 = puzzle._puzzle[0][0].value;
        let cell11 = puzzle._puzzle[0][1].value;
        puzzle.swapRow(0, 1);
        expect(puzzle._puzzle[0][0].value, "should have swapped").to.equals(cell00);
        expect(puzzle._puzzle[0][1].value, "should have swapped").to.equals(cell01);
        expect(puzzle._puzzle[1][0].value, "should have swapped").to.equals(cell10);
        expect(puzzle._puzzle[1][1].value, "should have swapped").to.equals(cell11);
    });

    it("invert puzzle on horizontal axis", () => {
        let puzzle: Puzzle = new Puzzle();
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];

        let cell00 = puzzle._puzzle[1][0].value;
        let cell01 = puzzle._puzzle[1][1].value;
        let cell10 = puzzle._puzzle[0][0].value;
        let cell11 = puzzle._puzzle[0][1].value;
        puzzle.swapRow(0, 1);
        expect(puzzle._puzzle[0][0].value, "should have swapped").to.equals(cell00);
        expect(puzzle._puzzle[0][1].value, "should have swapped").to.equals(cell01);
        expect(puzzle._puzzle[1][0].value, "should have swapped").to.equals(cell10);
        expect(puzzle._puzzle[1][1].value, "should have swapped").to.equals(cell11);
    });

    it("swap column 0 with 1", () => {
        let puzzle: Puzzle = new Puzzle();
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];
        let cell00 = puzzle._puzzle[0][1].value;
        let cell01 = puzzle._puzzle[0][0].value;
        let cell10 = puzzle._puzzle[1][1].value;
        let cell11 = puzzle._puzzle[1][0].value;
        puzzle.swapColumn(0, 1);
        expect(puzzle._puzzle[0][0].value, "should have swapped").to.equals(cell00);
        expect(puzzle._puzzle[0][1].value, "should have swapped").to.equals(cell01);
        expect(puzzle._puzzle[1][0].value, "should have swapped").to.equals(cell10);
        expect(puzzle._puzzle[1][1].value, "should have swapped").to.equals(cell11);
    });

    it("erase values from puzzleItem marked hidden", () => {
        let puzzle = new Puzzle();
        puzzle._puzzle = GRID_FULL;
        let puzzleHoles = new Puzzle();
        puzzleHoles._puzzle = GRID_HOLES;
        puzzle.createPuzzleHoles();
        expect(puzzle).to.be.deep.equal(puzzleHoles);
    });
});
