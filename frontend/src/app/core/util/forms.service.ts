import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'

import estados from '../../../assets/javascript/estados'

import * as moment from "moment";
import 'moment/locale/pt-br';

@Injectable({
  providedIn: "root",
})
export class FormsService {

  estados: Array<any> = estados

  resposta = [
    { selector: "Sim", value: "1" },
    { selector: "Não", value: "0" },
  ];

  mask = {
    rg: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/],
    cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    telefone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    celular: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  }

  nomePatter = /[A-z].*\s[A-z]/;
  emailPatter = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  rgPatter = /[^0-9]{0,}([0-9]{2})\.?([0-9]{3})\.?([0-9]{3})\-?([0-9|x|X]).*/
  cpfPatter = /[0-9]{3}\s?\.?\s?[0-9]{3}\s?\.?\s?[0-9]{3}\s?-?\s?[0-9]{2}/
  celularPatter = /[^0-9]{0,}([0-9]{2})[^0-9]{0,}([0-9]{5})[^0-9]{0,}([0-9]{4}).*/
  telefonePatter = /[^0-9]{0,}([0-9]{2})[^0-9]{0,}([0-9]{4})[^0-9]{0,}([0-9]{4}).*/
  cnpjPatter = /[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/;

  constructor(private fb: FormBuilder) {}

  getFormLogin() {
    return this.fb.group({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailPatter),
      ]),
      senha: new FormControl("", [Validators.required])
    })
  }

  getFormEquipe() {
    return this.fb.group({
      nome: new FormControl("", [Validators.required]),
      cnpj: new FormControl("", [Validators.pattern(this.cnpjPatter)]),
      empresa: new FormControl("", [Validators.required]),
      id_clube: new FormControl(0, [Validators.required]),
      responsavel: new FormControl("", [Validators.required]),
      cpf_responsavel: new FormControl("", [
        Validators.required,
        Validators.pattern(this.cpfPatter),
        Validators.maxLength(16),
      ]),
      telefone_responsavel: new FormControl("", [
        Validators.required,
        Validators.pattern(this.telefonePatter),
        Validators.maxLength(16),
      ]),
      email_responsavel: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailPatter),
      ]),
      tecnico: new FormControl("", [Validators.required]),
      auxTecnico: new FormControl("", []),
      massagista: new FormControl("", []),
    });
  }

  setFormEquipe(form: FormGroup, value?: any) {
    form.setValue({
      nome: value ? value["nome"] : "",
      cnpj: value ? value["cnpj"] : "",
      empresa: value ? value["empresa"] : "",
      id_clube: value ? value["id_clube"] : "",
      responsavel: value ? value["responsavel"] : "",
      cpf_responsavel: value ? value["cpf_responsavel"] : "",
      telefone_responsavel: value ? value["telefone_responsavel"] : "",
      email_responsavel: value ? value["email_responsavel"] : "",
      tecnico: value ? value["tecnico"] : "",
      auxTecnico: value ? value["auxTecnico"] : "",
      massagista: value ? value["massagista"] : "",
    });
  }

  getFormAtleta() {
    return this.fb.group({
      nome: new FormControl("", [Validators.required, Validators.minLength(5)]),
      rg: new FormControl("", [
        Validators.required,
        Validators.pattern(this.rgPatter),
      ]),
      cpf: new FormControl("", [
        Validators.required,
        Validators.pattern(this.cpfPatter),
      ]),
      data_nasc: new FormControl(null, [Validators.required]),
      id_categoria: new FormControl("null", [Validators.required]),
      id_clube: new FormControl("null"),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailPatter),
      ]),
      telefone: new FormControl("", [
        Validators.pattern(this.telefonePatter),
        Validators.maxLength(15),
      ]),
      celular: new FormControl("", [
        Validators.required,
        Validators.pattern(this.celularPatter),
        Validators.maxLength(16),
      ]),
      endereco: new FormControl("", [Validators.required]),
      estado: new FormControl("", [Validators.required]),
      cidade: new FormControl("", [Validators.required]),
      nome_mae: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      nome_pai: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      nome_responsavel: new FormControl("", [Validators.minLength(3)]),
      cpf_responsavel: new FormControl("", [
        Validators.pattern(this.cpfPatter),
        Validators.maxLength(16),
      ]),
      telefone_responsavel: new FormControl("", [
        Validators.pattern(this.telefonePatter),
        Validators.maxLength(15),
      ]),
      celular_responsavel: new FormControl("", [
        Validators.pattern(this.celularPatter),
        Validators.maxLength(16),
      ]),
    });
  }

  setFormAtleta(form: FormGroup, value?: any) {
    form.setValue({
      nome: value ? value["nome"] : "",
      rg: value ? value["rg"] : "",
      cpf: value ? value["cpf"] : "",
      data_nasc: value
        ? value["data_nasc"]
          ? moment(value["data_nasc"]).format("YYYY-MM-DD")
          : null
        : null,
      id_categoria: value ? value["id_categoria"] : "null",
      id_clube: value
        ? value["id_clube"] === null
          ? "null"
          : value["id_clube"]
        : "null",
      email: value ? value["email"] : "",
      telefone: value ? value["telefone"] : "",
      celular: value ? value["celular"] : "",
      endereco: value ? value["endereco"] : "",
      cidade: value ? value["cidade"] : "",
      estado: value
        ? this.estados.filter((item) => item.sigla == value["estado"])[0].nome
        : "",
      nome_mae: value ? value["nome_mae"] : "",
      nome_pai: value ? value["nome_pai"] : "",
      nome_responsavel: value ? value["nome_responsavel"] : "",
      cpf_responsavel: value ? value["cpf_responsavel"] : "",
      telefone_responsavel: value ? value["telefone_responsavel"] : "",
      celular_responsavel: value ? value["celular_responsavel"] : "",
    });
  }

}
