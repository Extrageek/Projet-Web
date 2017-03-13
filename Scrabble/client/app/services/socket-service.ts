import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import * as io from "socket.io-client";

import { SocketEventType } from "../commons/socket-eventType";

const SERVER_PORT = 3002;

@Injectable()
export class SocketService {

    static _socket: SocketIOClient.Socket = null;
    private _serverUri: string = 'http://localhost:' + SERVER_PORT;
    private _playersPriorityQueue: Array<string>;

    // Must be removed after a clean debug
    public set playersPriorityQueue(players: Array<string>) {
        this._playersPriorityQueue = players;
    }

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        this._playersPriorityQueue = new Array<string>();
        this.initializeClient();
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

        this.activatedRoute.params.subscribe(params => {
            if (SocketService._socket === null) {
                SocketService._socket = io.connect(this._serverUri, { 'forceNew': false });

                // this.subscribeToChannelEvent(SocketEventType.updatePlayersQueue)
                //     .subscribe((players: Array<string>) => {
                //         this._playersPriorityQueue = players;
                //     });

                // TODO: Leave this for now, I'm working on it
                if (this.activatedRoute.params["id"] !== null) {
                    this.router.navigate(["/", ""]);
                }
            }
        });

    }

    public emitMessage(socketEventType: SocketEventType, data?: Object) {
        SocketService._socket.emit(socketEventType.toString(), data);
    }

    public subscribeToChannelEvent(socketEventType: SocketEventType) {
        let observable = new Observable((observer: any) => {

            SocketService._socket.on(socketEventType.toString(), (data: any) => {
                observer.next(data);
            });

            return () => {
                SocketService._socket.disconnect();
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
