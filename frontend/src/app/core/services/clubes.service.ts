import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { MEAT_API } from '../app.api'

@Injectable({
  providedIn: 'root'
})
export class ClubesService {

  constructor(private http: HttpClient) { }

  getClubes() {
    return this.http.get(`${MEAT_API}/getClubes`)
  }

}
