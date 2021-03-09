import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TextMaskModule } from "angular2-text-mask";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoggedInGuard } from "./core/authentication/loggedin.guard";
import { LoginService } from "./core/authentication/login.service";
import { AuthInterceptor } from './core/authentication/auth.interceptor';

import { AdminComponent } from './components/admin/admin.component';
import { InicioComponent } from './components/admin/inicio/inicio.component';
import { EquipesAdminComponent } from "./components/admin/equipes-admin/equipes-admin.component";
import { AtletasAdminComponent } from "./components/admin/atletas-admin/atletas-admin.component";

import { LoginComponent } from './components/login/login.component';
import { InputComponent } from './shared/input/input.component';
import { MensagemComponent } from './shared/modal/mensagem/mensagem.component';
import { CarteirinhasComponent } from './components/admin/carteirinhas/carteirinhas.component';
import { ImprimircartaoComponent } from './components/admin/imprimircartao/imprimircartao.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InputComponent,
    AdminComponent,
    InicioComponent,
    EquipesAdminComponent,
    AtletasAdminComponent,
    MensagemComponent,
    CarteirinhasComponent,
    ImprimircartaoComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TextMaskModule,
    AppRoutingModule
  ],
  providers: [
    LoginService,
    LoggedInGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
