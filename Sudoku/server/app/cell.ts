export class Cell {

    private _numbers: number[];
    private _hidden: boolean;

    constructor(numberContained: number[], hidden: boolean) {
        this._numbers = numberContained;
        // Sorts the number array by ascending order
        this._numbers.sort((n1, n2) => n1 - n2);
        this._hidden = hidden;
    }

    get numbers(): number[] {
        return this._numbers;
    }

    get isHidden(): boolean {
        return this._hidden;
    }

    public addNumber(toAdd: number): void {
        // If not contained
        if (this._numbers.lastIndexOf(toAdd, 0) === -1) {
            // Finds the index where toAdd will be inserted
            let spliceIndex: number = this._numbers.findIndex((n) => n > toAdd);
            this._numbers.splice(spliceIndex, 0, toAdd);
        }
    }

    public clear(): void {
        // Removes all numbers from the array
        this._numbers.splice(0, this._numbers.length);
    }
}
