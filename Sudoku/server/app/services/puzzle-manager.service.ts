/**
 * puzzle-manager.service.ts - Manage the puzzles generation
 *
 * @authors ...
 * @date 2017/01/22
 */

module PuzzleManagerService {

// TODO: Must be removed after a clean debug
    export const dummyPuzzle = {
        "data": {
                "puzzle": [
                  [
                    {"value": 4, "hide": true}, {"value": 1, "hide": true},
                    {"value": 5, "hide": true}, {"value": 6, "hide": true},
                    {"value": 3, "hide": false}, {"value": 8, "hide": true},
                    {"value": 9, "hide": true}, {"value": 7, "hide": true},
                    {"value": 2, "hide": false}
                  ],
                  [
                    {"value": 3, "hide": true}, {"value": 6, "hide": false},
                    {"value": 2, "hide": false}, {"value": 4, "hide": false},
                    {"value": 7, "hide": true}, {"value": 9, "hide": true},
                    {"value": 1, "hide": true}, {"value": 8, "hide": false},
                    {"value": 5, "hide": true}
                  ],
                  [
                     {"value": 7, "hide": false}, {"value": 8, "hide": true},
                     {"value": 9, "hide": true}, {"value": 2, "hide": false},
                     {"value": 1, "hide": true}, {"value": 5, "hide": false},
                     {"value": 3, "hide": true}, {"value": 6, "hide": true},
                     {"value": 4, "hide": true}
                  ],
                  [
                     {"value": 9, "hide": true}, {"value": 2, "hide": true},
                     {"value": 6, "hide": false}, {"value": 3, "hide": true},
                     {"value": 4, "hide": true}, {"value": 1, "hide": true},
                     {"value": 7, "hide": true}, {"value": 5, "hide": true},
                     {"value": 8, "hide": false}
                  ],
                  [
                     {"value": 1, "hide": true}, {"value": 3, "hide": true},
                     {"value": 8, "hide": true}, {"value": 7, "hide": true},
                     {"value": 5, "hide": true}, {"value": 6, "hide": true},
                     {"value": 4, "hide": true}, {"value": 2, "hide": true},
                     {"value": 9, "hide": true}
                  ],
                  [
                     {"value": 5, "hide": true}, {"value": 7, "hide": false},
                     {"value": 4, "hide": false}, {"value": 9, "hide": true},
                     {"value": 8, "hide": true}, {"value": 2, "hide": true},
                     {"value": 6, "hide": true}, {"value": 3, "hide": false},
                     {"value": 1, "hide": true}
                  ],
                  [
                     {"value": 2, "hide": false}, {"value": 5, "hide": true},
                     {"value": 7, "hide": true}, {"value": 1, "hide": false},
                     {"value": 6, "hide": true}, {"value": 4, "hide": false},
                     {"value": 8, "hide": false}, {"value": 9, "hide": true},
                     {"value": 3, "hide": true}
                  ],
                  [
                     {"value": 8, "hide": true}, {"value": 4, "hide": true},
                     {"value": 3, "hide": true}, {"value": 5, "hide": false},
                     {"value": 9, "hide": true}, {"value": 7, "hide": true},
                     {"value": 2, "hide": true}, {"value": 1, "hide": true},
                     {"value": 6, "hide": true}
                  ],
                  [
                     {"value": 6, "hide": true}, {"value": 9, "hide": true},
                     {"value": 1, "hide": true}, {"value": 8, "hide": false},
                     {"value": 2, "hide": false}, {"value": 3, "hide": true},
                     {"value": 5, "hide": true}, {"value": 4, "hide": true},
                     {"value": 7, "hide": false}
                  ]
                ],
                "difficulty" : "normal"
            }
    };

    export class PuzzleManager {

        /**
         * The getNewPuzzle function, return a new puzzle.
         *
         * @class PuzzleManager
         * @method getNewPuzzle
         * @return newPuzzle
         */
        public getNewPuzzle() {

            // Return a fake (but a valid) puzzle for now
            // TODO: Must be completed after a clean debug
            return dummyPuzzle;
        }
    }
}

export = PuzzleManagerService;
