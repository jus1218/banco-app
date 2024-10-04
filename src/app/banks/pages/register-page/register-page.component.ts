import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Canton, Provincia, Provincia2 } from '../../../shared/interfaces/provincia.interface';
import { concatMap, filter, mergeMap, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { Bank, BankCreateUpdate, Distrito, Moneda, Telefono } from '../../interfaces/bank.interface';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BanksService } from '../../services/banks.service';
import { TelefonoService } from '../../../shared/service/telefono.service';
import { UbicationService } from '../../../shared/service/ubication.service';
import { ResponseError } from '../../../shared/interfaces/response-error.interface';
import { CommonResponseV } from '../../../shared/interfaces/common-response.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { RouterService } from '../../../shared/service/router.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent implements OnInit, OnDestroy {


  public title: 'Agregar' | 'Editar' | 'Ver' = 'Agregar';
  public bankForm!: FormGroup;
  private provinciaSubscription!: Subscription;
  private cantonSubscription!: Subscription;
  public cantonesByProvincia: Canton[] = [];
  public distritosByCanton: Distrito[] = [];
  public monedas: Moneda[] = [];
  public isLoading: boolean = false;
  public message: Message | null = null;

  public provinciasCantonesyDistritos: Provincia2 | undefined;

  public newPhone!: FormControl;

  constructor(
    private fb: FormBuilder,
    private ubicationService: UbicationService,
    private validatorsService: ValidatorsService,
    private messageManagerService: MessageManagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private banksService: BanksService,
    private telefonoService: TelefonoService,
    private routerService: RouterService
  ) {
    this.initValues();


  }

  initValues() {

    this.newPhone = new FormControl<String>('', this.validatorsService.phoneIsValid);

    this.bankForm = this.fb.group({
      codigoBanco: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(1)],],
      codigoMoneda: ['', [Validators.required, Validators.min(1)],],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      direccionExacta: ['', [Validators.required, Validators.maxLength(254)]],
      codigoProvincia: [0, [Validators.required, Validators.min(1)]],
      canton: [0, [Validators.required, Validators.min(1)]],
      codigoDistrito: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      telefonos: this.fb.array([])
    })

    this.banksService.getMonedas().subscribe(res => {
      if (!res.success) {
        this.showMessage('Recargue la pagina nuevamente', res.success);
        this.router.navigate(['/banks/list']);
        return
      }
      this.monedas = res.value!
    })
  }


  ngOnInit(): void {
    this.onProvinciaChanged();
    this.onCantonChanged();
    if (this.router.url.includes('list')) return;
    if (this.router.url.includes('register')) return;

    this.isLoading = true;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.banksService.getBanco(id)),//obtenemos el banco
        filter(banco => !!banco),//validamos que no sea nulo o undefined
        tap(banco => {
          // desabilitamos y setteamos los campos del formulario
          if (!this.router.url.includes('edit')) {
            this.title = 'Ver';
            this.bankForm.disable();
          } else {

            this.bankForm.get('codigoBanco')?.disable();
            this.title = 'Editar';
          }
          this.bankForm.reset(banco);

          this.provinciasCantonesyDistritos = this.ubicationService.getProvinciaCantonbyIdDistrito(banco.codigoDistrito);
          if (!this.provinciasCantonesyDistritos) return;
          this.bankForm.get('codigoProvincia')?.setValue(this.provinciasCantonesyDistritos?.codigoProvincia);
          this.cantonesByProvincia = this.ubicationService.getCantones(this.provinciasCantonesyDistritos!.codigoProvincia);
          this.bankForm.get('canton')?.setValue(this.provinciasCantonesyDistritos?.canton.codigoCanton);
          this.distritosByCanton = this.ubicationService.getDistritos(this.provinciasCantonesyDistritos!.canton.codigoCanton);
          this.bankForm.get('codigoDistrito')?.setValue(this.provinciasCantonesyDistritos?.canton.distrito.codigoDistrito);
        }),

      ).subscribe(banco => {

        this.banksService.getPhonesByCodeBank(banco.codigoBanco)
          .subscribe(res => this.onAddPhones(res.value!));

        this.isLoading = false;
      });

  }

  ngOnDestroy(): void {
    if (this.provinciaSubscription) {
      this.provinciaSubscription.unsubscribe();
    }
    if (this.cantonSubscription) {
      this.cantonSubscription.unsubscribe();
    }

    this.routerService.ultimaRuta = { modulo: "banks", seccion: 'view' };
  }

  get provincias(): Provincia[] {
    return this.ubicationService.getProvincias;
  }

  onProvinciaChanged() {
    this.provinciaSubscription = this.bankForm.get('codigoProvincia')!.valueChanges
      .pipe(
        tap(() => this.bankForm.get("canton")!.setValue(0)),
        tap(() => this.cantonesByProvincia = []),
        filter(value => {
          if (!value) return false;
          return value.length > 0
        })//evita que se haga llamados si el valor es vacio
      )
      .subscribe(idProvincia => {

        const id = idProvincia as number;

        this.cantonesByProvincia = this.ubicationService.getCantones(id);
      })
  }
  onCantonChanged() {
    this.cantonSubscription = this.bankForm.get('canton')!.valueChanges
      .pipe(
        tap(() => this.bankForm.get("codigoDistrito")!.setValue(0)),
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
  isValidField(field: string) {
    return this.validatorsService.isValidField(this.bankForm, field);
  }
  isValidFormControl() {
    return this.validatorsService.isValidFormControl(this.newPhone);
  }

  getFieldOfGroupError(field: string) {
    const message = this.messageManagerService.getFieldOfGroupError(field, this.bankForm);
    return message;
  }
  getFormControlError() {
    const message = this.messageManagerService.getFieldOfControlError(this.newPhone);
    return message;
  }



  isValidFieldInArray(formArray: FormArray, index: number) {
    return this.validatorsService.isValidFieldInArray(formArray, index);
  }


  get currentBank(): BankCreateUpdate {
    const banco = this.bankForm.value as BankCreateUpdate;
    return banco;
  }
  get telefonos() {
    return this.bankForm.get('telefonos') as FormArray;
  }

  onSubmit(): void {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }

    console.log(this.currentBank);

    if (this.title === "Editar") {

      this.banksService.updateBanco(
        {
          ...this.currentBank,
          codigoDistrito: Number(this.currentBank.codigoDistrito),
          codigoBanco: this.bankForm.get('codigoBanco')!.value as string
        }
      ).subscribe(res => this.showMessage(res.message, res.success))
      return;
    }

    this.banksService.createBanco(this.currentBank).subscribe(res => {
      this.showMessage(res.message, res.success);
      if (!res.success) return;

      this.bankForm.reset({});
    });
  }

  onDeletePhone(index: number): void {
    const numero = this.telefonos.at(index).value as string;
    this.telefonoService.deletePhone(numero).subscribe(res => {
      this.telefonos.removeAt(index);
      this.showMessage(res.message, res.success);

    })
  }
  onEditPhone(index: number): void {
    const numero = this.telefonos.at(index).value as string;
    this.telefonoService.editPhone(
      {
        numero,
        codigoBanco: this.bankForm.get('codigoBanco')!.value as String,
        codigoCliente: null
      }).subscribe((res: CommonResponseV<String> | ResponseError) => {



      })
  }


  onAddPhones(telefonos: Telefono[]): void {

    if (!telefonos) return;
    telefonos.forEach(telefono => {
      this.telefonos.push(new FormControl<String>(telefono.numero, this.validatorsService.phoneIsValid));
    });

  }

  onAddPhone(): void {
    if (this.newPhone.invalid) return;

    const newNumberPhone = this.newPhone.value;

    this.telefonoService.createPhoneBank(
      {
        numero: newNumberPhone,
        codigoBanco: this.bankForm.get('codigoBanco')!.value as string,
        codigoTelefono: null,
        codigoCliente: null
      }).subscribe(res => {
        this.showMessage(res.message, res.success);
        if (!res.success) return;


        this.telefonos.push(this.fb.control(res.value!.numero, this.validatorsService.phoneIsValid));
        this.newPhone.reset('');
      })
  }

  showMessage(message: string, isSuccess: boolean) {
    this.message = { message, isSuccess };
    setTimeout(() => {
      this.message = null;
    }, 4000);
  }
  isTouched(index: number): boolean {
    return this.validatorsService.istouchedFieldInArray(this.telefonos, index);
  }


  isEdit() {
    return this.title === 'Editar';
  }

}
