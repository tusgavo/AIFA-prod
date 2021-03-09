import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { MEAT_API } from '../app.api'

@Injectable({
  providedIn: 'root'
})
export class PosicaoService {

  constructor(private http: HttpClient) { }

  getPosicoes() {
    return this.http.get(`${MEAT_API}/getPosicoes`)
  }

}
