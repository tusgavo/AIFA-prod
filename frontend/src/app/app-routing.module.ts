import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { InicioComponent } from './components/admin/inicio/inicio.component';
import { LoggedInGuard } from "./core/authentication/loggedin.guard";
import { EquipesAdminComponent } from "./components/admin/equipes-admin/equipes-admin.component";
import { AtletasAdminComponent } from "./components/admin/atletas-admin/atletas-admin.component";
import { CarteirinhasComponent } from "./components/admin/carteirinhas/carteirinhas.component";
import { ImprimircartaoComponent } from "./components/admin/imprimircartao/imprimircartao.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "cartao", canActivate: [LoggedInGuard], component: ImprimircartaoComponent },
  {
    path: "admin",
    canActivate: [LoggedInGuard],
    component: AdminComponent,
    children: [
      { path: "", redirectTo: "inicio", pathMatch: "full" },
      { path: "inicio", component: InicioComponent },
      { path: "equipes", component: EquipesAdminComponent },
      { path: "cartao", component: CarteirinhasComponent },
      { path: "atletas", component: AtletasAdminComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
