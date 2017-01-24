import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { Puzzle } from './models/puzzle';
import { GridComponent } from './components/grid.component';
import { PuzzleEventManagerService } from './services/puzzle-event-manager.service';

import { RestApiProxyService } from './services/rest-api-proxy.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    AppComponent,
    GridComponent
  ],
  providers : [ PuzzleEventManagerService, RestApiProxyService ],
  bootstrap: [ AppComponent, GridComponent ]
})
export class AppModule { }
