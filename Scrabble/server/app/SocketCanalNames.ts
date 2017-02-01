export class SocketCanalNames {
    public static CONNECTION = "connection";
    public static DISCONNECTION = "disconnect";
    //Message sent by the client when he wants to play a game
    public static NEW_GAME_DEMAND = "newGameDemand";
    //Message sent by the server if the name already exists
    public static NAME_ALREADY_EXISTS = "errorNameExists";
    //Message sent by the server if the name previously sended by the client is invalid
    public static INVALID_NAME = "errorInvalidName";
    //Message sent by the server when the number of missing players to begin the game has changed
    public static PLAYERS_MISSING = "playersMissing";
}
