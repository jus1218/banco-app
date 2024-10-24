import { Component, OnInit } from '@angular/core';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { edit, REGISTER } from '../../../shared/constants/constants';
import { switchMap } from 'rxjs';
import { UbicationService } from '../../../shared/service/ubication.service';
import { TypeUbication, Ubication } from '../../../province/interface/ubication.interface';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ValidatorsService } from '../../../shared/service/validator.service';

@Component({
  selector: 'app-district-page',
  templateUrl: './district-page.component.html',
  styleUrl: './district-page.component.css'
})
export class DistrictPageComponent implements OnInit {

  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  // Formulario
  public districtForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private districtService: UbicationService,
    private messageManagerService: MessageManagerService,
    private validatorsService: ValidatorsService,
  ) {
    this.initFormValue();
  }

  ngOnInit(): void {
    this.configureFormByRoute();
  }
  configureFormByRoute(): void {

    if (this.router.url.includes(REGISTER)) {

      this.activatedRoute.params.subscribe(({ codigo }) => {

        this.districtForm.get('idRelacion')?.setValue(codigo)

      });
      this.title = 'Agregar'
      return;
    }
    if (this.router.url.includes(edit)) {
      this.title = 'Editar'
      this.districtForm.get('codigoDistrito')?.disable();
    } else {
      this.districtForm.disable();
    }
    this.loadDistricts();
  }

  loadDistricts(): void {
    this.isLoading = true;
    this.activatedRoute.params
      .pipe(
        switchMap(({ codigo }) => this.districtService
          .getUbication({ codigo: Number(codigo), type: TypeUbication.District }))
      ).subscribe(({ message, success: isSuccess, value }) => {
        console.log(value);

        if (!isSuccess) {
          this.messageManagerService.simpleBox({ message, success: isSuccess })
          this.isLoading = false;
          this.router.navigate(['/provinces/list']);
          return;
        }

        this.districtForm.reset({ ...value, codigoDistrito: value!.codigo })
        this.isLoading = false;
      });

  }

  initFormValue(): void {

    this.districtForm = this.fb.group({
      codigoDistrito: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[0-9]+$/)]],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      idRelacion: [0]
    });

  }

  // METODOS DE VALIDACION Y MENSAJES FORMULARIO
  isValidField(field: string) {
    return this.validatorsService.isValidField(this.districtForm, field);
  }

  getFieldOfGroupError(field: string) {
    return this.messageManagerService.getFieldOfGroupError(field, this.districtForm);;
  }

  get currentDistrict(): Ubication {
    const form = this.districtForm;
    return {
      nombre: form.get('nombre')?.value,
      codigo: Number(form.get('codigoDistrito')?.value),
      idRelacion: Number(form.get('idRelacion')?.value),
      type: TypeUbication.District
    }
  }

  onSubmit(): void {


    if (this.districtForm.invalid) {
      this.districtForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    if (this.title === "Editar") {

      this.districtService.updateUbicationR(this.currentDistrict)
        .subscribe(({ message, success: isSuccess }) => {
          this.messageManagerService.simpleBox({ message, success: isSuccess })
          this.isLoading = false;
        });
      return;
    }

    this.districtService.createUbication(this.currentDistrict)
      .subscribe(({ message, success: isSuccess }) => {
        this.isLoading = false;
        this.messageManagerService.simpleBox({ message, success: isSuccess })
        if (!isSuccess) return;
        this.districtForm.reset({
          codigoDistrito: '',
          nombre: '',
          idRelacion: this.currentDistrict.idRelacion
        });
      });

  }



}
