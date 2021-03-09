import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router"

import { FormsService } from "../../core/util/forms.service";
import { LoginService } from "../../core/authentication/login.service";
import { NotificaService } from './../../shared/modal/notifica.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private formsService: FormsService,
    private loginService: LoginService,
    private notificaService: NotificaService,
    private router: Router,
  ) { }

  loginForm: FormGroup

  ngOnInit() {
    this.loginService.isLoggedIn() ? this.router.navigate(["/admin"]) : this.loginForm = this.formsService.getFormLogin()
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn()
  }

  Logar() {
    // E-mail: lidiprojet@fiec.com, senha: 12345678
    if(this.loginForm.valid)
      this.loginService.login(this.loginForm.value)
      .subscribe((token: string) => {
        if(token){
          localStorage.setItem('token', token)
          this.notificaService.modalMensagem(`Seja bem vindo`)
          this.router.navigate(["/admin"])
        }
      }, response => {
        this.notificaService.modalMensagem(response.error['msgErr'])
      })
     else Object.keys(this.loginForm.controls)
    .forEach(campo => this.loginForm.get(campo).markAsTouched())
  }

}
