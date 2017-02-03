import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestApiProxyService } from '../services/rest-api-proxy.service';

import { Record } from '../models/record';

@Component({
    selector: 'leaderboard-component',
    templateUrl: '../../assets/templates/leaderboard-component.html',
    styleUrls: ['../../assets/stylesheets/leaderboard-component.css']
})
export class LeaderboardComponent implements OnInit {
    private _records: Array<Record>;

    public constructor(private router: Router,
        private restApi: RestApiProxyService) {
    }

    public ngOnInit(): void {
        this.fetchRecords();
        this.makeTableScroll();
    }

    public get records(): Array<Record> {
        return this._records;
    }
    public set records(records: Array<Record>) {
        this._records = records;
    }

    public addRecord(record: Record): void {
        this._records.push(record);
    }

    public async fetchRecords(): Promise<void> {
        await this.restApi.getAllRecords().then(results => {
            this._records = results;
        });
    }

    public makeTableScroll() {
            let height = window.innerHeight;
            let wrapper = <HTMLElement>document.getElementById("leaderboard");
            wrapper.style.height = (Math.round(height * 0.8)) + "px";
        }

    public returnMainPage(): void {
        this.router.navigate(['/']);
    }
}
