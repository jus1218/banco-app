import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ruta } from '../../../shared/interfaces/ultima-ruta.interface';
import { ExchangeRate, PaginationExchangeRate } from '../../interfaces/exchange-rate.interface';
import { RouterService } from '../../../shared/service/router.service';
import { ExchangeRateService } from '../../service/exchange-rate.service';
import { BanksService } from '../../../banks/services/banks.service';
import { Bank } from '../../../banks/interfaces/bank.interface';
import { tap } from 'rxjs';
import { CurrencyService } from '../../../currencies/service/currency.service';
import { Currency } from '../../../currencies/interface/currency.interface';
import { HelperService } from '../../../shared/service/helper.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit, OnDestroy {

  // Variables visuales
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  // Formulario
  public PaginationForm!: FormGroup;
  public exchangeRateToRemove: ExchangeRate | null = null;
  // Arreglos
  public exchangeRates: ExchangeRate[] = [];
  public banks: Bank[] = [];
  public currencies: Currency[] = [];

  //Ruta
  public rutaActual: Ruta = {
    modulo: 'exchange-rates',
    seccion: 'list'
  }


  constructor(
    private routerService: RouterService,
    private fb: FormBuilder,
    private exchangeRateService: ExchangeRateService,
    private banksService: BanksService,
    private currencyService: CurrencyService,
    private helperService: HelperService
  ) {
    this.initValues();
    // this.banksService.getBancos(0, 5, null).subscribe(res => this.banks = res);
  }
  ngOnDestroy(): void {
    this.routerService.ultimaRuta = this.rutaActual;
  }
  ngOnInit(): void {
    this.isLoading = true;



    this.exchangeRateService.getExchangeRates({ offset: 0, limit: 5, codigoMoneda: null, fecha: null, codigoBanco: null })
      .pipe(
        tap(() => this.banksService.getBancos2(0, 1000, null).subscribe(res => {
          if (!res.success) {
            this.showMessage({ message: res.message, isSuccess: res.success })
            return;
          }
          this.banks = res.value!
        })),
        tap(() => this.currencyService.getCurrencies(0, 1000, null).subscribe(res => this.currencies = res.value!))
      ).subscribe(res => {
        this.exchangeRates = res.value!;
        this.canPagination = res.value!.length === this.currentPagination.limit;
        this.isLoading = false;
      })

  }

  initValues(): void {
    this.PaginationForm = this.fb.group(
      {
        offset: [0, [Validators.required, Validators.min(0)]],
        limit: [5, [Validators.required, Validators.min(1)]],
        codigoBanco: ['', []],
        codigoMoneda: ['', []],
        fecha: ['', []]
      }
    );
  }

  showMessage(message: Message) {
    this.message = message;
    setTimeout(() => {
      this.message = null
    }, 4000);
  }

  filter() {
    this.isLoading = true;
    this.PaginationForm.get('offset')?.setValue(0);
    this.exchangeRateService.getExchangeRates(this.currentPagination)
      .subscribe(res => {
        this.exchangeRates = res.value!;
        this.canPagination = res.value!.length === this.currentPagination.limit;
        this.isLoading = false;
      })

  }


  get currentPagination(): PaginationExchangeRate {

    const filter = this.PaginationForm.value;
    const fecha = this.PaginationForm.get('fecha')?.value;

    if (fecha !== '') filter.fecha = this.helperService.formatDateToString(fecha);
    return { ...filter }
  }


  increase() {
    this.paginate(this.currentPagination.offset + 1);
  }

  decrease() {
    this.paginate(this.currentPagination.offset - 1);
  }


  paginate(newOffset: number) {
    this.isLoading = true;
    this.PaginationForm.get('offset')?.setValue(newOffset);

    this.exchangeRateService.getExchangeRates({
      ...this.currentPagination,
      offset: this.currentPagination.offset * this.currentPagination.limit,
    })
      .subscribe(res => {
        this.exchangeRates = res.value!;
        this.canPagination = res.value!.length === this.currentPagination.limit;
        this.isLoading = false;
      })

  }


  setDelete(exchangeRateToRemove: ExchangeRate) {
    this.exchangeRateToRemove = exchangeRateToRemove;
  }

  deleteExchangeRate(exchangeRateToRemove: ExchangeRate) {
    this.isLoading = true;
    this.exchangeRateService.deleteExchangeRate({ ...exchangeRateToRemove, fecha: this.helperService.formatDateToString(exchangeRateToRemove.fecha.toString()) })
      .subscribe(res => {
        this.showMessage({ message: res.message, isSuccess: res.success });
        this.isLoading = false;
        this.exchangeRates = this.exchangeRates
          .filter(ex =>
          (ex.codigoBanco !== exchangeRateToRemove.codigoBanco &&
            ex.fecha !== exchangeRateToRemove.fecha &&
            ex.codigoMoneda !== exchangeRateToRemove.codigoMoneda
          )
        )



      })
  }
}



