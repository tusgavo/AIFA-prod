import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { MEAT_API } from '../app.api'

@Injectable({
  providedIn: 'root'
})
export class CarteirinhasService {

  constructor(private http: HttpClient) { }

  getCarteirinhas(q?, clube?, emMes?, emAno?, vaMes?, vaAno?,) {
    let params: HttpParams = undefined
    params = new HttpParams()
    .set('selector', clube)
    .set('q', q)
    .set('emMes', emMes)
    .set('emAno', emAno)
    .set('vaMes', vaMes)
    .set('vaAno', vaAno)
    return this.http.get(`${MEAT_API}/getCarteirinhas`, { params })
  }

  updateDataEmissao(ids, dataEmissao, dataValidade) {
    return this.http.put(`${MEAT_API}/updateDataEmissao`, { ids, dataEmissao, dataValidade })
  }

  getCartoes(ids) {
    let params: HttpParams = undefined
    params = new HttpParams().set('ids', JSON.stringify(ids))
    return this.http.get(`${MEAT_API}/getCartoes`, { params })
  }

}
