import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { from } from "rxjs";
import {
  switchMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
} from "rxjs/operators";
import { AtletasService } from "../../../core/services/atletas.service";
import { CategoriaService } from "../../../core/services/categoria.service";
import { ClubesService } from "../../../core/services/clubes.service";
import { NotificaService } from "../../../shared/modal/notifica.service";
import cidades from '../../../../assets/javascript/cidades'
import estados from '../../../../assets/javascript/estados'
import { FormsService } from "../../../core/util/forms.service";

@Component({
  selector: "app-atletas-admin",
  templateUrl: "./atletas-admin.component.html",
  styleUrls: ["./atletas-admin.component.css"],
})
export class AtletasAdminComponent implements OnInit {
  @ViewChild("modal", { static: true }) modal: ElementRef;
  @ViewChild("camera", { static: true }) modalFoto: ElementRef;

  @ViewChild("foto", { static: true }) mostraImg: ElementRef;
  @ViewChild("video", { static: true }) video: ElementRef;

  @ViewChild("myCanvas", { static: true }) canvas: ElementRef;

  formBuscar: FormGroup;
  form: FormGroup;

  foto = undefined;
  tituloModal: string;

  cidades = cidades;
  estados = estados;
  listaCidades;

  atletas;
  clubes;
  catigorias;

  mask;
  id: number;
  ctx;

  constructor(
    private atletasService: AtletasService,
    private categoriaService: CategoriaService,
    private notificaService: NotificaService,
    private clubesService: ClubesService,
    private formsService: FormsService
  ) {}

  ngOnInit() {
    if( !navigator.mediaDevices.getUserMedia ) navigator.mediaDevices.getUserMedia = (<Navigator>navigator).mediaDevices.getUserMedia;
    if ((<Navigator>navigator).mediaDevices.getUserMedia) (<Navigator>navigator).mediaDevices
        .getUserMedia({ video: { aspectRatio: 3 / 4 }, audio: false })
        .then(
          (stream) => (this.video.nativeElement.srcObject = stream),
          ({ name }) => console.log(name));
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.mask = this.formsService.mask;
    this.form = this.formsService.getFormAtleta();
    this.formBuscar = new FormGroup({
      busca: new FormControl(""),
    });
    this.getDados();
    this.checkCampos();
  }

  checkCampos() {
    this.formBuscar
      .get("busca")
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((q) =>
          this.atletasService
            .getAtletas(q)
            .pipe(catchError((error) => from([])))
        )
      )
      .subscribe((data) => (this.atletas = data));

