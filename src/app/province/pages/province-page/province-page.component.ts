import { Component, OnInit } from '@angular/core';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicationService } from '../../../shared/service/ubication.service';
import { TypeUbication } from '../../interface/ubication.interface';
import { ProvincieService } from '../../service/provincie.service';
import { of, switchMap } from 'rxjs';
import { Canton, Provincia } from '../../../shared/interfaces/provincia.interface';
import { Distrito } from '../../../banks/interfaces/bank.interface';

@Component({
  selector: 'app-province-page',
  templateUrl: './province-page.component.html',
  styleUrl: './province-page.component.css'
})
export class ProvincePageComponent implements OnInit {
  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  //Arreglos y obj seleccionados
  public cantones: Canton[] = [];
  public distritos: Distrito[] = [];

  public cantonSelected: Canton | undefined = undefined;

  // Formulario
  public provinceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private messageManagerService: MessageManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private provincieService: ProvincieService,
    private ubicationService: UbicationService
  ) {
    this.initFormValue();
  }
  ngOnInit(): void {
    this.configureFormByRoute();


  }
  configureFormByRoute(): void {

    if (this.router.url.includes('register')) {
      this.title = 'Agregar'
      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
      this.provinceForm.get('codigoProvincia')?.disable();
    } else {
      this.provinceForm.disable();
    }

    this.loadProvince();
  }


  initFormValue(): void {

    this.provinceForm = this.fb.group({
      codigoProvincia: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[0-9]+$/)]],
      nombre: ['', [Validators.required, Validators.maxLength(20)]]
    });

  }

  loadProvince(): void {
    this.isLoading = true;
    this.activatedRoute.params.pipe(
      switchMap(({ codigo }) => this.provincieService.getProvincie(Number(codigo)))
    ).subscribe(({ message, success: isSuccess, value }) => {
      if (!isSuccess) {
        this.messageManagerService.simpleBox({ message, success: isSuccess })
        this.isLoading = false;
        this.router.navigate(['/provinces/list']);
        return;
      }

      this.provinceForm.reset({ ...value })
      this.cantones = value!.cantones;

      this.isLoading = false;
    })

  }
  // METODOS DE VALIDACION Y MENSAJES FORMULARIO
  isValidField(field: string) {
    return this.validatorsService.isValidField(this.provinceForm, field);
  }

  getFieldOfGroupError(field: string) {
    return this.messageManagerService.getFieldOfGroupError(field, this.provinceForm);;
  }


  get currentProvince(): { codigoProvincia: number, nombre: string } {

    const form = this.provinceForm;
    return {
      ...form.value,
      codigoProvincia: Number(form.get('codigoProvincia')?.value)
    }
  }

  onSubmit(): void {


    if (this.provinceForm.invalid) {
      this.provinceForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { codigoProvincia: codigo, nombre } = this.currentProvince;

    if (this.title === "Editar") {

      this.provincieService.updateUbication({ codigo, nombre, type: TypeUbication.Provincie, idRelacion: null })
        .subscribe(({ message, success: isSuccess }) => {
          this.messageManagerService.simpleBox({ message, success: isSuccess })
          this.isLoading = false;
        });
      return;
    }

    this.ubicationService.createUbication({ codigo, nombre, type: TypeUbication.Provincie, idRelacion: null })
      .subscribe(({ message, success: isSuccess }) => {
        this.isLoading = false;
        this.messageManagerService.simpleBox({ message, success: isSuccess })
        if (!isSuccess) return;
        this.provinceForm.reset({
          codigoProvincia: '',
          nombre: ''
        });
      });

  }

  onSelectedCanton(codigoCanton: number): void {

    const canton = this.cantones.find(canton => canton.codigoCanton === codigoCanton);
    this.cantonSelected = canton;
    this.distritos = canton!.distritos;
  }



  onDeleteDistrict(codigo: number): void {
    this.delete(codigo, TypeUbication.District);
  }

  onDeleteCanton(codigo: number): void {
    this.delete(codigo, TypeUbication.Canton);
  }


  delete(codigo: number, typeUbication: TypeUbication): void {
    // Caja de confirmacion
    this.messageManagerService.confirmBox({})
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return of();
          if (this.isLoading) return of();
          this.isLoading = true;
          // Solicitud de eliminacion
          return this.ubicationService.deleteUbication({ codigo, type: typeUbication })
        }),
        switchMap(({ message, success: isSuccess }) => {
          // Muestra mensaje después de eliminar
          this.messageManagerService.simpleBox({ message, success: isSuccess });
          // Obtener los datos actualizados de la provincia
          return this.provincieService.getProvincie(Number(this.currentProvince.codigoProvincia));
        }),

      ).
      subscribe(({ message, success: isSuccess, value }) => {
        if (!isSuccess) {
          this.messageManagerService.simpleBox({ message, success: isSuccess });
          this.isLoading = false;
          this.router.navigate(['/provinces/list']);
          return;
        }

        // Actualizar el formulario y las listas relacionadas
        this.provinceForm.reset({ ...value });
        this.cantones = value!.cantones;
        this.distritos = [];
        this.isLoading = false;
        return;
      });
  }

}
