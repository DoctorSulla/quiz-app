import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GameHubComponent } from './game-hub/game-hub.component';
import { LobbyComponent } from './lobby/lobby.component';
import { CreateCategoryComponent } from './create-category/create-category.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'game/:gameId', component: GameHubComponent },
  { path: 'lobby/:gameId', component: LobbyComponent },
  { path: 'new-category', component: CreateCategoryComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
