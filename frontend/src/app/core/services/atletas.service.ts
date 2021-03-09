import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import estados from '../../../assets/javascript/estados'
import { MEAT_API } from '../app.api'

@Injectable({
  providedIn: 'root'
})
export class AtletasService {

  constructor(private http: HttpClient) { }

  estados: Array<any> = estados

  getAtletas(q?) {
    let params: HttpParams = undefined
    if (q) params = new HttpParams().set('q', q)
    return this.http.get(`${MEAT_API}/getAtletas`, { params })
  }

  getAtleta(id) {
    return this.http.get(`${MEAT_API}/getAtleta/${id}`)
  }

  cadastrar(atleta, foto) {
    const formData = new FormData()
    formData.append('nome', atleta.nome)
    formData.append('rg', atleta.rg)
    formData.append('cpf', atleta.cpf)
    formData.append('data_nasc', atleta.data_nasc)
    formData.append('id_categoria', atleta.id_categoria)
    formData.append('id_posicao', atleta.id_posicao)
    if(atleta.id_equipe !== "null") formData.append('id_equipe', atleta.id_equipe)
    if(atleta.id_clube !== "null") formData.append('id_clube', atleta.id_clube)
    formData.append('email', atleta.email)
    formData.append('telefone', atleta.telefone)
    formData.append('celular', atleta.celular)
    formData.append('endereco', atleta.endereco)
    formData.append('cidade', atleta.cidade)
    formData.append('estado', this.estados.filter(item => item.nome == atleta.estado)[0].sigla)
    formData.append('nome_mae', atleta.nome_mae)
    formData.append('nome_pai', atleta.nome_pai)
    formData.append('nome_responsavel', atleta.nome_responsavel)
    formData.append('cpf_responsavel', atleta.cpf_responsavel)
    formData.append('telefone_responsavel', atleta.telefone_responsavel)
    formData.append('celular_responsavel', atleta.celular_responsavel)
    formData.append('fotos', foto, foto.name)
    return this.http.post(`${MEAT_API}/cadastrarAtleta`, formData)
  }

  update(id, atleta, foto) {
    const formData = new FormData()
    formData.append('nome', atleta.nome)
    formData.append('rg', atleta.rg)
    formData.append('cpf', atleta.cpf)
    formData.append('data_nasc', atleta.data_nasc)
    formData.append('id_categoria', atleta.id_categoria)
    formData.append('id_posicao', atleta.id_posicao)
    if(atleta.id_equipe !== "null") formData.append('id_equipe', atleta.id_equipe)
    if(atleta.id_clube !== "null") formData.append('id_clube', atleta.id_clube)
    formData.append('email', atleta.email)
    formData.append('telefone', atleta.telefone)
    formData.append('celular', atleta.celular)
    formData.append('endereco', atleta.endereco)
    formData.append('cidade', atleta.cidade)
    formData.append('estado', this.estados.filter(item => item.nome == atleta.estado)[0].sigla)
    formData.append('nome_mae', atleta.nome_mae)
    formData.append('nome_pai', atleta.nome_pai)
    formData.append('nome_responsavel', atleta.nome_responsavel)
    formData.append('cpf_responsavel', atleta.cpf_responsavel)
    formData.append('telefone_responsavel', atleta.telefone_responsavel)
    formData.append('celular_responsavel', atleta.celular_responsavel)
    if (foto) formData.append('fotos', foto, foto.name)
    return this.http.put(`${MEAT_API}/updateAtleta/${id}`, formData)
  }

  deletar(id) {
    return this.http.delete(`${MEAT_API}/deletarAtleta/${id}`)
  }

}
