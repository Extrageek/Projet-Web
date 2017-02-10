import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid.component';
import { PuzzleEventManagerService } from './services/puzzle-event-manager.service';
import { GridManagerService } from './services/grid-manager.service';

import { RestApiProxyService } from './services/rest-api-proxy.service';
import { StopwatchService } from "./services/stopwatch.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  declarations: [
    AppComponent,
    GridComponent
  ],
  providers: [
    RestApiProxyService,
    GridManagerService,
    PuzzleEventManagerService,
    StopwatchService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
