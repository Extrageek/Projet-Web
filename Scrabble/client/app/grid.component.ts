import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'grid',
    template: `
    <div id = "board">
        <div class = "rows" *ngFor="let rows of grid; let i=index ">
            <ng-container  *ngFor="let cell of grid; let j=index ">
                <input class = "cell">   
            </ng-container>
        </div>
    </div>
    `
    ,styleUrls:['app/grid.component.css']
})
export class GridComponent implements OnInit {
    private grid: Number[];
    constructor() {
        this.grid = Array(15).fill(0);
    }
    ngOnInit() {
    }
}