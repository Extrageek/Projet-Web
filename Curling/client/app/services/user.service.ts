import { Injectable } from "@angular/core";
import { RestApiProxyService } from "./rest-api-proxy.service";
import { Difficulty } from "../models/difficulty";

@Injectable()
export class UserService {
    public static _username: string;
    public get username(): string {
        return UserService._username;
    }
    public set username(value: string) {
        UserService._username = value;
    }

    public static _difficulty: Difficulty;
    public get difficulty(): Difficulty {
        return UserService._difficulty;
    }
    public set difficulty(value: Difficulty) {
        UserService._difficulty = value;
    }

    constructor(private api: RestApiProxyService) {
        UserService._username = "";
        UserService._difficulty = Difficulty.NORMAL;
    }

    public getComputerName(): string {
        if (UserService._difficulty === Difficulty.NORMAL) {
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
                    this.username = isValid ? username : "";
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
