import { Component, OnInit } from '@angular/core';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UbicationService } from '../../../shared/service/ubication.service';
import { TypeUbication, Ubication } from '../../../province/interface/ubication.interface';

@Component({
  selector: 'app-canton-page',
  templateUrl: './canton-page.component.html',
  styleUrl: './canton-page.component.css'
})
export class CantonPageComponent implements OnInit {


  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  // Formulario
  public cantonForm!: FormGroup;

  constructor(

    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private messageManagerService: MessageManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cantonService: UbicationService,
  ) {

    this.initFormValue();
  }
  ngOnInit(): void {
    this.configureFormByRoute();
  }

  configureFormByRoute(): void {


    if (this.router.url.includes('register')) {
      this.title = 'Agregar';
      this.activatedRoute.params.subscribe(({ codigo }) =>
        this.cantonForm.get('idRelacion')?.setValue(codigo)
      );
      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
      this.cantonForm.get('codigoCanton')?.disable();
    } else {
      this.cantonForm.disable();
    }

    this.loadCanton();
  }


  initFormValue(): void {
    this.cantonForm = this.fb.group({
      codigoCanton: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[0-9]+$/)]],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      idRelacion: [0]
    });

  }


  loadCanton(): void {
    this.isLoading = true;

    this.activatedRoute.params
      .pipe(
        switchMap(({ codigo }) => this.cantonService
          .getUbication({ codigo: Number(codigo), type: TypeUbication.Canton }))
      ).subscribe(({ message, success: isSuccess, value }) => {

        if (!isSuccess) {
          this.messageManagerService.simpleBox({ message, success: isSuccess })
          this.isLoading = false;
          this.router.navigate(['/provinces/list']);
          return;
        }

        this.cantonForm.reset({ ...value, codigoCanton: value!.codigo })
        this.isLoading = false;
      });

  }

  // METODOS DE VALIDACION Y MENSAJES FORMULARIO
  isValidField(field: string) {
    return this.validatorsService.isValidField(this.cantonForm, field);
  }

  getFieldOfGroupError(field: string) {
    return this.messageManagerService.getFieldOfGroupError(field, this.cantonForm);;
  }

  onSubmit(): void {

    if (this.cantonForm.invalid) {
      this.cantonForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    if (this.title === "Editar") {

      this.cantonService.updateUbicationR(this.currentDistrict)
        .subscribe(({ message, success: isSuccess }) => {
          this.messageManagerService.simpleBox({ message, success: isSuccess })
          this.isLoading = false;
        });
      return;
    }

    this.cantonService.createUbication(this.currentDistrict)
      .subscribe(({ message, success: isSuccess }) => {
        this.isLoading = false;
        this.messageManagerService.simpleBox({ message, success: isSuccess })
        if (!isSuccess) return;
        this.cantonForm.reset({
          codigoDistrito: '',
          nombre: '',
          idRelacion: this.currentDistrict.idRelacion
        });
      });

  }


  get currentDistrict(): Ubication {
    const form = this.cantonForm;
    return {
      nombre: form.get('nombre')?.value,
      codigo: Number(form.get('codigoCanton')?.value),
      idRelacion: Number(form.get('idRelacion')?.value),
      type: TypeUbication.Canton
    }
  }

}
