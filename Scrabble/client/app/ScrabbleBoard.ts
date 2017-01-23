import { Component } from '@angular/core';

@Component({
    selector: 'scrabble-main-board', 
    templateUrl: './scrabble.html'
})

export class ScrabbleBoard {
    mappingLinkImage = {
        'N': '', 
        'LD': '',
        'MD': '',
        'LT': '',
        'MT': ''
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
}