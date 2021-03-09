import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  <app-mensagem></app-mensagem>
  `
})
export class AppComponent {
}
