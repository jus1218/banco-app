import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UbicationService } from '../../../shared/service/ubication.service';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TelefonoService } from '../../../shared/service/telefono.service';
import { filter, Observable, Subscription, switchMap, tap } from 'rxjs';
import { Canton, Distrito, Provincia, Provincia2 } from '../../../shared/interfaces/provincia.interface';
import { ClientService } from '../../services/client.service';
import { ClienteCreateUpdate } from '../../interface/client.interface';
import { Telefono } from '../../../banks/interfaces/bank.interface';
import { PaginationService } from '../../../shared/service/pagination.service';
import { RouterService } from '../../../shared/service/router.service';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css'
})
export class ClientPageComponent implements OnInit, OnDestroy {
  // Variables visuales y condicionales
  public title: 'Agregar' | 'Editar' | 'Información' = 'Información';
  public isLoading: boolean = false;
  public message: Message | null = null;
  //Formularios
  public clientForm!: FormGroup;
  public newPhone!: FormControl;
  //Arreglos
  public provinciasCantonesyDistritos: Provincia2 | undefined;
  public cantonesByProvincia: Canton[] = [];
  public distritosByCanton: Distrito[] = [];
  get provincias(): Provincia[] {
    return this.ubicationService.getProvincias;
  }
  get telefonos() {
    return this.clientForm.get('telefonos') as FormArray;
  }
  //Suscripciones
  private clientSubscription!: Subscription;
  private provinciaSubscription !: Subscription;
  private cantonSubscription !: Subscription;

  constructor(
    private fb: FormBuilder,
    private ubicationService: UbicationService,
    private validatorsService: ValidatorsService,
    private messageManagerService: MessageManagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private telefonoService: TelefonoService,
    private clientService: ClientService,
    private routerService: RouterService,

  ) {
    this.initValues();
  }

