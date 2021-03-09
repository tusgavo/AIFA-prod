import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { LoginService } from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const loginService = this.injector.get(LoginService)
    if(loginService.isLoggedIn()){
      const authRequest = req.clone(
        { setHeaders: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )
      return next.handle(authRequest)
    } else {
      return next.handle(req);
    }
  }

}
