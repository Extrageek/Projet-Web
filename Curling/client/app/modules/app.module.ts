import { NgModule  }      from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule  }   from '@angular/forms';
import { HttpModule  }   from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from '../components/app.component';
import { GlComponent } from '../components/gl.component';
import { DashboardComponent } from '../components/dashboard.component';
import { UserSettingComponent } from '../components/user-setting.component';


import { ModifierDirective } from '../directives/modifier.directive'

import { RenderService } from '../services/render.service';
import { RestApiProxyService } from '../services/rest-api-proxy.service';

import { UserSetting } from '../models/user-setting';

@NgModule({
  imports: [ BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot()],
  declarations: [ AppComponent, GlComponent, DashboardComponent, ModifierDirective, UserSettingComponent],
  providers: [ RenderService, RestApiProxyService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
