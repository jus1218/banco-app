import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../shared/service/validator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../../clients/services/client.service';
import { RouterService } from '../../../../shared/service/router.service';
import { MessageManagerService } from '../../../../shared/service/message-manager.service';
import { BanksService } from '../../../../banks/services/banks.service';
import { Bank } from '../../../../banks/interfaces/bank.interface';
import { CurrencyService } from '../../../service/currency.service';
import { switchMap } from 'rxjs';
import { Currency } from '../../../interface/currency.interface';
import { Ruta } from '../../../../shared/interfaces/ultima-ruta.interface';
import { TitlePage } from '../../../../shared/interfaces/title-page.interface';

@Component({
  selector: 'app-currency-page',
  templateUrl: './currency-page.component.html',
  styleUrl: './currency-page.component.css'
})
export class CurrencyPageComponent implements OnInit, OnDestroy {
  // Variables visuales y condicionales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public message: Message | null = null;
  //Ruta
  public rutaActual: Ruta = {
    modulo: 'currencies',
    seccion: 'view'
  }

  //Arreglos
  // public banks: Bank[] = []

  //Formularios
  public currencyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private messageManagerService: MessageManagerService,
    private currencyService: CurrencyService
  ) {

    this.initValues();

  }
  ngOnDestroy(): void {
    this.routerService.ultimaRuta = this.rutaActual;
  }
  ngOnInit(): void {


    if (this.router.url.includes('register')) {
      this.title = 'Agregar'
      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
      this.currencyForm.get('codigoMoneda')?.disable();
    } else {
      this.currencyForm.disable();
    }

    this.cargarDatos();

  }


  initValues(): void {
    this.currencyForm = this.fb.group({
      codigoMoneda: ['', [Validators.required, Validators.maxLength(3)]],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }
  showMessage(message: Message) {
    this.message = message;
    setTimeout(() => {
      this.message = null
    }, 4000);
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.currencyService.getCurrency(id))
    ).subscribe(res => {

      this.currencyForm.reset({ ...res.value })
      this.isLoading = false;
      return;
    })
  }




  onSubmit(): void {
    if (this.currencyForm.invalid) {
      this.currencyForm.markAllAsTouched();
      return;
    }

    if (this.title === "Editar") {

      this.currencyService.updateCurrency(this.currentCurrency)
        .subscribe(res => {
          this.showMessage({ message: res.message, isSuccess: res.success });

          this.currencyForm.reset();
          return;
        });


    }

    // AGREGAR
    this.currencyService.createCurrency(this.currentCurrency)
      .subscribe(res => {
        this.showMessage({ message: res.message, isSuccess: res.success });

        this.currencyForm.reset();
        return;
      });

  }



  isValidField(field: string) {
    return this.validatorsService.isValidField(this.currencyForm, field);
  }

  getFieldOfGroupError(field: string) {
    return this.messageManagerService.getFieldOfGroupError(field, this.currencyForm);;
  }


  get currentCurrency(): Currency {
    return this.currencyForm.value as Currency;
  }


}
