export interface IPuzzleItemData {
    _value: number;
    _hide: boolean;
}

export class PuzzleItem {
    private _value: number;
    get value(): number {
        return this._value;
    }
    set value(value: number) {
        this._value = value;
    }

    private _hide: boolean;
    get isHidden(): boolean {
        return this._hide;
    }
    set isHidden(hidden: boolean) {
        this._hide = hidden;
    }

    /**
     * Extract from an any object the properties _value and _hide to create an object of type PuzzleItem.
     * A typeError is thrown if the object doesn't contain the properties of the IPuzzleItemData interface.
     */
    public static convertObjectToPuzzleItem(object: IPuzzleItemData): PuzzleItem {
        if (object._value === undefined || object._hide === undefined) {
            throw new TypeError("The object doesn't have the property _value or _hide.");
        }
        return new PuzzleItem(Number(object._value), object._hide);
    }

    constructor(value: number, hide: boolean) {
        this._value = value;
        this._hide = hide;
    }
}
