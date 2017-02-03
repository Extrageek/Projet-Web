import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./components/app.component";
import { ScrabbleBoardComponent } from "./components/scrabble-board.component";
import { EaselComponent } from "./components/easel.component";
import { ChatroomComponent } from "./components/chatroom.component";
import { InformationPanelComponent } from "./components/information-panel.component";
import { GameInitiationComponent } from "./components/game-initiation.component";
import { GameComponent } from "./components/game-room.component";
import { UserSettingsService } from "./services/userSettingService";


const appRoutes: Routes = [
    { path: "", redirectTo: "/game-start", pathMatch: "full"},
    { path: "game-start", component: GameInitiationComponent},
    { path: "game-room", component: GameComponent, data: {id: ""}},
    ];

@NgModule({
  imports: [ BrowserModule ,
      FormsModule,
      RouterModule.forRoot(appRoutes)],
  exports: [
      RouterModule],
  providers: [ UserSettingsService ],
  declarations: [ AppComponent,
      EaselComponent,
      ScrabbleBoardComponent,
      ChatroomComponent,
      InformationPanelComponent,
      GameInitiationComponent,
      GameComponent],

  bootstrap: [ AppComponent ]
})
export class AppModule { }
