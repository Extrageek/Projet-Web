import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridComponent} from './grid.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent, GridComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
