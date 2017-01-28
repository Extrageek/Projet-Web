import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../components/dashboard.component';
import { UserSettingComponent } from '../components/user-setting.component';
import { GlComponent } from '../components/gl.component';

// TODO : Put the right paths
const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user', component: UserSettingComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'game', component: GlComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
