import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../components/dashboard.component';
import { UserSettingComponent } from '../components/user-setting.component';
import { DisplayComponent } from '../components/display.component';

// TODO : Put the right paths
const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user', component: UserSettingComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'game', component: DisplayComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
