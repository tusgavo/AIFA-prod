import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { MEAT_API } from '../app.api'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null
  }

  login(usuario) {
    return this.http.post(`${MEAT_API}/login`, usuario)
  }

  logoff() {
    localStorage.removeItem('token')
    this.router.navigate(['/'])
  }

  handleLogin() {
    this.router.navigate(['/'])
  }

}
