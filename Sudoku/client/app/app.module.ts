import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid.component';
import { PuzzleEventManagerService } from './services/puzzle-event-manager.service';

import { RestApiProxyService } from './services/rest-api-proxy.service';
import { PuzzleManagerService } from './services/grid-manager.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule ],
  declarations: [
    AppComponent,
    GridComponent
<<<<<<< HEAD
    ],
  providers : [
=======
  ],
  providers: [
>>>>>>> e17a7717774b617085902d4ee3d5330aa144eac4
    PuzzleEventManagerService,
    RestApiProxyService,
    PuzzleManagerService ],
  bootstrap: [ AppComponent, GridComponent ]
})
export class AppModule { }
