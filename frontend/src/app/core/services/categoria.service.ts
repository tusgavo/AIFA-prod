import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { MEAT_API } from '../app.api'

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  getCategorias() {
    return this.http.get(`${MEAT_API}/getCategorias`)
  }

}
