import { Injectable } from '@angular/core';
import { RestApiProxyService } from './rest-api-proxy.service';

@Injectable()
export class UserService {
    private _name: string;
    private _difficulty: Difficulty;

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get difficulty(): Difficulty {
        return this._difficulty;
    }

    public set difficulty(value: Difficulty) {
        this._difficulty = value;
    }

    constructor(private api: RestApiProxyService) {
        this._name = '';
        this._difficulty = Difficulty.NORMAL;
    }

    public getComputerName(): string {
        if (this.difficulty === Difficulty.NORMAL) {
            return "CPU Normal";
        } else {
            return "CPU Difficile";
        }
    }

    public activateButtonNextLogin(username: string): boolean {
        if (username !== "") {
            return true;
        }
        else {
            return false;
        }
    }

    public async verifyUsername(username: string): Promise<boolean> {
        if (username !== '') {
            let isValid: boolean;
            await this.api.verifyUsername(username)
                .then(result => {
                    isValid = result;
                })
                .catch(error => {
                    console.log(error);
                    throw error;
                });
            if (isValid) {
                this.name = username;
                return true;
            } else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}

export enum Difficulty {
    NORMAL,
    HARD
}
