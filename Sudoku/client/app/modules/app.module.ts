import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from '../components/app.component';
import { GridComponent } from '../components/grid.component';
import { UsernameComponent } from '../components/username.component';
import { DifficultyComponent } from '../components/difficulty.component';

import { PuzzleEventManagerService } from '../services/puzzle-event-manager.service';
import { GridManagerService } from '../services/grid-manager.service';
import { UserSettingService } from '../services/user-setting.service';
import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { StopwatchService } from "../services/stopwatch.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpModule,
    ],
    declarations: [
        AppComponent,
        GridComponent,
        UsernameComponent,
        DifficultyComponent
    ],
    providers: [
        RestApiProxyService,
        GridManagerService,
        PuzzleEventManagerService,
        UserSettingService,
        StopwatchService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
