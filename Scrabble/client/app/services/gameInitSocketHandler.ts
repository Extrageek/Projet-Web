
export class GameInitSocketHandler  {

    public static invalidPlayerName() {
        alert("The username is invalid. The name can only contain alphanumeric characters.");
    }

    public static invalidDemand() {
        alert("The request sent to the server is invalid");
    }

    public static playerNameAlreadyExists() {
        alert("This username is already taken, please choose another username.");
    }
}
