import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "@angular/material";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "../components/app.component";
import { LeaderboardComponent } from "../components/leaderboard.component";
import { UsernameComponent } from "../components/username.component";
import { DifficultyComponent } from "../components/difficulty.component";
import { DisplayComponent } from "../components/display.component";

import { ModifierDirective } from "../directives/modifier.directive";

import { RenderService } from "../services/game-handler/render.service";
import { RestApiProxyService } from "./../services/rest-api-proxy.service";
import { UserService } from "./../services/user.service";
import { GameStatusService } from "./../services/game-status.service";
import { LightingService } from "./../services/views/ligthing.service";

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, MaterialModule],
  declarations: [AppComponent, LeaderboardComponent, ModifierDirective,
    UsernameComponent, DifficultyComponent, DisplayComponent],
  providers: [RenderService, RestApiProxyService, UserService,
    GameStatusService, LightingService],
  bootstrap: [AppComponent]
})

export class AppModule { }
