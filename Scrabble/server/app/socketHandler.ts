import * as http from 'http';
import * as io from 'socket.io';

export class ioConnection {

    constructor(server: http.Server) {
        let connection = io.listen(server);
        connection.sockets.on("connection", this.logConnectionMessage);
        connection.sockets.on("newGameDemand", this.createNewPlayer);
    }

    private logConnectionMessage(socket: SocketIO.Socket) {
        console.log("Connecté.");

        socket.on("newGameDemand", function(demandInfo: JSON){
            //let player = new Player(demandInfo.parse().name, socket);
            //player.registerToARoom();
        });
    }

    private createNewPlayer(demandInfo: JSON) {

    }

}