import { Room } from "./Room";
import { Player } from "./Player";

export class RoomHandler {
    private static currentRooms: Room[] = new Array<Room>();

    public static addPlayertoARoom(player : Player): Room{
        let room = this.currentRooms.find((element) => {
            return !element.roomIsFull() && element.roomCapacity === player.numberOfPlayers;
        });
        if (typeof(room) !== "undefined") {
            room.addPlayer(player);
        }
        else {
            room = new Room(player.numberOfPlayers);
            room.addPlayer(player);
            this.currentRooms.push(room);
        }
        return room;
    }

    public static hasPlayerWithName(name: String): boolean {
        let roomWithPlayerName = this.currentRooms.find((element: Room): boolean => {
            return element.hasPlayerWithName(name);
        });
        return typeof(roomWithPlayerName) !== "undefined";
    }
}
