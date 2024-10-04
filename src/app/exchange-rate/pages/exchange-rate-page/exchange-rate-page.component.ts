import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { Bank } from '../../../banks/interfaces/bank.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { BanksService } from '../../../banks/services/banks.service';
import { CurrencyService } from '../../../currencies/service/currency.service';
import { Currency } from '../../../currencies/interface/currency.interface';
import { switchMap, tap } from 'rxjs';
import { ExchangeRate } from '../../interfaces/exchange-rate.interface';
import { HelperService } from '../../../shared/service/helper.service';
import { ExchangeRateService } from '../../service/exchange-rate.service';

@Component({
  selector: 'app-exchange-rate-page',
  templateUrl: './exchange-rate-page.component.html',
  styleUrl: './exchange-rate-page.component.css'
})
export class ExchangeRatePageComponent implements OnInit, OnDestroy {

  // Variables visuales y condicionales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public message: Message | null = null;
  //Arreglos
  public banks: Bank[] = []
  public currencies: Currency[] = [];

  //Formularios
  public exchangeRateForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private activatedRoute: ActivatedRoute,
    private messageManagerService: MessageManagerService,
    private banksService: BanksService,
    private currencyService: CurrencyService,
    private router: Router,
    private helperService: HelperService,
    private exchangeRateService: ExchangeRateService
  ) {
    this.initValues();

  }
  initValues(): void {
    this.exchangeRateForm = this.fb.group({
      codigoMoneda: ['', [Validators.required, Validators.maxLength(3)]],
      codigoBanco: ['', [Validators.required, Validators.maxLength(3)]],
      fecha: ['', [Validators.required]],
      tipoCambioCompra: ['', this.validatorsService.mountIsValid],
      tipoCambioVenta: ['', this.validatorsService.mountIsValid],
    });
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.isLoading = true;
    if (this.router.url.includes('register')) {
      this.cargarDatos();
      this.title = 'Agregar'
      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
      this.exchangeRateForm.get('codigoMoneda')?.disable();
      this.exchangeRateForm.get('fecha')?.disable();
      this.exchangeRateForm.get('codigoBanco')?.disable();
    } else {
      this.exchangeRateForm.disable();
    }

    this.cargarTipoCambio();
  }

  cargarDatos(): void {
    this.banksService.getBancos2(0, 1000, null)
      .pipe(tap(() => this.currencyService.getCurrencies(0, 1000, null).subscribe(res => this.currencies = res.value!)))
      .subscribe(res => {
        if (!res.success) {
          this.showMessage({ message: res.message, isSuccess: res.success })
          return;
        }
        this.banks = res.value!;
        this.isLoading = false;
      });

  }

  cargarTipoCambio(): void {

    // this.exchangeRateService.getExchangeRate({})

    this.activatedRoute.params.pipe(
      // tap(() => ),
      switchMap(({ codigoMoneda, fecha, codigoBanco }) => {

        const fechaToString = this.helperService.formatDateToString(fecha)
        return this.exchangeRateService.getExchangeRate({ codigoMoneda: codigoMoneda, fecha: fechaToString, codigoBanco: codigoBanco });
      })
    ).subscribe(res => {

      this.cargarDatos();
      if (!res.success) {
        this.showMessage({ message: res.message, isSuccess: res.success })
        return;
      }

      this.exchangeRateForm.reset({
        ...res.value,
        fecha: this.helperService.formatDateToString2(res.value!.fecha)
      })

      this.isLoading = false;
      return;
    })
  }

  onSubmit() {

    if (this.exchangeRateForm.invalid) {
      this.exchangeRateForm.markAllAsTouched();
      return;
    }

    if (this.title === "Editar") {

      this.exchangeRateService.updateExchangeRate(this.currentTipoCambio)
        .subscribe(res => {
          this.showMessage({ message: res.message, isSuccess: res.success })
        })
      return;
    }

    this.exchangeRateService.createExchangeRate(this.currentTipoCambio).subscribe(res => {
      this.showMessage({ message: res.message, isSuccess: res.success });
      if (!res.success) return;
    });

    this.exchangeRateForm.reset({
      codigoMoneda: '',
      codigoBanco: ''
    });

  }



  isValidField(field: string) {
    return this.validatorsService.isValidField(this.exchangeRateForm, field);
  }
  getFieldOfGroupError(field: string) {
    return this.messageManagerService.getFieldOfGroupError(field, this.exchangeRateForm);;
  }

  // setCurrentTipoCambio(codigoBanco,codigoMoneda){
  //   return {
  //     ...this.currentTipoCambio,

  //   }
  // }

  get currentTipoCambio(): ExchangeRate {

    const currencyForm = this.exchangeRateForm;

    const tipoCambioCompra = currencyForm.get('tipoCambioCompra')?.value;
    const tipoCambioVenta = currencyForm.get('tipoCambioVenta')?.value;
    const fecha = currencyForm.get('fecha')?.value;
    const codigoBanco = currencyForm.get('codigoBanco')?.value;
    const codigoMoneda = currencyForm.get('codigoMoneda')?.value;
    let nFecha = '';

    if (fecha !== '') nFecha = this.helperService.formatDateToString(fecha);

    return {
      ...currencyForm.value,
      tipoCambioCompra: Number(tipoCambioCompra),
      tipoCambioVenta: Number(tipoCambioVenta),
      fecha: nFecha,
      codigoBanco,
      codigoMoneda
    };
  }

  showMessage(message: Message) {
    this.message = message;
    setTimeout(() => {
      this.message = null
    }, 4000);
  }


}
