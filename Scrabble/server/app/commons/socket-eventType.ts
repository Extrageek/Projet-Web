export class SocketEventType {

    // A connection event with the server.
    static connection = "connection";

    // A connection event error.
    static connectError = "connect_error";

    // A connected status of the client.
    static connected = "connected";

    // A disconnected status of the client.
    static disconnect = "disconnect";

    //Message sent by the server if the information sent are not valid
    static invalidRequest = "invalidRequest";

    //Message sent by the client when he wants to play a game.
    static newGameRequest = "newGameRequest";

    // A joined room event.
    static joinRoom = "joinedRoom";

    // A ready state event for a room.
    static roomReady = "roomReady";

    static message = "message";

    static playerLeftRoom = "playerLeftRoom";

    //Message sent by the server if the name already exists
    static usernameAlreadyExist = "usernameAlreadyExist";

    //Message sent by the server if the name previously received by the client is invalid
    static invalidUsername = "onInvalidUsernameEvent";

    //Message sent by the server when the number of missing players to begin the game has changed
    static onRoomPlayerChangedEvent = "onRoomPlayerChangedEvent";
}
