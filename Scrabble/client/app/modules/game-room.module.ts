import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";

import { BoardComponent } from "./../components/board.component";
import { EaselComponent } from "./../components/easel.component";
import { ChatroomComponent } from "./../components/chatroom.component";
import { InformationPanelComponent } from "./../components/information-panel.component";
import { GameComponent } from "./../components/game-room.component";
import { WaitingRoomComponent } from "./../components/waiting-room.component";

@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule],
    declarations: [
        BoardComponent,
        ChatroomComponent,
        EaselComponent,
        GameComponent,
        InformationPanelComponent,
        WaitingRoomComponent
    ]
})
export class GameRoomModule { }
