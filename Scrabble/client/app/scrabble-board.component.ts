import { Component } from '@angular/core';

    @Component({
        moduleId: module.id,
    selector: 'scrabble-main-board-selector',
    templateUrl: '../app/scrabble.html',
    styleUrls: ['../app/scrabble-board.css']
})

export class ScrabbleBoardComponent {

    columnNumberList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    mappingLinkImage = {
        "Star": 'scrabbleImages/starTile.jpg',
        "Normal": 'scrabbleImages/ordinaryTile.jpg',
        "DoubleLetterScore": 'scrabbleImages/doubleLetterScore.jpg',
        "DoubleWordScore": 'scrabbleImages/doubleWordScore.jpg',
        "TripleLetterScore": 'scrabbleImages/tripleLetterScore.jpg',
        "TripleWordScore": 'scrabbleImages/tripleWordScore.jpg'
    };

    line1 = ['TripleWordScore', 'Normal', 'Normal', 'DoubleLetterScore', 'Normal',
            'Normal', 'Normal', 'TripleWordScore', 'Normal', 'Normal',
            'Normal', 'DoubleLetterScore', 'Normal', 'Normal', 'TripleWordScore'];
    line2 = ['Normal', 'DoubleWordScore', 'Normal', 'Normal', 'Normal',
            'TripleLetterScore', 'Normal', 'Normal', 'Normal', 'TripleLetterScore',
             'Normal', 'Normal', 'Normal', 'DoubleWordScore', 'Normal'];
    line3 = ['Normal', 'Normal', 'DoubleWordScore', 'Normal', 'Normal',
            'Normal', 'DoubleLetterScore', 'Normal', 'DoubleLetterScore', 'Normal',
            'Normal', 'Normal', 'DoubleWordScore', 'Normal', 'Normal'];
    line4 = ['DoubleLetterScore', 'Normal', 'Normal', 'DoubleWordScore', 'Normal',
            'Normal', 'Normal', 'DoubleLetterScore', 'Normal', 'Normal',
            'Normal', 'DoubleWordScore', 'Normal', 'Normal', 'DoubleLetterScore'];
    line5 = ['Normal', 'Normal', 'Normal', 'Normal', 'DoubleWordScore',
            'Normal', 'Normal', 'Normal', 'Normal', 'Normal',
            'DoubleWordScore', 'Normal', 'Normal', 'Normal', 'Normal'];
    line6 = ['Normal', 'TripleLetterScore', 'Normal', 'Normal', 'Normal',
            'TripleLetterScore', 'Normal', 'Normal', 'Normal', 'TripleLetterScore',
            'Normal', 'Normal', 'Normal', 'TripleLetterScore', 'Normal'];
    line7 = ['Normal', 'Normal', 'DoubleLetterScore', 'Normal', 'Normal',
            'Normal', 'DoubleLetterScore', 'Normal', 'DoubleLetterScore', 'Normal',
            'Normal', 'Normal', 'DoubleLetterScore', 'Normal', 'Normal'];
    line8 = ['TripleWordScore', 'Normal', 'Normal', 'DoubleLetterScore', 'Normal',
            'Normal', 'Normal', 'Star', 'Normal', 'Normal',
            'Normal', 'DoubleLetterScore', 'Normal', 'Normal', 'TripleWordScore'];
    line9 = ['Normal', 'Normal', 'DoubleLetterScore', 'Normal', 'Normal',
            'Normal', 'DoubleLetterScore', 'Normal', 'DoubleLetterScore', 'Normal',
            'Normal', 'Normal', 'DoubleLetterScore', 'Normal', 'Normal'];
    line10 = ['Normal', 'TripleLetterScore', 'Normal', 'Normal', 'Normal',
             'TripleLetterScore', 'Normal', 'Normal', 'Normal', 'TripleLetterScore',
             'Normal', 'Normal', 'Normal', 'TripleLetterScore', 'Normal'];
    line11 = ['Normal', 'Normal', 'Normal', 'Normal', 'DoubleWordScore',
             'Normal', 'Normal', 'Normal', 'Normal', 'Normal',
             'DoubleWordScore', 'Normal', 'Normal', 'TripleLetterScore', 'Normal'];
    line12 = ['DoubleLetterScore', 'Normal', 'Normal', 'DoubleWordScore', 'Normal',
             'Normal', 'Normal', 'DoubleLetterScore', 'Normal', 'Normal',
             'Normal', 'DoubleWordScore', 'Normal', 'Normal', 'DoubleLetterScore'];
    line13 = ['Normal', 'Normal', 'DoubleWordScore', 'Normal', 'Normal',
             'Normal', 'DoubleLetterScore', 'Normal', 'DoubleLetterScore', 'Normal',
             'Normal', 'Normal', 'DoubleWordScore', 'Normal', 'Normal'];
    line14 = ['Normal', 'DoubleWordScore', 'Normal', 'Normal', 'Normal',
             'TripleLetterScore', 'Normal', 'Normal', 'Normal', 'TripleLetterScore',
             'Normal', 'Normal', 'Normal', 'DoubleWordScore', 'Normal'];
    line15 = ['TripleWordScore', 'Normal', 'Normal', 'DoubleLetterScore', 'Normal',
             'Normal', 'Normal', 'TripleWordScore', 'Normal', 'Normal',
             'Normal', 'DoubleLetterScore', 'Normal', 'Normal', 'TripleWordScore'];

    line = {
        0: this.line1,
        1: this.line2,
        2: this.line3,
        3: this.line4,
        4: this.line5,
        5: this.line6,
        6: this.line7,
        7: this.line8,
        8: this.line9,
        9: this.line10,
        10: this.line11,
        11: this.line12,
        12: this.line13,
        13: this.line14,
        14: this.line15
    };
}
