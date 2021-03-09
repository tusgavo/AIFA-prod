import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificaService {

  notificar = new EventEmitter<string>()

  constructor() { }

  modalMensagem(mensagem: string) {
    this.notificar.emit(mensagem)
  }

}