  ngOnInit(): void {
    this.onProvinciaChanged();
    this.onCantonChanged();

    if (this.router.url.includes('register')) {
      this.title = 'Agregar'
      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
    } else {
      this.clientForm.disable();
    }

    this.cargarCliente();
  }
  ngOnDestroy(): void {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
    if (this.provinciaSubscription) {
      this.provinciaSubscription.unsubscribe();

    }
    if (this.cantonSubscription) {
      this.cantonSubscription.unsubscribe();
    }
    this.routerService.ultimaRuta = { modulo: 'clients', seccion: 'view' };
  }
  initValues() {
    this.newPhone = new FormControl<String>('', this.validatorsService.phoneIsValid);
    this.clientForm = this.fb.group({
      codigoCliente: [''],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(20)]],
      segundoApellido: ['', [Validators.required, Validators.maxLength(20)]],
      cedula: ['', this.validatorsService.cedulaIsValid],
      direccionExacta: ['', [Validators.required, Validators.maxLength(255)]],
      codigoDistrito: [0, [Validators.required, , Validators.min(1)]],
      // otros

      codigoProvincia: [0, [Validators.required, Validators.min(1)]],
      codigoCanton: [0, [Validators.required, Validators.min(1)]],
      telefonos: this.fb.array([
      ])
    });

  }
  cargarCliente(): void {
    this.isLoading = true;

    this.activatedRoute.params
      .pipe(
        tap(({ id }) =>

          this.telefonoService.getPhonesByCodeClient(id)
            .subscribe(res => this.onAddPhones(res.value!))
        ),
        switchMap(({ id }) => {
          return this.clientService.getCliente(Number(id));
        }),
      ).subscribe(res => {
        this.clientForm.reset({ ...res.value, telefonos: this.telefonos.value });
        this.asignarDistritoCantonProvincia(res.value!.codigoDistrito);



        this.isLoading = false;
        return;
      });




  }

  asignarDistritoCantonProvincia(codigoDistrito: number): void {
    this.provinciasCantonesyDistritos = this.ubicationService.getProvinciaCantonbyIdDistrito(codigoDistrito);
    if (!this.provinciasCantonesyDistritos) return;
    this.clientForm.get('codigoProvincia')?.setValue(this.provinciasCantonesyDistritos?.codigoProvincia);
    this.cantonesByProvincia = this.ubicationService.getCantones(this.provinciasCantonesyDistritos!.codigoProvincia);
    this.clientForm.get('codigoCanton')?.setValue(this.provinciasCantonesyDistritos?.canton.codigoCanton);
    this.distritosByCanton = this.ubicationService.getDistritos(this.provinciasCantonesyDistritos!.canton.codigoCanton);
    this.clientForm.get('codigoDistrito')?.setValue(this.provinciasCantonesyDistritos?.canton.distrito.codigoDistrito);
  }

  onProvinciaChanged() {
    this.provinciaSubscription = (this.clientForm.get('codigoProvincia')!.valueChanges as Observable<number>)
      .pipe(
        tap(() => this.clientForm.get("codigoCanton")!.setValue(0)),
        tap(() => this.cantonesByProvincia = []),
        filter((value: any) => {
          if (!value) return false;
          return value > 0
        })//evita que se haga llamados si el valor es vacio
      )
      .subscribe(idProvincia => {

        const id = idProvincia as number;

        this.cantonesByProvincia = this.ubicationService.getCantones(id);
      })
  }
  onCantonChanged() {
    this.cantonSubscription = this.clientForm.get('codigoCanton')!.valueChanges
      .pipe(
        tap(() => this.clientForm.get("codigoDistrito")!.setValue(0)),
        tap(() => this.distritosByCanton = []),
        filter(value => {
          if (!value) return false;
          return value.length > 0
        })//evita que se haga llamados si el valor es vacio
      )
      .subscribe(idCanton => {

        console.log("idprovincia: " + !idCanton);
        const id = idCanton as number;
        this.distritosByCanton = this.ubicationService.getDistritos(id)
      })
  }

  // ACCIONES
  onAddPhone(): void {
    if (this.newPhone.invalid) {
      this.newPhone.markAsTouched();
      return;
    }

    const newNumberPhone = this.newPhone.value ?? undefined;

    if (!newNumberPhone) return;

    this.telefonoService.createPhoneBank(
      {
        numero: newNumberPhone,
        codigoBanco: null,
        codigoTelefono: null,
        codigoCliente: this.currentClient.codigoCliente
      }).subscribe(res => {
        this.showMessage(res.message, res.success);
        if (!res.success) return;


        this.telefonos.push(this.fb.control(res.value!.numero, this.validatorsService.phoneIsValid));
        this.newPhone.reset('');
      })

  }

  onDeletePhone(index: number): void {
    const numero = this.telefonos.at(index).value as string;
    this.telefonoService.deletePhone(numero).subscribe(res => {
      this.telefonos.removeAt(index);
      this.showMessage(res.message, res.success);

    })
  }
  onAddPhones(telefonos: Telefono[]): void {

    if (!telefonos) return;
    telefonos.forEach(telefono => {
      this.telefonos.push(new FormControl<String>(telefono.numero, this.validatorsService.phoneIsValid));
    });

  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }
    if (this.title === "Editar") {

      this.clientService.updatCliente(this.currentClient)
        .subscribe(res => this.showMessage(res.message, res.success))
      return;
    }

    this.clientService.createCliente(this.currentClient).subscribe(res => {
      this.showMessage(res.message, res.success);
      if (!res.success) return;


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
  getFormControlError() {
    return this.messageManagerService.getFieldOfControlError(this.newPhone);
  }
  isValidFormControl() {
    return this.validatorsService.isValidFormControl(this.newPhone);
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.clientForm, field);
  }

  getFieldOfGroupError(field: string) {
    return this.messageManagerService.getFieldOfGroupError(field, this.clientForm);;
  }

  //OTROS

  get currentClient(): ClienteCreateUpdate {
    const cliente = this.clientForm

    return {
      ...cliente.value,
      cedula: (Number(cliente.get('cedula')?.value)) ?? 0,
      codigoProvincia: (Number(cliente.get('codigoProvincia')?.value)) ?? 0,
      codigoCanton: (Number(cliente.get('codigoCanton')?.value)) ?? 0,
      distrito: (Number(cliente.get('codigoDistrito')?.value)) ?? 0,

    };
  }
  showMessage(message: string, isSuccess: boolean) {
    this.message = { message, isSuccess };
    setTimeout(() => {
      this.message = null;
    }, 4000);
  }
}



