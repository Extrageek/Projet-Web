import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LeaderboardComponent } from '../components/leaderboard.component';
import { UserSettingComponent } from '../components/user-setting.component';
import { DisplayComponent } from '../components/display.component';


const routes: Routes = [
 //{ path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user', component: UserSettingComponent},
  { path: 'leaderboard', component: LeaderboardComponent},
  { path: 'game', component: DisplayComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
