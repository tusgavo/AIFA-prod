import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { from } from "rxjs";
import {
  switchMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
} from "rxjs/operators";

import { EquipesService } from "../../../core/services/equipes.service";
import { ClubesService } from "../../../core/services/clubes.service";
import { NotificaService } from "../../../shared/modal/notifica.service";
import { FormsService } from "../../../core/util/forms.service";

@Component({
  selector: "app-equipes-admin",
  templateUrl: "./equipes-admin.component.html",
  styleUrls: ["./equipes-admin.component.css"],
})
export class EquipesAdminComponent implements OnInit {

  constructor(
    private equipesService: EquipesService,
    private clubesService: ClubesService,
    private notificaService: NotificaService,
    private formsService: FormsService
  ) {}

  @ViewChild("modalEquipe", { static: true }) modalEquipe: ElementRef;
  @ViewChild("foto", { static: true }) fotoaa: ElementRef;

  formEquipe: FormGroup;
  formBuscar: FormGroup;

  mask;

  id_equipe;
  equipes;
  clubes;
  foto = undefined;
  editar = "";

  ngOnInit() {
    this.mask = this.formsService.mask
    this.formBuscar = new FormGroup({
      busca: new FormControl(""),
    });
    this.formEquipe = this.formsService.getFormEquipe();
    this.getEquipes();
    this.getClubes();

    this.formBuscar.controls.busca.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((q) =>
          this.equipesService
            .getEquipes(q)
            .pipe(catchError((error) => from([])))
        )
      )
      .subscribe(data => this.equipes = data);
  }

  getEquipes() {
    this.equipesService
      .getEquipes(this.formBuscar.get("busca").value)
      .subscribe(data => this.equipes = data);
  }
  getClubes() {
    this.clubesService.getClubes().subscribe(data => this.clubes = data);
  }

  deletarEquipe(id) {
    let r = confirm("Deseja excluir esta equipe?");
    if (r == true) {
      this.equipesService.deletar(id).subscribe(
        (data) => {
          this.getEquipes();
          this.notificaService.modalMensagem("Equipe excluída com sucesso!");
        },
        (error) =>
          this.notificaService.modalMensagem("Exclusão não autorizada, pois a equipe está cadastrada em bases do sistema")
      );
    }
  }

  onFoto(event) {
    this.foto = event.target.files[0];
    this.fotoaa.nativeElement.src = ''
    this.fotoaa.nativeElement.src = URL.createObjectURL(event.target.files[0]);
  }

  cadastrar_update_equipe(id?) {
    if (id) {
      this.editar = "Editar";
      this.equipesService.getEquipe(id).subscribe((value) => {
        this.id_equipe = id;
        console.log(value)
        this.fotoaa.nativeElement.src = value['url_logotipo']
        delete this.foto;
        this.formsService.setFormEquipe(this.formEquipe, value);
        this.modalEquipe.nativeElement.style.display = "block";
      });
    } else {
      this.editar = "Cadastrar";
      this.fotoaa.nativeElement.src = ''
      delete this.id_equipe;
      delete this.foto;
      this.formEquipe.reset();
      this.modalEquipe.nativeElement.style.display = "block";
    }
  }

  salvarEquipe() {
    if (this.formEquipe.valid) {
      if (this.id_equipe) {
        this.equipesService
          .update(this.id_equipe, this.formEquipe.value, this.foto)
          .subscribe((data) => {
            delete this.id_equipe;
            delete this.foto;
            this.formEquipe.reset();
            this.modalEquipe.nativeElement.style.display = "none";
            this.getEquipes();
            this.notificaService.modalMensagem("Equipe alterada com sucesso!");
          });
      } else if (this.id_equipe === undefined && this.foto !== undefined) {
        this.equipesService
          .cadastrar(this.formEquipe.value, this.foto)
          .subscribe((data) => {
            delete this.id_equipe;
            delete this.foto;
            this.formEquipe.reset();
            this.modalEquipe.nativeElement.style.display = "none";
            this.getEquipes();
            this.notificaService.modalMensagem(
              "Equipe cadastrada com sucesso!"
            );
          });
      }
    } else Object.keys(this.formEquipe.controls).forEach(campo => this.formEquipe.get(campo).markAsTouched())
  }

  cancelar() {
    delete this.id_equipe;
    delete this.foto;
    this.modalEquipe.nativeElement.style.display = "none";
  }

}
