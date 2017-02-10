import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsernameComponent } from '../components/username.component';
import { DifficultyComponent } from '../components/difficulty.component';
import { GridComponent } from '../components/grid.component';


const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user', component: UsernameComponent},
  { path: 'difficulty', component: DifficultyComponent},
  { path: 'game', component: GridComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
