export class Activity {

    private _date: Date;
    private _type: Type;
    private _description: String;

    constructor(date: Date, type: Type, description: String) {
        this._date = date;
        this._type = type;
        if (description === "0") {
            this._description = "Facile";
        }
        else if (description === "1") {
            this._description = "Difficile";
        }
        else {
            this._description = description;
        }
    }
    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get type(): Type {
        return this._type;
    }

    set type(value: Type) {
        this._type = value;
    }

    get description(): String {
        return this._description;
    }

}

export enum Type { GRID_GENERATION, GRID_DEMAND }
