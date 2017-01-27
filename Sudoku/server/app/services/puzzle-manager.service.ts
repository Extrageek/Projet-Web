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
                    {"number": 4, "hide": true}, {"number": 1, "hide": true},
                    {"number": 5, "hide": true}, {"number": 6, "hide": true},
                    {"number": 3, "hide": false}, {"number": 8, "hide": true},
                    {"number": 9, "hide": true}, {"number": 7, "hide": true},
                    {"number": 2, "hide": false}
                  ],
                  [
                    {"number": 3, "hide": true}, {"number": 6, "hide": false},
                    {"number": 2, "hide": false}, {"number": 4, "hide": false},
                    {"number": 7, "hide": true}, {"number": 9, "hide": true},
                    {"number": 1, "hide": true}, {"number": 8, "hide": false},
                    {"number": 5, "hide": true}
                   ],
                   [
                     {"number": 7, "hide": false}, {"number": 8, "hide": true},
                     {"number": 9, "hide": true}, {"number": 2, "hide": false},
                     {"number": 1, "hide": true}, {"number": 5, "hide": false},
                     {"number": 3, "hide": true}, {"number": 6, "hide": true},
                     {"number": 4, "hide": true}
                   ],
                   [
                     {"number": 9, "hide": true}, {"number": 2, "hide": true},
                     {"number": 6, "hide": false}, {"number": 3, "hide": true},
                     {"number": 4, "hide": true}, {"number": 1, "hide": true},
                     {"number": 7, "hide": true}, {"number": 5, "hide": true},
                     {"number": 8, "hide": false}
                   ],
                   [
                     {"number": 1, "hide": true}, {"number": 3, "hide": true},
                     {"number": 8, "hide": true}, {"number": 7, "hide": true},
                     {"number": 5, "hide": true}, {"number": 6, "hide": true},
                     {"number": 4, "hide": true}, {"number": 2, "hide": true},
                     {"number": 9, "hide": true}
                   ],
                   [
                     {"number": 5, "hide": true}, {"number": 7, "hide": false},
                     {"number": 4, "hide": false}, {"number": 9, "hide": true},
                     {"number": 8, "hide": true}, {"number": 2, "hide": true},
                     {"number": 6, "hide": true}, {"number": 3, "hide": false},
                     {"number": 1, "hide": true}
                   ],
                   [
                     {"number": 2, "hide": false}, {"number": 5, "hide": true},
                     {"number": 7, "hide": true}, {"number": 1, "hide": false},
                     {"number": 6, "hide": true}, {"number": 4, "hide": false},
                     {"number": 8, "hide": false}, {"number": 9, "hide": true},
                     {"number": 3, "hide": true}
                   ],
                   [
                     {"number": 8, "hide": true}, {"number": 4, "hide": true},
                     {"number": 3, "hide": true}, {"number": 5, "hide": false},
                     {"number": 9, "hide": true}, {"number": 7, "hide": true},
                     {"number": 2, "hide": true}, {"number": 1, "hide": true},
                     {"number": 6, "hide": true}
                   ],
                   [
                     {"number": 6, "hide": true}, {"number": 9, "hide": true},
                     {"number": 1, "hide": true}, {"number": 8, "hide": false},
                     {"number": 2, "hide": false}, {"number": 3, "hide": true},
                     {"number": 5, "hide": true}, {"number": 4, "hide": true},
                     {"number": 7, "hide": false}
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
