import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { RouteModule } from "./routing-app.module";

import { GameRoomModule } from "./game-room.module";
import { AppComponent } from "./../components/app.component";
import { GameInitiationComponent } from "./../components/game-initiation.component";
import { SocketService } from './../services/socket-service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouteModule,
        GameRoomModule
    ],
    declarations: [
        AppComponent,
        GameInitiationComponent,
    ],
    providers: [SocketService],
    bootstrap: [AppComponent],
})
export class GameStartModule { }
