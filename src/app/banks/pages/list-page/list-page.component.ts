import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BanksService } from '../../services/banks.service';
import { Bank } from '../../interfaces/bank.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from '../../../shared/service/pagination.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Message } from '../../../shared/interfaces/message.interface';
import { RouterService } from '../../../shared/service/router.service';
import { Ruta } from '../../../shared/interfaces/ultima-ruta.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit, OnDestroy {

  public banks: Bank[] = [];
  public myForm: FormGroup;
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;
  public rutaActual: Ruta = {
    modulo: 'banks',
    seccion: 'list'
  }
  constructor(
    private router: Router,
    private banksService: BanksService,
    private fb: FormBuilder,
    protected paginationService: PaginationService,
    private routerService: RouterService
  ) {

    this.myForm = this.fb.group({
      offset: [paginationService.getInitOffset(this.rutaActual.modulo), [Validators.required, Validators.min(0)]],
      limit: [paginationService.getInitLimit(this.rutaActual.modulo), [Validators.required, Validators.min(1)]],
      nombre: ['', [Validators.minLength(1)]],
    })
  }
  ngOnDestroy(): void {
    this.routerService.ultimaRuta = this.rutaActual;
  }


  ngOnInit(): void {
    if (!this.router.url.includes('list')) return;
    this.isLoading = true;

    this.paginationService.init(this.myForm, this.rutaActual.modulo);

    const { modulo, seccion } = this.routerService.ultimaRuta;
    //Inicializamos la paginacion
    if (modulo === this.rutaActual.modulo && seccion !== this.rutaActual.seccion) {
      this.myForm.get('nombre')?.setValue(this.paginationService.getPalabra())
    }
    // this.paginationService.init(this.myForm, '');
    const { offset, limit } = this.paginationService.getParameterPagination();

    const name = this.paginationService.getPalabra();
    // this.myForm.get('nombre')?.setValue(name);
    this.banksService.getBancos(offset * limit, limit, name)
      .pipe(catchError((s) => {

        this.showMessage('Recargue la pagina nuevamente', false);
        this.isLoading = false;

        return of([]);
      }))
      .subscribe(banks => {
        this.banks = banks

        this.canPagination = banks.length === limit;
        this.isLoading = false;
      });

  }
  // ngOnInit(): void {
  //   if (!this.router.url.includes('list')) return;
  //   this.isLoading = true;
  //   // this.paginationService.setForm(this.myForm)
  //   this.paginationService.init(this.myForm,'');
  //   const { offset, limit } = this.paginationService.getParameterPagination();

  //   const name = this.paginationService.getPalabra();
  //   this.myForm.get('nombre')?.setValue(name);
  //   this.banksService.getBancos(offset * limit, limit, name)
  //     .pipe(catchError((s) => {

  //       this.showMessage('Recargue la pagina nuevamente', false);
  //       this.isLoading = false;

  //       return of([]);
  //     }))
  //     .subscribe(banks => {
  //       this.banks = banks

  //       this.canPagination = banks.length === limit;
  //       this.isLoading = false;
  //     });

  // }
  getBancos(offset: number, limit: number, nombre: string | null): void {
    this.banksService.getBancos(offset, limit, nombre?.length === 0 ? null : nombre).subscribe(banks => {
      this.banks = banks

      this.canPagination = banks.length === limit;
      this.isLoading = false;
    });
  }

  increaseOffset(number: number) {
    this.paginationService.setOffset(number);
    const { offset, limit } = this.paginationService.getParameterPagination();
    this.getBancos(offset * limit, limit, this.paginationService.getPalabra())

  }
  decreaseOffset(number: number) {
    this.paginationService.setOffset(number);
    const { offset, limit } = this.paginationService.getParameterPagination();
    this.getBancos(offset * limit, limit, this.paginationService.getPalabra())
  }


  showMessage(message: string, isSuccess: boolean) {
    this.message = { message, isSuccess };
    setTimeout(() => {
      this.message = null;
    }, 4000);
  }



  onSearch(event: any): void {
    event.preventDefault();
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.paginationService.setOffset(0);
    this.paginationService.setPalabra(this.myForm.get('nombre')?.value);

    this.getBancos(this.paginationService.getOffsett(), this.paginationService.getLimitt(), this.paginationService.getPalabra())

    this.myForm.reset({ offset: 0, limit: 5, nombre: this.paginationService.getPalabra() });

  }

  // canPagination(): Boolean {
  //   return this.paginationService.canPagination(this.banks.length);

  // }
}
