import { Component, OnInit } from '@angular/core';
import { CarteirinhasService } from "../../../core/services/carteirinhas.service";

@Component({
  selector: 'app-imprimircartao',
  templateUrl: './imprimircartao.component.html',
  styleUrls: ['./imprimircartao.component.css']
})
export class ImprimircartaoComponent implements OnInit {

  cartoes

  constructor(
    private carteirinhasService: CarteirinhasService,
  ) { }

  ngOnInit(): void {
    this.carteirinhasService.getCartoes(JSON.parse(sessionStorage.getItem('ids'))).subscribe(value => {
      this.cartoes = value
      setTimeout(() => window.print(), 1000);
    })
  }

}
