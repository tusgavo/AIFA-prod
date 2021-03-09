import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { from } from "rxjs";
import {
  switchMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
} from "rxjs/operators";
import { Router } from "@angular/router";

import { CarteirinhasService } from "../../../core/services/carteirinhas.service";
import { ClubesService } from "../../../core/services/clubes.service";
import { NotificaService } from "../../../shared/modal/notifica.service";

import * as moment from "moment";
import 'moment/locale/pt-br';

@Component({
  selector: 'app-carteirinhas',
  templateUrl: './carteirinhas.component.html',
  styleUrls: ['./carteirinhas.component.css']
})
export class CarteirinhasComponent implements OnInit {

  @ViewChildren("cheque") cheque: QueryList<ElementRef>;

  atletasSelecionado = []
  atletas
  data: FormGroup
  formBuscar: FormGroup
  clubes

  constructor(
    private carteirinhasService: CarteirinhasService,
    private clubesService: ClubesService,
    private notificaService: NotificaService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.data = new FormGroup({
      emissao: new FormControl(moment().format('YYYY-MM-DD')),
      validade: new FormControl(moment().add(1,'year').format('YYYY-MM-DD'))
    })
    this.formBuscar = new FormGroup({
      buscaClube: new FormControl(0),
      busca: new FormControl(""),
      buscaEmissaoMes: new FormControl(0),
      buscaEmissaoAno: new FormControl(0),
      buscaValidadeMes: new FormControl(0),
      buscaValidadeAno: new FormControl(0),
    });
    this.getCarteirinhas()
    this.getClubes()
    this.chege()
  }

  chege() {

    this.formBuscar.get('busca').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(q =>
          this.carteirinhasService
            .getCarteirinhas(
              q,
              this.formBuscar.get('buscaClube').value,
              this.formBuscar.get('buscaEmissaoMes').value,
              this.formBuscar.get('buscaEmissaoAno').value,
              this.formBuscar.get('buscaValidadeMes').value,
              this.formBuscar.get('buscaValidadeAno').value,
              )
            .pipe(catchError((error) => from([])))
        )
      )
      .subscribe(data => {
        this.atletas = data
        this.atletasSelecionado = []
      });

      this.formBuscar.get('buscaClube').valueChanges.subscribe(value =>
        this.carteirinhasService
            .getCarteirinhas(
              this.formBuscar.get('busca').value,
              value,
              this.formBuscar.get('buscaEmissaoMes').value,
              this.formBuscar.get('buscaEmissaoAno').value,
              this.formBuscar.get('buscaValidadeMes').value,
              this.formBuscar.get('buscaValidadeAno').value,
              )
            .subscribe(data => {
              this.atletas = data
              this.atletasSelecionado = []
            })
      )

      this.formBuscar.get('buscaEmissaoMes').valueChanges.subscribe(value =>
        this.carteirinhasService
            .getCarteirinhas(
              this.formBuscar.get('busca').value,
              this.formBuscar.get('buscaClube').value,
              value,
              this.formBuscar.get('buscaEmissaoAno').value,
              this.formBuscar.get('buscaValidadeMes').value,
              this.formBuscar.get('buscaValidadeAno').value,
              )
            .subscribe(data => {
              this.atletas = data
              this.atletasSelecionado = []
            })
      )

      this.formBuscar.get('buscaEmissaoAno').valueChanges.subscribe(value =>
        this.carteirinhasService
            .getCarteirinhas(
              this.formBuscar.get('busca').value,
              this.formBuscar.get('buscaClube').value,
              this.formBuscar.get('buscaEmissaoMes').value,
              value,
              this.formBuscar.get('buscaValidadeMes').value,
              this.formBuscar.get('buscaValidadeAno').value,
              )
            .subscribe(data => {
              this.atletas = data
              this.atletasSelecionado = []
            })
      )

      this.formBuscar.get('buscaValidadeMes').valueChanges.subscribe(value =>
        this.carteirinhasService
            .getCarteirinhas(
              this.formBuscar.get('busca').value,
              this.formBuscar.get('buscaClube').value,
              this.formBuscar.get('buscaEmissaoMes').value,
              this.formBuscar.get('buscaEmissaoAno').value,
              value,
              this.formBuscar.get('buscaValidadeAno').value,
              )
            .subscribe(data => {
              this.atletas = data
              this.atletasSelecionado = []
            })
      )

      this.formBuscar.get('buscaValidadeAno').valueChanges.subscribe(value =>
        this.carteirinhasService
            .getCarteirinhas(
              this.formBuscar.get('busca').value,
              this.formBuscar.get('buscaClube').value,
              this.formBuscar.get('buscaEmissaoMes').value,
              this.formBuscar.get('buscaEmissaoAno').value,
              this.formBuscar.get('buscaValidadeMes').value,
              value
              )
            .subscribe(data => {
              this.atletas = data
              this.atletasSelecionado = []
            })
      )

  }

  getClubes() {
    this.clubesService
      .getClubes()
      .subscribe(data => this.clubes = data)
  }
  getCarteirinhas() {
    this.carteirinhasService
      .getCarteirinhas(
        this.formBuscar.get('busca').value,
        this.formBuscar.get('buscaClube').value,
        this.formBuscar.get('buscaEmissaoMes').value,
        this.formBuscar.get('buscaEmissaoAno').value,
        this.formBuscar.get('buscaValidadeMes').value,
        this.formBuscar.get('buscaValidadeAno').value
        )
      .subscribe(data => this.atletas = data)
  }

  checarTodos(event) {
    if(event.checked === true){
      this.atletasSelecionado = this.atletas.map(value => value.id)
      this.cheque.toArray().forEach(value => value.nativeElement.checked = true)
    } else {
      this.atletasSelecionado = []
      this.cheque.toArray().forEach(value => value.nativeElement.checked = false)
    }
  }

  chequeAtleta(event, atleta) {
    if(event.checked === true){
      this.atletasSelecionado.push(atleta.id)
    } else {
      this.atletasSelecionado =  this.atletasSelecionado.filter(value => value !== atleta.id)
    }
  }

  imprimirCarteirinhas() {
    this.atletasSelecionado.length >= 1 ?
      this.carteirinhasService.updateDataEmissao(this.atletasSelecionado, this.data.get('emissao').value, this.data.get('validade').value).subscribe(data => {
        sessionStorage.setItem('ids', JSON.stringify(this.atletasSelecionado))
        this.router.navigate(['/cartao'])
      })
     : this.notificaService.modalMensagem('Selecione um atleta')
  }

  cancelar() {
    this.router.navigate(['/admin'])
  }

}
