interface Connection {
    "name": string;
    "socketId": string;
}


export class NameHandler {
    private _activePlayers: Connection[];

    constructor() {
        this._activePlayers = new Array<Connection>();
    }

    public get acti(): Connection[] {
        return this._activePlayers;
    }

    public getNameBySocketId(socketId: string): string {
        let item = this._activePlayers.find((el: Connection) =>
            (el.socketId === socketId)
        );
        return (item !== undefined) ? item.name : null;
    }

    public getSocketIdByName(name: string): string {
        let item = this._activePlayers.find((el) =>
            (el.name === name)
        );
        return (item !== undefined) ? item.socketId : null;
    }

    public addConnection(name: string, socketId: string) {
        let tempName = this.getNameBySocketId(socketId);
        let tempSocketId = this.getSocketIdByName(socketId);

        console.log(tempName===null && tempSocketId===null);
        if (tempName === null && tempSocketId === null) {
            let item: Connection = {name, socketId};
            this._activePlayers.push(item);
            console.log(item);
        }
    }

    public removeConnection(socketId: string) {
        let name: string = this.getNameBySocketId(socketId);
        console.log("name", name);
        let index = this._activePlayers.indexOf({"name": name, "socketId": socketId});
        console.log("id", index);
        if (index !== -1) {
            this._activePlayers.splice(index, 1);
        }
    }
}
