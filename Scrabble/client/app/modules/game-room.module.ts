import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { FormsModule } from '@angular/forms';
import { ScrabbleBoardComponent } from "./components/scrabble-board.component";
import { EaselComponent } from "./components/easel.component";
import { ChatroomComponent } from "./components/chatroom.component";
import { InformationPanelComponent } from "./components/information-panel.component";
import { GameComponent } from "./components/game-room.component";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [
        GameComponent,
        ScrabbleBoardComponent,
        EaselComponent,
        ChatroomComponent,
        InformationPanelComponent
    ],
})
export class GameRoomModule { }
