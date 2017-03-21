export class SocketEventType {

    // A connection event with the server.
    static CONNECTION = "connection";

    // A connection event error.
    static CONNECT_ERROR = "connect_error";

    // A connected status of the client.
    static CONNECT = "connect";

    // A disconnected status of the client.
    static DISCONNECT = "disconnect";

    //Message sent by the server if the information sent are not valid
    static INVALID_REQUEST = "invalidRequest";

    //Message sent by the client when he wants to play a game.
    static NEW_GAME_REQUEST = "newGameRequest";

    // A joined room event.
    static JOIN_ROOM = "joinedRoom";

    // A joined room event.
    static LEAVE_ROOM = "leaveRoom";

    // A ready state event for a room.
    static ROOM_READY = "roomReady";
    static MESSAGE = "message";
    static PLAYER_LEFT_ROOM = "playerLeftRoom";

    //Message sent by the server if the name already exists
    static USERNAME_ALREADY_EXIST = "usernameAlreadyExist";
    static INITIALIZE_EASEL = "initializeEasel";

    static UPDATE_PLAYERS_QUEUE = "updatePlayersQueue";
    static CHANGE_LETTERS_REQUEST = "!changer";
    static PLACE_WORD_COMMAND_REQUEST = "!place";
    static PASS_COMMAND_REQUEST = "!passer";

    static TIMER_EVENT = "timerEvent";
    static UPDATE_BOARD = "updateBoard";
    static UPDATE_SCORE = "updateScore";

    static COMMAND_REQUEST = "commandRequest";
    static INVALID_COMMAND_REQUEST = "invalidCommand";
}
