import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import * as io from "socket.io-client";

import { SocketEventType } from "../commons/socket-eventType";

import { Player } from "../models/player";

const SERVER_PORT = 3002;

@Injectable()
export class SocketService {

    _socket: SocketIOClient.Socket = null;
    _playersPriorityQueue: Array<string>;
    private _player: Player;
    private _missingPlayers: number;
    private _serverUri: string = 'http://localhost:' + SERVER_PORT;

    public get missingPlayers(): number {
        return this._missingPlayers;
    }
    public set missingPlayers(v: number) {
        this._missingPlayers = v;
    }

    public get player(): Player {
        return this._player;
    }

    public set player(v: Player) {
        this._player = v;
    }

    // Must be removed after a clean debug
    public set playersPriorityQueue(players: Array<string>) {
        this._playersPriorityQueue = players;
    }

    constructor(private router: Router) {
        this._playersPriorityQueue = new Array<string>();
        this._player = new Player("");
        this.initializeClient();
    }

    public isCurrentPlayer(): Boolean {
        return this.getCurrentPlayer() === this.player.username;
    }

    private initializeClient() {
        //console.log("ActivatedRoute", this.activatedRoute);
        //  if (SocketService._socket === null) {
        //         SocketService._socket = io.connect(this._serverUri, { 'forceNew': false });

        //         // TODO: Leave this for now, I'm working on it
        //         // if (this.activatedRoute.params["id"] !== null) {
        //         //     this.router.navigate(["/",]);
        //         //}
        //     }


        if (this._socket === null) {
            this._socket = io.connect(this._serverUri, { 'forceNew': false });

            // this.subscribeToChannelEvent(SocketEventType.updatePlayersQueue)
            //     .subscribe((players: Array<string>) => {
            //         this._playersPriorityQueue = players;
            //     });

            // TODO: Leave this for now, I'm working on it
            // if (this.activatedRoute.params["id"] !== null) {
            //     this.router.navigate(["/", ]);
            // }
        }


    }

    public emitMessage(socketEventType: SocketEventType, data?: Object) {
        this._socket.emit(socketEventType.toString(), data);
    }

    public subscribeToChannelEvent(socketEventType: SocketEventType) {
        let observable = new Observable((observer: any) => {

            this._socket.on(socketEventType.toString(), (data: any) => {
                observer.next(data);
            });

            return () => {
                this._socket.disconnect();
            };
        });
        return observable;
    }

    public getCurrentPlayer(): string {
        return this._playersPriorityQueue[0];
    }

    public getNextPlayer(): string {
        return this._playersPriorityQueue[1];
    }
}
