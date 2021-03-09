import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../core/authentication/login.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  logoff() {
    this.loginService.logoff()
  }

}
