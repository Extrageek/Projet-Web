import { expect, assert } from "chai";

import { Room } from "../../models/rooms/room";
import { Player } from "../../models/players/player";
import { CommandType } from "../commons/command-type";
import { CommandStatus } from "../commons/command-status";
import { ICommandMessage } from "../messages/commons/command-message.interface";
import { IRoomMessage } from "../messages/commons/room-message.interface";
import { MessageHandler } from "./message-handler";

describe("MessageHandler", () => {
    let messageHandler: MessageHandler;
    let roomMessage: IRoomMessage;
    let fakeRoom: Room;
    let fakeUsername = "mat";
    let fakeMessage = "a fake message to not send to a user";

    let fakeLetters = ['A', 'B', 'C'];
    let fakeLettersToSend = ['A', 'Z', 'K'];

    beforeEach(() => {
        messageHandler = new MessageHandler();
        let roomCapacity = 2;
        fakeRoom = new Room(roomCapacity);

        roomMessage = {
            _commandType: CommandType.MessageCmd,
            _username: fakeUsername,
            _message: fakeMessage,
            _date: new Date(),
            _roomId: fakeRoom.roomId,
            _numberOfMissingPlayers: fakeRoom.numberOfMissingPlayers(),
            _roomIsReady: fakeRoom.isFull(),
        };
    });

    it("should create a new MessageHandler", () => {
        messageHandler = new MessageHandler();
        expect(messageHandler).not.to.be.undefined;
    });

    it("createRoomMessageResponse, Should throw Null argument exception if the username is null", () => {
        let wrapper = () => messageHandler.createRoomMessageResponse(null, fakeRoom, fakeMessage);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createRoomMessageResponse, Should throw Null argument exception if the room is null", () => {
        let wrapper = () => messageHandler.createRoomMessageResponse(fakeUsername, null, fakeMessage);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createRoomMessageResponse, Should throw Null argument exception if the message is empty", () => {
        let wrapper = () => messageHandler.createRoomMessageResponse(fakeUsername, fakeRoom, "");
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createRoomMessageResponse, Should create a valid message response", () => {
        let response = messageHandler.createRoomMessageResponse(fakeUsername, fakeRoom, fakeMessage);

        assert(response._commandType === CommandType.MessageCmd);
        expect(response._date).to.be.instanceof(Date);
        assert(response._message === fakeMessage);
        assert(response._numberOfMissingPlayers === roomMessage._numberOfMissingPlayers);
        assert(response._roomId === fakeRoom.roomId);
        assert(response._roomIsReady === fakeRoom.isFull());
        assert(response._username === fakeUsername);
    });

    it("createPlaceWordResponse, Should throw Null argument exception if the username is null", () => {
        let wrapper = () => messageHandler.createPlaceWordResponse(null, fakeRoom, CommandStatus.NotAllowed, fakeLetters);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createPlaceWordResponse, Should throw Null argument exception if the room is null", () => {
        let wrapper = () => messageHandler.createPlaceWordResponse(fakeUsername, null, CommandStatus.NotAllowed, fakeLetters);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createPlaceWordResponse, Should throw Null argument exception if the CommandStatus is null", () => {
        let wrapper = () => messageHandler.createPlaceWordResponse(fakeUsername, fakeRoom, null, fakeLetters);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createPlaceWordResponse, Should throw Null argument exception if the letters is null", () => {
        let wrapper = () => messageHandler.createPlaceWordResponse(fakeUsername, fakeRoom, CommandStatus.Ok, null);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createPlaceWordResponse, Should create valid message with ok response with the letters to place", () => {
        let response = messageHandler.createPlaceWordResponse(fakeUsername, fakeRoom, CommandStatus.Ok, fakeLetters);
        let expectedMessage = `$: <!placer> ` + ' ' + `${fakeLetters.toString()}`;

        assert(response._username === fakeUsername);
        expect(response._room).to.be.deep.equals(fakeRoom);
        assert(response._commandStatus === CommandStatus.Ok);
        assert(response._commandType === CommandType.PlaceCmd);
        expect(response._data).to.be.deep.equals(fakeLetters);
        assert(response._message === expectedMessage);
        expect(response._date).to.be.instanceof(Date);
    });

    it("createPlaceWordResponse, Should create valid message with NotAllowed response with the letters to place", () => {
        let response = messageHandler.createPlaceWordResponse(fakeUsername, fakeRoom, CommandStatus.NotAllowed, fakeLetters);
        let expectedMessage = `$: ${CommandStatus[CommandStatus.NotAllowed]} `
            + `<!placer> ` + ' ' + `${fakeLetters.toString()}`;

        assert(response._username === fakeUsername);
        expect(response._room).to.be.deep.equals(fakeRoom);
        assert(response._commandStatus === CommandStatus.NotAllowed);
        assert(response._commandType === CommandType.PlaceCmd);
        expect(response._data).to.be.deep.equals(fakeLetters);
        assert(response._message === expectedMessage);
        expect(response._date).to.be.instanceof(Date);
    });

    it("createExchangeLettersResponse, Should throw Null argument exception if the username is null", () => {
        let wrapper = () => messageHandler.createExchangeLettersResponse(null, fakeRoom, CommandStatus.NotAllowed, fakeLetters, fakeLettersToSend);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createExchangeLettersResponse, Should throw Null argument exception if the room is null", () => {
        let wrapper = () => messageHandler.createExchangeLettersResponse(fakeUsername, null, CommandStatus.NotAllowed, fakeLetters, fakeLettersToSend);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createExchangeLettersResponse, Should throw Null argument exception if the CommandStatus is null", () => {
        let wrapper = () => messageHandler.createExchangeLettersResponse(fakeUsername, fakeRoom, null, fakeLetters, fakeLettersToSend);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createExchangeLettersResponse, Should throw Null argument exception if the letters to change is null", () => {
        let wrapper = () => messageHandler.createExchangeLettersResponse(fakeUsername, fakeRoom, CommandStatus.NotAllowed, null, fakeLettersToSend);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createExchangeLettersResponse, Should create valid message with NotAllowed response with the letters to exchange", () => {
        let response = messageHandler.createExchangeLettersResponse(fakeUsername, fakeRoom, CommandStatus.NotAllowed, fakeLetters, null);
        let expectedMessage = `$: ${CommandStatus[CommandStatus.NotAllowed]} `
            + `<!changer> ` + ' '
            + `${fakeLetters.toString()}`;

        assert(response._username === fakeUsername);
        expect(response._room).to.be.deep.equals(fakeRoom);
        assert(response._commandStatus === CommandStatus.NotAllowed);
        assert(response._commandType === CommandType.ExchangeCmd);
        expect(response._data).to.be.null;
        assert(response._message === expectedMessage);
        expect(response._date).to.be.instanceof(Date);
    });

    it("createExchangeLettersResponse, Should create valid message with Ok response with the letters to exchange", () => {
        let response = messageHandler.createExchangeLettersResponse(fakeUsername, fakeRoom, CommandStatus.Ok, fakeLetters, fakeLettersToSend);
        let expectedMessage = `$: <!changer> ` + ' ' + `${fakeLetters.toString()}`;

        assert(response._username === fakeUsername);
        expect(response._room).to.be.deep.equals(fakeRoom);
        assert(response._commandStatus === CommandStatus.Ok);
        assert(response._commandType === CommandType.ExchangeCmd);
        expect(response._data).to.be.deep.equals(fakeLettersToSend);
        assert(response._message === expectedMessage);
        expect(response._date).to.be.instanceof(Date);
    });

    it("createCommandResponse, Should throw Null argument exception if the username is null", () => {
        let request = { commandType: CommandType.PassCmd, commandStatus: CommandStatus.NotAllowed, data: "" };
        let wrapper = () => messageHandler.createCommandResponse(null, fakeRoom, request);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createCommandResponse, Should throw Null argument exception if the room is null", () => {
        let request = { commandType: CommandType.PassCmd, commandStatus: CommandStatus.NotAllowed, data: "" };
        let wrapper = () => messageHandler.createCommandResponse(fakeUsername, null, request);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createCommandResponse, Should throw Null argument exception if the CommandType is null", () => {
        let request = { commandType: CommandType.unknown, commandStatus: CommandStatus.NotAllowed, data: "" };
        request.commandType = null;
        let wrapper = () => messageHandler.createCommandResponse(fakeUsername, fakeRoom, request);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createCommandResponse, Should throw Null argument exception if the CommandStatus is null", () => {
        let request = { commandType: CommandType.PassCmd, commandStatus: CommandStatus.unknown, data: "" };
        request.commandStatus = null;
        let wrapper = () => messageHandler.createCommandResponse(fakeUsername, fakeRoom, request);
        expect(wrapper).throw(Error, "Null argument exception: the parameters cannot be null be null.");
    });

    it("createCommandResponse, Should create valid message with NotAllowed response with the letters to exchange", () => {
        let request = { commandType: CommandType.PassCmd, commandStatus: CommandStatus.NotAllowed, data: "" };
        let response = messageHandler.createCommandResponse(fakeUsername, fakeRoom, request);
        let expectedMessage = `$: ${CommandStatus[CommandStatus.NotAllowed]} ` + ' '
            + `<${""}>`;

        assert(response._username === fakeUsername);
        expect(response._room).to.be.deep.equals(fakeRoom);
        assert(response._commandStatus === CommandStatus.NotAllowed);
        assert(response._commandType === CommandType.PassCmd);
        expect(response._data).to.be.null;
        assert(response._message === expectedMessage);
        expect(response._date).to.be.instanceof(Date);
    });

    it("createCommandResponse, Should create valid message with Ok response with the letters to exchange", () => {
        let request = { commandType: CommandType.PassCmd, commandStatus: CommandStatus.Ok, data: "" };
        let response = messageHandler.createCommandResponse(fakeUsername, fakeRoom, request);
        let expectedMessage = `$: <!${CommandType[CommandType.PassCmd]}>` + ' ' + `${""}`;

        assert(response._username === fakeUsername);
        expect(response._room).to.be.deep.equals(fakeRoom);
        assert(response._commandStatus === CommandStatus.Ok);
        assert(response._commandType === CommandType.PassCmd);
        expect(response._data).to.be.null;
        assert(response._message === expectedMessage);
        expect(response._date).to.be.instanceof(Date);
    });

});