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
                    {"number": 4, "hidden": true}, {"number": 1, "hidden": true},
                    {"number": 5, "hidden": true}, {"number": 6, "hidden": true},
                    {"number": 3, "hidden": false}, {"number": 8, "hidden": true},
                    {"number": 9, "hidden": true}, {"number": 7, "hidden": true},
                    {"number": 2, "hidden": false}
                  ],
                  [
                    {"number": 3, "hidden": true}, {"number": 6, "hidden": false},
                    {"number": 2, "hidden": false}, {"number": 4, "hidden": false},
                    {"number": 7, "hidden": true}, {"number": 9, "hidden": true},
                    {"number": 1, "hidden": true}, {"number": 8, "hidden": false},
                    {"number": 5, "hidden": true}
                   ],
                   [
                     {"number": 7, "hidden": false}, {"number": 8, "hidden": true},
                     {"number": 9, "hidden": true}, {"number": 2, "hidden": false},
                     {"number": 1, "hidden": true}, {"number": 5, "hidden": false},
                     {"number": 3, "hidden": true}, {"number": 6, "hidden": true},
                     {"number": 4, "hidden": true}
                   ],
                   [
                     {"number": 9, "hidden": true}, {"number": 2, "hidden": true},
                     {"number": 6, "hidden": false}, {"number": 3, "hidden": true},
                     {"number": 4, "hidden": true}, {"number": 1, "hidden": true},
                     {"number": 7, "hidden": true}, {"number": 5, "hidden": true},
                     {"number": 8, "hidden": false}
                   ],
                   [
                     {"number": 1, "hidden": true}, {"number": 3, "hidden": true},
                     {"number": 8, "hidden": true}, {"number": 7, "hidden": true},
                     {"number": 5, "hidden": true}, {"number": 6, "hidden": true},
                     {"number": 4, "hidden": true}, {"number": 2, "hidden": true},
                     {"number": 9, "hidden": true}
                   ],
                   [
                     {"number": 5, "hidden": true}, {"number": 7, "hidden": false},
                     {"number": 4, "hidden": false}, {"number": 9, "hidden": true},
                     {"number": 8, "hidden": true}, {"number": 2, "hidden": true},
                     {"number": 6, "hidden": true}, {"number": 3, "hidden": false},
                     {"number": 1, "hidden": true}
                   ],
                   [
                     {"number": 2, "hidden": false}, {"number": 5, "hidden": true},
                     {"number": 7, "hidden": true}, {"number": 1, "hidden": false},
                     {"number": 6, "hidden": true}, {"number": 4, "hidden": false},
                     {"number": 8, "hidden": false}, {"number": 9, "hidden": true},
                     {"number": 3, "hidden": true}
                   ],
                   [
                     {"number": 8, "hidden": true}, {"number": 4, "hidden": true},
                     {"number": 3, "hidden": true}, {"number": 5, "hidden": false},
                     {"number": 9, "hidden": true}, {"number": 7, "hidden": true},
                     {"number": 2, "hidden": true}, {"number": 1, "hidden": true},
                     {"number": 6, "hidden": true}
                   ],
                   [
                     {"number": 6, "hidden": true}, {"number": 9, "hidden": true},
                     {"number": 1, "hidden": true}, {"number": 8, "hidden": false},
                     {"number": 2, "hidden": false}, {"number": 3, "hidden": true},
                     {"number": 5, "hidden": true}, {"number": 4, "hidden": true},
                     {"number": 7, "hidden": false}
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
        public getNewPuzzle(){

            // Return a fake (but a valid) puzzle for now
            // TODO: Must be completed after a clean debug
            return dummyPuzzle;
        }
    }
}

export = PuzzleManagerService;
