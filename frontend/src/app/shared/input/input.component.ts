import {
  Component,
  OnInit,
  Input,
  ContentChild,
  AfterContentInit,
} from '@angular/core';
import { FormControlName } from '@angular/forms';

@Component({
  selector: 'app-input',
  template: `
    <div class="label-float" [class.invalid]="hasError()">
      <div>
        <ng-content></ng-content>
      </div>
      <label>{{ label }}</label>
      <span *ngIf="hasError()">{{ errorMensagem }}</span>
    </div>
  `,
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit, AfterContentInit {
  @Input() label: string;
  @Input() errorMensagem: string;
  @ContentChild(FormControlName, { static: true }) control: FormControlName;

  input: any;

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.input = this.control;
    if (this.input === undefined) {
      throw new Error(
        'Esse componente precisa ser usado com uma diretiva formGroup'
      );
    }
  }

  hasError() {
    return !this.input.valid && (this.input.dirty || this.input.touched);
  }
}
