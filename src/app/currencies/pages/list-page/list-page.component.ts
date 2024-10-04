import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ruta } from '../../../shared/interfaces/ultima-ruta.interface';
import { Currency } from '../../interface/currency.interface';
import { Router } from '@angular/router';
import { PaginationService } from '../../../shared/service/pagination.service';
import { RouterService } from '../../../shared/service/router.service';
import { CurrencyService } from '../../service/currency.service';

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
  // Arreglos
  public currrencies: Currency[] = [];

  //Ruta
  public rutaActual: Ruta = {
    modulo: 'currencies',
    seccion: 'list'
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    protected paginationService: PaginationService,
    private routerService: RouterService,
    private currencyService: CurrencyService
  ) {

    this.PaginationForm = this.fb.group({
      offset: [paginationService.getInitOffset(this.rutaActual.modulo), [Validators.required, Validators.min(0)]],
      limit: [paginationService.getInitLimit(this.rutaActual.modulo), [Validators.required, Validators.min(1)]],
      codigoBanco: [''],
    })
  }
  ngOnDestroy(): void {
    this.routerService.ultimaRuta = this.rutaActual;
  }
  ngOnInit(): void {
    if (!this.router.url.includes('list')) return;
    this.isLoading = true;

    this.paginationService.init(this.PaginationForm, this.rutaActual.modulo);

    const { modulo, seccion } = this.routerService.ultimaRuta;
    //Si viene de la vista info o edit cliente, mantenga la palabra
    if (modulo === this.rutaActual.modulo && seccion !== this.rutaActual.seccion) {
      this.PaginationForm.get('codigoBanco')?.setValue(this.paginationService.getPalabra())
    }

    this.getCurrencies();
  }


  getCurrencies() {
    const { offset, limit, palabra } = this.paginationService.getParameterPagination();

    this.currencyService.getCurrencies(offset * limit, limit, palabra)
      .subscribe(res => {
        if (!res.success) {
          this.showMessage({ isSuccess: res.success, message: res.message })
        }

        this.currrencies = res.value!;
        this.canPagination = this.currrencies.length === limit;
        this.isLoading = false;
      })
  }



  increaseOffset(number: number) {
    this.paginationService.setOffset(number);
    this.getCurrencies();

  }
  decreaseOffset(number: number) {
    this.paginationService.setOffset(number);
    this.getCurrencies()
  }

  //==================================================00

  onSearch(event: any): void {
    event.preventDefault();
    if (this.PaginationForm.invalid) {
      this.PaginationForm.markAllAsTouched();
      return;
    }

    this.paginationService.setOffset(0);
    this.paginationService.setPalabra(this.getNombreCliente);
    this.getCurrencies();
    const { offset, limit, palabra } = this.paginationService.getParameterPagination();

    this.PaginationForm.reset({ offset, limit, codigoBanco: palabra });
  }


  get getNombreCliente(): string {
    const value = this.PaginationForm.get('codigoBanco')?.value;
    return value as string;
  }

  showMessage(message: Message) {

    this.message = message;

    setTimeout(() => {
      this.message = null;

    }, 4000);
  }
}
