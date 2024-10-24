import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UbicationService } from '../../../shared/service/ubication.service';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TelefonoService } from '../../../shared/service/telefono.service';
import { filter, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { Canton, Distrito, Provincia, Provincia2 } from '../../../shared/interfaces/provincia.interface';
import { ClientService } from '../../services/client.service';
import { ClienteCreateUpdate } from '../../interface/client.interface';
import { Telefono } from '../../../banks/interfaces/bank.interface';
import { PaginationService } from '../../../shared/service/pagination.service';
import { RouterService } from '../../../shared/service/router.service';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { SelectorService } from '../../../shared/service/selector.service';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css'
})
export class ClientPageComponent implements OnInit {


  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  //Arreglos y obj seleccionados
  public provincias: Provincia[] = [];
  public cantones: Canton[] = [];
  public distritos: Distrito[] = [];
  //Formularios
  public clientForm!: FormGroup;
  //Otros
  public provinciaSelected?: Provincia;
  public cantonSelected?: Canton;


  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private sms: MessageManagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private routerService: RouterService,
    private selectorService: SelectorService,

  ) {
    this.initFormValues();
  }

  ngOnInit(): void {
    this.configureFormByRoute();
    this.onProvinciaChanged();
    this.onCantonChanged();

  }
  configureFormByRoute(): void {
    if (this.router.url.includes('register')) {
      this.title = 'Agregar'
      this.loadDataSelector();

      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
      this.clientForm.get('codigoCliente')?.disable();
    } else {
      this.clientForm.disable();
    }
    this.loadClient();
  }

  initFormValues() {
    this.clientForm = this.fb.group({
      codigoCliente: [''],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(20)]],
      segundoApellido: ['', [Validators.required, Validators.maxLength(20)]],
      cedula: ['', this.validatorsService.cedulaIsValid],
      codigoDistrito: [0, [Validators.required, , Validators.min(1)]],
      direccionExacta: ['', [Validators.required, Validators.maxLength(255)]],
      // otros
      codigoProvincia: [0, [Validators.required, Validators.min(1)]],
      codigoCanton: [0, [Validators.required, Validators.min(1)]],

    });

  }
  loadClient(): void {
    this.isLoading = true;


    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.clientService.getCliente(Number(id))),
        switchMap(({ message, success: isSuccess, value: client }) => {

          if (!isSuccess) {
            this.sms.simpleBox({ message, success: isSuccess });
            this.isLoading = false;
            this.router.navigate(['/clients/list']);
            return of();
          }
          this.clientForm.reset({ ...client, codigoDistrito: client?.codigoDistrito });
          this.clientForm.get("codigoDistrito")?.setValue(client?.codigoDistrito);
          return this.selectorService.getAll();
        })
      )
      .subscribe(({ message, success: isSuccess, value: selectors }) => {
        this.isLoading = false;
        if (!isSuccess) {
          this.sms.simpleBox({ message, success: isSuccess });
          this.router.navigate(['/clients/list']);
          return;
        }

        this.provincias = selectors!.provincias;

        const provincia = this.provincias.find(p => p.cantones.find(c => c.distritos.find(d => d.codigoDistrito === this.currentClient.distrito)));
        const canton = provincia?.cantones.find(c => c.distritos.find(d => d.codigoDistrito === this.currentClient.distrito));

        this.clientForm.get('codigoProvincia')?.setValue(provincia?.codigoProvincia);
        this.findCantons(provincia!.codigoProvincia);
        this.clientForm.get('codigoCanton')?.setValue(canton?.codigoCanton);
        this.findDistricts(canton!.codigoCanton);
        // this.clientForm.get('codigoDistrito')?.setValue(value?.codigoDistrito);
      });

  }
  loadDataSelector(): void {

    this.selectorService.getAll().subscribe(({ message, success: isSuccess, value }) => {

      if (!isSuccess) {
        this.sms.simpleBox({ message, success: isSuccess })
        this.isLoading = false;
        this.router.navigate(['/clients/list']);
      }

      this.provincias = value?.provincias!;

    });

  }



  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }
    if (this.title === "Editar") {

      this.clientService.updatCliente(this.currentClient)
        .subscribe(({ message, success: isSuccess }) => this.sms.simpleBox({ message, success: isSuccess }))
      return;
    }

    this.clientService.createCliente(this.currentClient).subscribe(({ message, success: isSuccess }) => {
      this.sms.simpleBox({ message, success: isSuccess })
      if (!isSuccess) return;

      this.clientForm.reset({
        nombre: "",
        primerApellido: "",
        segundoApellido: "",
        cedula: "",
        direccionExacta: "",
        codigoDistrito: 0,
        codigoProvincia: 0,
        codigoCanton: 0,
      });
    });
  }

  // VALIDACIONES Y MUESTRA DE MENSAJES



  isValidField(field: string) {
    return this.validatorsService.isValidField(this.clientForm, field);
  }
  getFieldOfGroupError(field: string) {
    const message = this.sms.getFieldOfGroupError(field, this.clientForm);
    return message;
  }
  onProvinciaChanged() {
    this.clientForm.get('codigoProvincia')!.valueChanges
      .pipe(
        filter(value => {
          if (!value) return false;
          return value.length > 0
        }),//evita que se haga llamados si el valor es vacio
        tap(() => this.clientForm.get("codigoCanton")!.setValue(0)),
        tap(() => this.clientForm.get("codigoDistrito")!.setValue(0)),
        tap(() => this.cantones = []),
        tap(() => this.distritos = []),
      )
      .subscribe(idProvincia => this.findCantons(idProvincia));
  }
  findCantons(idProvincia: number): void {
    const cantones = this.provincias.find(p => p.codigoProvincia === Number(idProvincia))?.cantones;
    if (!cantones) {
      this.cantones = [];
      return;
    }
    this.cantones = cantones;

  }

  onCantonChanged() {
    this.clientForm.get('codigoCanton')!.valueChanges
      .pipe(
        filter(value => {
          if (!value) return false;
          return value.length > 0
        }),//evita que se haga llamados si el valor es vacio
        tap(() => this.clientForm.get('codigoDistrito')!.setValue(0)),
        tap(() => this.distritos = []),
      )
      .subscribe(idCanton => this.findDistricts(idCanton));
  }
  findDistricts(idCanton: number): void {
    const distritos = this.cantones.find(c => c.codigoCanton === Number(idCanton))?.distritos;
    if (!distritos) {
      this.distritos = [];
      return;
    }
    this.distritos = distritos;

  }

  //OTROS

  get currentClient(): ClienteCreateUpdate {
    const form = this.clientForm

    return {
      codigoCliente: form.get('codigoCliente')?.value,
      nombre: form.get('nombre')?.value,
      primerApellido: form.get('primerApellido')?.value,
      segundoApellido: form.get('segundoApellido')?.value,
      cedula: (Number(form.get('cedula')?.value)) ?? 0,
      distrito: (Number(form.get('codigoDistrito')?.value)) ?? 0,
      direccionExacta: form.get('direccionExacta')?.value,


    };
  }

}



