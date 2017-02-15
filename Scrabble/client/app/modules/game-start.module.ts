import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RouteModule } from "./routing-app.module";
import { FormsModule } from '@angular/forms';
import { GameRoomModule } from "./game-room.module";
import { AppComponent } from "./../components/app.component";
import { GameInitiationComponent } from "./../components/game-initiation.component";

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
    bootstrap: [ AppComponent ]
})
export class GameStartModule { }
