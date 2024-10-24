import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ruta } from '../../../shared/interfaces/ultima-ruta.interface';
import { Currency } from '../../interface/currency.interface';
import { Router } from '@angular/router';
import { PaginationService } from '../../../shared/service/pagination.service';
import { RouterService } from '../../../shared/service/router.service';
import { CurrencyService } from '../../service/currency.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { CommonResponse } from '../../../clients/interface/client.interface';
import { filter, of, switchMap } from 'rxjs';
import { DEFAULT_OFFSET } from '../../../shared/constants/constants';
const OFFSET: string = 'offset';
const LIMIT: string = 'limit';
const NOMBRE: string = 'nombre';
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
  public PaginationForm!: FormGroup;
  // Arreglos
  public currrencies: Currency[] = [];



  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private sms: MessageManagerService,
  ) {

    this.PaginationForm = this.fb.group({
      offset: [0, [Validators.required, Validators.min(0)]],
      limit: [5, [Validators.required, Validators.min(1)]],
      nombre: [''],
    })
  }

  ngOnInit(): void {


    this.loadCurrencies();
    this.onChangeLimit();
  }
  get limites(): number[] {
    return [5, 8, 10]
  }
  get currentPagination() {
    const form = this.PaginationForm;
    return {
      offset: Number(form.get(OFFSET)?.value),
      limit: Number(form.get(LIMIT)?.value),
      nombre: String(form.get(NOMBRE)?.value).length === 0 ? null : form.get(NOMBRE)?.value
    }
  }

  loadCurrencies() {
    const { offset, limit, nombre } = this.currentPagination;
    this.currencyService.getCurrencies(offset * limit, limit, nombre)
      .subscribe(res => this.handleResponse(res));
  }
  handleResponse({ success: isSuccess, message, value }: CommonResponse<Currency[]>): void {
    this.isLoading = false;
    if (!isSuccess) {
      this.sms.simpleBox({ message, success: isSuccess })
      return;
    }
    this.canPagination = value!.length === this.currentPagination.limit;
    this.currrencies = value!

  }

  onChangeLimit(): void {

    this.PaginationForm.get(LIMIT)?.valueChanges
      .pipe(filter(value => {
        // if (!value) return false;
        this.PaginationForm.get(OFFSET)?.setValue(DEFAULT_OFFSET)
        return value
      }))
      .subscribe(() => {
        this.loadCurrencies();
      })

  }


  onIncrease() {
    this.PaginationForm.get(OFFSET)?.setValue(this.currentPagination.offset + 1);
    this.loadCurrencies();

  }
  onDecrease() {
    this.PaginationForm.get(OFFSET)?.setValue(this.currentPagination.offset - 1);
    this.loadCurrencies()
  }

  onSearch(event: any): void {
    event.preventDefault();
    this.loadCurrencies();
  }

  onDelete(id: string): void {
    this.sms.confirmBox({})
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return of();
          this.isLoading = true;
          return this.currencyService.deleteCurrency(id);
        }),
        switchMap(({ message, success }) => {
          this.sms.simpleBox({ message, success });
          if (!success) {
            this.isLoading = false;
            return of();
          }
          const { offset, limit, nombre: codigoBanco } = this.currentPagination;
          return this.currencyService.getCurrencies(offset * limit, limit, codigoBanco);
        })
      ).subscribe(res => this.handleResponse(res));

  }
}