    this.form.get("data_nasc").valueChanges.subscribe((value) => {
      if (value !== null) {
        if (this.calculaIdade(value) < 18) {
          this.form
            .get("nome_responsavel")
            .setValidators([Validators.required, Validators.minLength(3)]);
          this.form
            .get("cpf_responsavel")
            .setValidators([
              Validators.required,
              Validators.pattern(this.formsService.cpfPatter),
            ]);
          this.form
            .get("celular_responsavel")
            .setValidators([
              Validators.required,
              Validators.pattern(this.formsService.celularPatter),
            ]);
          this.updateValueAndValidity();
        } else {
          this.form.get("nome_responsavel").clearValidators();
          this.form.get("cpf_responsavel").clearValidators();
          this.form.get("celular_responsavel").clearValidators();

          this.updateValueAndValidity();
        }
      }
    });
    this.form
      .get("estado")
      .valueChanges.subscribe(
        (value) =>
          (this.listaCidades = this.cidades.filter(
            ({ estado }) => estado === value
          ))
      );
  }

  formReset() {
    delete this.id;
    delete this.foto;
    this.form.reset();
    this.formsService.setFormAtleta(this.form);
    this.modal.nativeElement.style.display = "none";
    this.getAtletas();
  }

  getDados() {
    this.getAtletas();
    this.getCategorias();
    this.getClubes();
  }

  updateValueAndValidity() {
    this.form.get("cpf_responsavel").updateValueAndValidity();
    this.form.get("celular_responsavel").updateValueAndValidity();
    this.form.get("nome_responsavel").updateValueAndValidity();
  }

  getAtletas() {
    this.atletasService
      .getAtletas(this.formBuscar.get("busca").value)
      .subscribe((data) => (this.atletas = data));
  }
  getCategorias() {
    this.categoriaService
      .getCategorias()
      .subscribe((data) => (this.catigorias = data));
  }
  getClubes() {
    this.clubesService.getClubes().subscribe((data) => (this.clubes = data));
  }

  cadastrar_update(id?) {
    if (id)
      this.atletasService.getAtleta(id).subscribe((value) => {
        this.tituloModal = "Editar";
        this.id = id;
        this.mostraImg.nativeElement.src = value["foto"];
        delete this.foto;
        this.formsService.setFormAtleta(this.form, value);
        this.modal.nativeElement.style.display = "block";
      });
    this.tituloModal = "Cadastrar";
    this.mostraImg.nativeElement.src = "";
    delete this.id;
    delete this.foto;
    this.form.reset();
    this.formsService.setFormAtleta(this.form);
    this.modal.nativeElement.style.display = "block";
  }

  onFoto(event) {
    this.foto = event.target.files[0];
    this.mostraImg.nativeElement.src = "";
    this.mostraImg.nativeElement.src = URL.createObjectURL(
      event.target.files[0]
    );
  }

  salvar() {
    if (this.form.valid) {
      if (this.id)
        this.atletasService
          .update(this.id, this.form.value, this.foto)
          .subscribe((data) => {
            this.formReset();
            this.notificaService.modalMensagem("Atleta alterado com sucesso!");
          });
      else if (this.id === undefined && this.foto !== undefined)
        this.atletasService
          .cadastrar(this.form.value, this.foto)
          .subscribe((data) => {
            this.formReset();
            this.notificaService.modalMensagem(
              "Atleta cadastrado com sucesso!"
            );
          });
    }
    Object.keys(this.form.controls).forEach((campo) =>
      this.form.get(campo).markAsTouched()
    );
  }

  deletar(id) {
    let r = confirm("Deseja excluir esta atleta?");
    if (r == true)
      this.atletasService.deletar(id).subscribe(
        (data) => {
          this.getAtletas();
          this.notificaService.modalMensagem("Atleta excluído com sucesso!");
        },
        (error) =>
          this.notificaService.modalMensagem(
            "Exclusão não autorizada, pois a Atleta está cadastrada em bases do Sistema"
          )
      );
  }

  mostraModal() {
    this.modalFoto.nativeElement.style.display = "flex";
  }
  cancelarModal() {
    delete this.id;
    delete this.foto;
    this.modal.nativeElement.style.display = "none";
  }

  tirarFoto() {
    const _video = this.video.nativeElement;

    this.canvas.nativeElement.width = _video.clientWidth;
    this.canvas.nativeElement.height = _video.clientHeight;
    this.ctx.drawImage(_video, 0, 0);

    var block = this.canvas.nativeElement.toDataURL().split(";");
    var contentType = block[0].split(":")[1];
    var realData = block[1].split(",")[1];

    this.foto = this.b64toBlob(realData, contentType);

    this.mostraImg.nativeElement.src = "";
    this.mostraImg.nativeElement.src = URL.createObjectURL(this.foto);
    this.modalFoto.nativeElement.style.display = "none";
  }

  cancelarFoto() {
    this.modalFoto.nativeElement.style.display = "none";
  }

  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++)
        byteNumbers[i] = slice.charCodeAt(i);

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let file = new File(byteArrays, "atleta.jpg", { type: contentType });
    return file;
  }

  calculaIdade(dataNasc) {
    var dataAtual = new Date();
    var anoAtual = dataAtual.getFullYear();
    var anoNascParts = dataNasc.split("-");
    var diaNasc = anoNascParts[2];
    var mesNasc = anoNascParts[1];
    var anoNasc = anoNascParts[0];
    var idade = anoAtual - anoNasc;
    var mesAtual = dataAtual.getMonth() + 1;
    if (mesAtual < mesNasc) {
      idade--;
    } else {
      if (mesAtual == mesNasc) {
        if (new Date().getDate() < diaNasc) {
          idade--;
        }
      }
    }
    return idade;
  }

}
