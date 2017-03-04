export class QueueCollection<AnyType> {
    private _list: AnyType[];
    private head: number;
    private _count: number;

    public constructor() {
        this.clear();
    }

    public enqueue(item: AnyType) {
        if (item === null) {
            throw new Error("Null argument exception: the parameter should not be null");
        }

        this._list.push(item);
        ++this._count;
    }

    public dequeue(): AnyType {
        if (this._count === 0) {
            return null;
        }

        let item: AnyType = this._list[this.head];
        this._list = this._list.slice(1, this._list.length);
        --this._count;

        return item;
    }

    public remove(item: AnyType): AnyType {

        if (item === null) {
            throw new Error("Null argument exception: the parameter should not be null");
        }

        let removedItem: AnyType = null;
        let index: number;
        index = this._list.findIndex((element) => {
            return (element === item);
        });

        if (index !== -1) {
            removedItem = this._list.splice(index, 1)[0];
            --this._count;
        }
        return removedItem;
    }

    public forEach(callbackFunction: (item: AnyType) => any) {
        for (let index = 0; index < this._count; ++index) {
            callbackFunction(this._list[index]);
        }
    }

    public find(item: AnyType): AnyType {
        if (item === null) {
            throw new Error("Null argument exception: the parameter should not be null");
        }

        let foundItem: AnyType;
        let index: number;

        foundItem = this._list.find((element) => {
            return (element === item);
        });

        return foundItem;
    }

    private randomizeTheListOfThePriorities() {
        // TODO: to be completed to set a random order
    }

    public updateAndGetQueuePriorities(): Array<AnyType> {
        let currentItem = this.dequeue();
        this.enqueue(currentItem);
        return this._list;
    }

    public get count(): number {
        return this._count;
    }

    public clear() {
        this._list = [];
        this.head = 0;
        this._count = 0;
    }
}
