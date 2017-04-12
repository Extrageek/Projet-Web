import { Injectable } from "@angular/core";
import { RestApiProxyService } from "./rest-api-proxy.service";
import { Difficulty } from "./../models/difficulty";

@Injectable()
export class UserService {
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    private _difficulty: Difficulty;
    public get difficulty(): Difficulty {
        return this._difficulty;
    }
    public set difficulty(value: Difficulty) {
        this._difficulty = value;
    }

    constructor(private api: RestApiProxyService) {
        this._name = "";
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
        return (username !== "") ? true : false;
    }

    public async verifyUsername(username: string): Promise<boolean> {
        if (username !== "") {
            return await this.api.verifyUsername(username)
                .then(isValid => {
                    this.name = isValid ? username : "";
                    return isValid;
                })
                .catch(error => {
                    console.log(error);
                    throw error;
                });
        }
        else {
            return false;
        }
    }
}
