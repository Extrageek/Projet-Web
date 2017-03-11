export class SocketEventType {

    // A connection event with the server.
    static connection = "connection";

    // A connection event error.
    static connectError = "connect_error";

    // A connected status of the client.
    static connect = "connect";

    // A disconnected status of the client.
    static disconnect = "disconnect";

    //Message sent by the server if the information sent are not valid
    static invalidRequest = "invalidRequest";

    //Message sent by the client when he wants to play a game.
    static newGameRequest = "newGameRequest";

    // A joined room event.
    static joinRoom = "joinedRoom";

    // A joined room event.
    static leaveRoom = "leaveRoom";

    // A ready state event for a room.
    static roomReady = "roomReady";

    static message = "message";

    static playerLeftRoom = "playerLeftRoom";

    //Message sent by the server if the name already exists
    static usernameAlreadyExist = "usernameAlreadyExist";

    static initializeEasel = "initializeEasel";
    static updatePlayersQueue = "updatePlayersQueue";

    static changeLettersRequest = "!changer";
    static placeWordCommandRequest = "!place";
    static passCommandRequest = "!passer";

    static commandRequest = "commandRequest";
    static invalidCommandRequest = "invalidCommand";
}
