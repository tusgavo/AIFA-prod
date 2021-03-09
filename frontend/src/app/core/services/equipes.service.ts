import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { MEAT_API } from '../app.api'

@Injectable({
  providedIn: 'root'
})
export class EquipesService {

  constructor(private http: HttpClient) { }

  getEquipes(q?) {
    let params: HttpParams = undefined
    if (q) params = new HttpParams().set('q', q)
    return this.http.get(`${MEAT_API}/getEquipes`, { params: params })
  }

  getEquipe(id) {
    return this.http.get(`${MEAT_API}/getEquipe/${id}`)
  }

  cadastrar(equipe, foto) {
    const formData = new FormData()
    formData.append('nome', equipe.nome)
    formData.append('cnpj', equipe.cnpj)
    formData.append('empresa', equipe.empresa)
    formData.append('id_clube', equipe.id_clube)
    formData.append('responsavel', equipe.responsavel)
    formData.append('cpf_responsavel', equipe.cpf_responsavel)
    formData.append('telefone_responsavel', equipe.telefone_responsavel)
    formData.append('email_responsavel', equipe.email_responsavel)
    formData.append('tecnico', equipe.tecnico)
    if(equipe.auxTecnico === '') formData.append('auxTecnico', equipe.auxTecnico)
    if(equipe.massagista === '') formData.append('massagista', equipe.massagista)
    formData.append('fotos', foto, foto.name)
    return this.http.post(`${MEAT_API}/cadastrarEquipe`, formData)
  }

  update(id, equipe, foto) {
    const formData = new FormData()
    formData.append('nome', equipe.nome)
    formData.append('cnpj', equipe.cnpj)
    formData.append('empresa', equipe.empresa)
    formData.append('id_clube', equipe.id_clube)
    formData.append('responsavel', equipe.responsavel)
    formData.append('telefone_responsavel', equipe.telefone_responsavel)
    formData.append('cpf_responsavel', equipe.cpf_responsavel)
    formData.append('email_responsavel', equipe.email_responsavel)
    formData.append('tecnico', equipe.tecnico)
    if(equipe.auxTecnico === '') formData.append('auxTecnico', equipe.auxTecnico)
    if(equipe.massagista === '') formData.append('massagista', equipe.massagista)
    if(foto) formData.append('fotos', foto, foto.name)
    return this.http.put(`${MEAT_API}/updateEquipe/${id}`, formData)
  }

  deletar(id) {
    return this.http.delete(`${MEAT_API}/deletarEquipe/${id}`)
  }

}
