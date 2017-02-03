// import {
//     fakeAsync,
//     inject,
//     ComponentFixture,
//     TestBed
// } from '@angular/core/testing';
// import {
//     HttpModule, Http, ResponseOptions,
//     Response,
//     BaseRequestOptions,
//     ConnectionBackend
// } from '@angular/http';

// import { MockBackend, MockConnection } from '@angular/http/testing';

// import { RestApiProxyService } from '../services/rest-api-proxy.service';
// import { DisplayComponent } from './display.component';
// import { GameStatus } from '../models/game-status';
// import { UserSetting, Difficulty } from '../models/user-setting';
// import { expect } from "chai";

// let _gameStatus: GameStatus;
// let _userSetting: UserSetting;
// let _displayComponent: DisplayComponent;
// let _restApiProxyService: RestApiProxyService;

// describe("A DisplayComponent should", () => {
//     beforeEach(async () => {
//         _gameStatus = new GameStatus();
//         _userSetting = new UserSetting();
//     });

//     it("show computer name correctly when difficulty is hard", done => {
//         _userSetting.difficulty = Difficulty.HARD;
//         _displayComponent.getComputerName();
//         expect(_displayComponent._computerName).to.equal("CPU Difficile");
//     });

//     it("show computer name correctly when difficulty is normal", done => {
//         _userSetting.difficulty = Difficulty.NORMAL;
//         _displayComponent.getComputerName();
//         expect(_displayComponent._computerName).to.equal("CPU Normal");
//     });

//     it("exit correctly when game is over", done => {
//         fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((connection: MockConnection) => {
//                 // Send a fake data to the caller
//                 //connection.mockRespond(new Response(new ResponseOptions({ body:  })));
//             });

//             //fixture = TestBed.createComponent(GridComponent);
//             //comp = fixture.componentInstance;
//         });
//     });
//     it("initialize correctly the display", done => {
//         _displayComponent.ngOnInit();

//         // this._userSetting = this.userSettingService.userSetting;
//         // console.log(this.userSettingService.userSetting);
//         // this._gameStatus = this.gameStatusService.gameStatus;
//         // let hamburger = document.querySelector(".hamburger");
//         // let overlay = document.querySelector(".overlay");
//         // // open or close the overlay and animate the hamburger.
//         // hamburger.addEventListener("click", () => {
//         //     hamburger.classList.toggle("is-active");
//         //     overlay.classList.toggle("is-open-menu");
//         // });
//         // // Save the record before closing the game display window.
//         // window.addEventListener("beforeunload", () => {
//         //     this.restApiProxyService.createGameRecord(this._userSetting, this._gameStatus);
//         // });

//     })
// });
