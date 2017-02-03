import { Injectable } from '@angular/core';

@Injectable()
export class UserSettingsService {
    private _userName: string;

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }
}
