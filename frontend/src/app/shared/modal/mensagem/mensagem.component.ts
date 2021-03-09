import { Component, OnInit } from '@angular/core'
import { trigger, state, style, transition, animate } from "@angular/animations";
import { NotificaService } from "../notifica.service";

import { timer } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.component.html',
  styleUrls: ['./mensagem.component.css'],
  animations: [
    trigger("snack-visibility", [
      state(
        "hidden",
        style({
          opacity: 0,
          visibility: 'hidden'
        })
      ),
      state(
        "visible",
        style({
          opacity: 1,
          visibility: 'visible'
        })
      ),
      transition("hidden => visible", animate("500ms 0s ease-in")),
      transition("visible => hidden", animate("500ms 0s ease-out")),
    ]),
  ]
})
export class MensagemComponent implements OnInit {

  mensagem: string

  snackVisibility: string = "hidden";

  constructor(private notificaService: NotificaService) { }

  ngOnInit() {
    this.notificaService.notificar.pipe(
      tap(mensagem => {
        this.mensagem = mensagem;
        this.snackVisibility = 'visible'
      }),
    switchMap(message => timer(2000))
    ).subscribe(timer => this.snackVisibility = 'hidden')
  }

}
