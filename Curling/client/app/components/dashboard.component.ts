import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestApiProxyService } from '../services/rest-api-proxy.service';

import { Record } from '../models/record';

@Component({
  selector: 'dashboard-component',
  templateUrl: '../../assets/templates/dashboard-component.html'
})
export class DashboardComponent implements OnInit{
    private _records: Array<Record>;

    public constructor(private router: Router) {
        this._records = new Array<Record>();
    }

    public ngOnInit():void {
        this.addRecord(new Record('julien', 0, 4, 2));
        this.addRecord(new Record('rami', 0, 5, 1));
        // TODO : aller chercher les donnees dans la db 
    }

    public get records(): Array<Record> {
        return this._records;
    }
    public set records(records: Array<Record>) {
        this._records = records;
    }

    public addRecord(record: Record): void{
        this._records.push(record);
    }

    public returnMainPage(): void {
        this.router.navigate(['/']);
    }
}
