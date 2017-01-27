import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'dashboard',
  template:`
    <nav>  </nav> 
  `
})
export class DashboardComponent implements OnInit{
    private canPlay: boolean;
    constructor(){}
    ngOnInit():void{
        this.canPlay = true;
    }
}