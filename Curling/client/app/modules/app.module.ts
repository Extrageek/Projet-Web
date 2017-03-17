import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from '../components/app.component';
import { GlComponent } from '../components/gl.component';
import { LeaderboardComponent } from '../components/leaderboard.component';
import { UsernameComponent } from '../components/username.component';
import { DifficultyComponent } from '../components/difficulty.component';
import { DisplayComponent } from '../components/display.component';

import { ModifierDirective } from '../directives/modifier.directive';

import { RenderService } from './../services/game-physics/render.service';
import { RestApiProxyService } from './../services/rest-api-proxy.service';
import { UserSettingService } from './../services/user-setting.service';
import { GameStatusService } from './../services/game-status.service';
import { CameraService } from './../services/views/cameras.service';
import { LightingService } from './../services/views/ligthing.service';
import { TextureService } from './../services/game-physics/texture.service';

@NgModule({
  imports: [ BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot()],
  declarations: [ AppComponent, GlComponent, LeaderboardComponent, ModifierDirective,
                  UsernameComponent, DifficultyComponent, DisplayComponent],
  providers: [ RenderService, RestApiProxyService, UserSettingService,
               GameStatusService, CameraService, LightingService, TextureService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
