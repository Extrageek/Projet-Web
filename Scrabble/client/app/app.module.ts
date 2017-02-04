import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GameInitiationComponent } from "./components/game-initiation.component";
import { GameComponent } from "./components/game-room.component";

const appRoutes: Routes = [
    { path: "", redirectTo: "/game-start", pathMatch: "full"},
    { path: "game-start", component: GameInitiationComponent},
    { path: "game-room", component: GameComponent, data: {id: ""}},
    ];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes)],
  exports: [ RouterModule ],
})
export class RouteModule { }
