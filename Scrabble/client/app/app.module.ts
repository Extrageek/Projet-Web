import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { AppComponent } from './app.component';
import { GridComponent} from './grid.component';
import { EaselComponent} from './easel.component';

@NgModule({
  imports: [ BrowserModule ,
    FormsModule],
  declarations: [ AppComponent, 
    GridComponent,
    EaselComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule { }