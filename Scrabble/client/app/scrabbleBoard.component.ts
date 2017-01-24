import { Component } from '@angular/core';

@Component({
    selector: 'scrabble-main-board', 
    templateUrl: 'app/scrabble.html',
    styleUrls: ['app/scrabble.css']
})

export class ScrabbleBoard {

    columnNumberList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    mappingLinkImage = {
        'S': 'scrabbleImages/starTile.jpg',
        'N': 'scrabbleImages/ordinaryTile.jpg', 
        'LD': 'scrabbleImages/doubleLetterScore.jpg',
        'MD': 'scrabbleImages/doubleWordScore.jpg',
        'LT': 'scrabbleImages/tripleLetterScore.jpg',
        'MT': 'scrabbleImages/tripleWordScore.jpg'
    }

    line1 = ['MT', 'N', 'N', 'LD', 'N', 'N', 'N', 'MT', 'N', 'N', 'N', 'LD', 'N', 'N', 'MT']
    line2 = ['N', 'MD', 'N', 'N', 'N', 'LT', 'N', 'N', 'N', 'LT', 'N', 'N', 'N', 'MD', 'N']
    line3 = ['N', 'N', 'MD', 'N', 'N', 'N', 'LD', 'N', 'LD', 'N', 'N', 'N', 'MD', 'N', 'N']
    line4 = ['LD', 'N', 'N', 'MD', 'N', 'N', 'N', 'LD', 'N', 'N', 'N', 'MD', 'N', 'N', 'LD']
    line5 = ['N', 'N', 'N', 'N', 'MD', 'N', 'N', 'N', 'N', 'N', 'MD', 'N', 'N', 'N', 'N']
    line6 = ['N', 'LT', 'N', 'N', 'N', 'LT', 'N', 'N', 'N', 'LT', 'N', 'N', 'N', 'LT', 'N']
    line7 = ['N', 'N', 'LD', 'N', 'N', 'N', 'LD', 'N', 'LD', 'N', 'N', 'N', 'LD', 'N', 'N']
    line8 = ['MT', 'N', 'N', 'LD', 'N', 'N', 'N', 'S', 'N', 'N', 'N', 'LD', 'N', 'N', 'MT']
    line9 = ['N', 'N', 'LD', 'N', 'N', 'N', 'LD', 'N', 'LD', 'N', 'N', 'N', 'LD', 'N', 'N']
    line10 = ['N', 'LT', 'N', 'N', 'N', 'LT', 'N', 'N', 'N', 'LT', 'N', 'N', 'N', 'LT', 'N']
    line11 = ['N', 'N', 'N', 'N', 'MD', 'N', 'N', 'N', 'N', 'N', 'MD', 'N', 'N', 'LT', 'N']
    line12 = ['LD', 'N', 'N', 'MD', 'N', 'N', 'N', 'LD', 'N', 'N', 'N', 'MD', 'N', 'N', 'LD']
    line13 = ['N', 'N', 'MD', 'N', 'N', 'N', 'LD', 'N', 'LD', 'N', 'N', 'N', 'MD', 'N', 'N']
    line14 = ['N', 'MD', 'N', 'N', 'N', 'LT', 'N', 'N', 'N', 'LT', 'N', 'N', 'N', 'MD', 'N']
    line15 = ['MT', 'N', 'N', 'LD', 'N', 'N', 'N', 'MT', 'N', 'N', 'N', 'LD', 'N', 'N', 'MT']

    line = {
        0:this.line1,
        1:this.line2,
        2:this.line3,
        3:this.line4,
        4:this.line5,
        5:this.line6,
        6:this.line7,
        7:this.line8,
        8:this.line9,
        9:this.line10,
        10:this.line11,
        11:this.line12,
        12:this.line13,
        13:this.line14,
        14:this.line15
    }
}