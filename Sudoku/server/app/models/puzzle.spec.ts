import { expect } from "chai";
import { Puzzle, PuzzleItem } from "./puzzle";

const puzzleSeed = [
    [
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false),
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false),
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false)
    ],
    [
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false),
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false),
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false),
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false),
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false),
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false),
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false)
    ],
    [
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false),
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false),
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false)
    ],
    [
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false),
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false),
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false)
    ],
    [
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false),
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false),
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false),
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false),
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false)
    ],
    [
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false),
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false),
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false)
    ]
];

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

describe("Puzzle constructor should", () => {
    it("initialize grid and contain puzzleSeed", () => {
        let puzzle: Puzzle = new Puzzle();
        expect(puzzle._puzzle, "should contain puzzleSeed").to.be.deep.equal(puzzleSeed);
    });
});

describe("Puzzle should", () => {

    let puzzle: Puzzle;

    beforeEach(() => {
        puzzle = new Puzzle();
    });

    // Puzzle operations
    it("swap column 0 with 1", () => {
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
        puzzle._puzzle = GRID_FULL;
        let puzzleHoles = new Puzzle();
        puzzleHoles._puzzle = GRID_HOLES;
        puzzle.createPuzzleHoles();
        expect(puzzle).to.be.deep.equal(puzzleHoles);
    });

    it("throw exception due to invalid parameters", () => {
        expect(puzzle.hideAllItemsInRange.bind(puzzle, -1, 8, 0, 8)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 0, 9, 0, 8)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 0, 8, -1, 8)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 0, 8, 0, 9)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 7, 6, 0, 8)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 0, 8, 4, 3)).to.throw(Error);
    });

    it("hide 1 item", () => {
        puzzle.hideAllItemsInRange(4, 4, 8, 8);
        expect(puzzle._puzzle[4][8].isHidden).to.equal(true);
    });

    it("hide some items", () => {
        puzzle.hideAllItemsInRange(0, 4, 6, 8);
        for (let row = 0; row <= 4; ++row) {
            for (let column = 6; column <= 8; ++column) {
                expect(puzzle._puzzle[row][column].isHidden).to.equal(true);
            }
        }
    });
});
