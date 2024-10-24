import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ruta } from '../../../shared/interfaces/ultima-ruta.interface';
import { ExchangeRate, PaginationExchangeRate } from '../../interfaces/exchange-rate.interface';
import { RouterService } from '../../../shared/service/router.service';
import { ExchangeRateService } from '../../service/exchange-rate.service';
import { BanksService } from '../../../banks/services/banks.service';
import { Bank } from '../../../banks/interfaces/bank.interface';
import { of, switchMap, tap } from 'rxjs';
import { CurrencyService } from '../../../currencies/service/currency.service';
import { Currency } from '../../../currencies/interface/currency.interface';
import { HelperService } from '../../../shared/service/helper.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { CommonResponse } from '../../../clients/interface/client.interface';
import { BancoSelector, Selector, SelectorService } from '../../../shared/service/selector.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit {

  // Variables visuales
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  // Formulario
  public paginationForm!: FormGroup;
  public exchangeRateToRemove: ExchangeRate | null = null;
  // Arreglos
  public exchangeRates: ExchangeRate[] = [];
  public banks: BancoSelector[] = [];
  public currencies: Currency[] = [];




  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private sms: MessageManagerService,
    private exchangeRateService: ExchangeRateService,
    private selectorService: SelectorService
  ) {
    this.initValues();
  }
  initValues(): void {
    this.paginationForm = this.fb.group(
      {
        offset: [0, [Validators.required, Validators.min(0)]],
        limit: [5, [Validators.required, Validators.min(1)]],
        codigoBanco: ['', []],
        codigoMoneda: ['', []],
        fecha: ['', []]
      }
    );
  }
  ngOnInit(): void {
    this.loadExchangeRates();
  }

  loadExchangeRates(): void {
    this.isLoading = true;
    const { offset, limit, codigoBanco, codigoMoneda, fecha } = this.currentPagination;
    this.exchangeRateService.getExchangeRates({ offset: offset * limit, limit, codigoMoneda, fecha, codigoBanco })
      .pipe(
        switchMap(res => {
          this.handleResponse(res);
          return this.selectorService.getAll();
        })
      )
      .subscribe(res => this.handleResponseDataSelector(res));
  }

  handleResponse({ success: isSuccess, message, value }: CommonResponse<ExchangeRate[]>): void {
    this.isLoading = false;
    if (!isSuccess) {
      this.sms.simpleBox({ message, success: isSuccess })
      return;
    }
    this.canPagination = value!.length === this.currentPagination.limit;
    this.exchangeRates = value!;
  }

  handleResponseDataSelector({ success: isSuccess, message, value }: CommonResponse<Selector>): void {
    if (!isSuccess) {
      this.sms.simpleBox({ message, success: isSuccess })
      return;
    }

    this.currencies = value!.monedas;
    this.banks = value!.bancos;

  }

  filter() {
    this.paginationForm.get('offset')?.setValue(0);
    this.loadExchangeRates();
  }


  get currentPagination(): PaginationExchangeRate {

    const form = this.paginationForm;
    const codigoBanco = String(this.paginationForm.get('codigoBanco')?.value);
    const codigoMoneda = String(this.paginationForm.get('codigoMoneda')?.value);
    let fecha = this.paginationForm.get('fecha')?.value;

    fecha = fecha !== '' ? this.helperService.formatDateToString(fecha) : null;

    return {
      ...form.value,
      fecha: fecha,
      codigoBanco: codigoBanco.length === 0 ? null : codigoBanco,
      codigoMoneda: codigoMoneda.length === 0 ? null : codigoMoneda
    }
  }


  increase() {
    this.paginationForm.get('offset')?.setValue(this.currentPagination.offset + 1);
    this.loadExchangeRates();
  }

  decrease() {
    this.paginationForm.get('offset')?.setValue(this.currentPagination.offset - 1);
    this.loadExchangeRates();
  }


  deleteExchangeRate(exchangeRateToRemove: ExchangeRate) {

    this.sms.confirmBox({})
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return of();
          this.isLoading = true;
          return this.exchangeRateService.deleteExchangeRate({ ...exchangeRateToRemove, fecha: this.helperService.formatDateToString(exchangeRateToRemove.fecha.toString()) })
        }),

        switchMap(({ message, success }) => {
          this.sms.simpleBox({ message, success });
          if (!success) {
            this.isLoading = false;
            return of();
          }
          const { offset, limit, codigoBanco, codigoMoneda, fecha } = this.currentPagination;
          return this.exchangeRateService.getExchangeRates({ offset: offset * limit, limit, codigoMoneda, fecha, codigoBanco })
        })
      ).subscribe(res => this.handleResponse(res));

  }
}



