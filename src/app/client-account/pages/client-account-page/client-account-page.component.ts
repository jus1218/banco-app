import { Component, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { BanksService } from '../../../banks/services/banks.service';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BancoSelector, ClienteSelector, CuentaContableSelector, MonedaSelector, Selector, SelectorService, TipoCuentaClienteSelector } from '../../../shared/service/selector.service';
import { ClientAccountService } from '../../service/client-account.service';
import { Observable, tap, switchMap } from 'rxjs';
import { CurrentClientAccount } from '../../interfaces/current-client-account';
import { CommonResponse } from '../../../clients/interface/client.interface';
import { ClientAccountInfo } from '../../interfaces/client-account.interface';

@Component({
  selector: 'app-client-account-page',
  templateUrl: './client-account-page.component.html',
  styleUrl: './client-account-page.component.css'
})
export class ClientAccountPageComponent implements OnInit {
  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;
  // Formulario
  public clientAccountForm!: FormGroup;
  //Arreglos
  public banks: BancoSelector[] = [];
  public currencies: MonedaSelector[] = [];
  public typeClientAccount: TipoCuentaClienteSelector[] = [];
  public clients: ClienteSelector[] = [];
  public cuentasContables: CuentaContableSelector[] = [];

  constructor(private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private sms: MessageManagerService,
    private router: Router,
    private selectorService: SelectorService,
    private clientAccountService: ClientAccountService,
    private activatedRoute: ActivatedRoute,
  ) {

    this.initValuesForm();
  }
  ngOnInit(): void {
    this.onBankChanged();

    this.isLoading = true;
    if (this.router.url.includes('register')) {
      this.cargarDatosSelectores();
      this.title = 'Agregar'
      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
      this.clientAccountForm.get('codigoCuentaCliente')?.disable();

    } else {
      this.clientAccountForm.disable();
    }

    this.loadClientAccount();

  }

  initValuesForm(): void {
    this.clientAccountForm = this.fb.group({
      codigoCuentaCliente: ['', []],
      codigoMoneda: ['', [Validators.required, Validators.maxLength(3)]],
      codigoBanco: ['', [Validators.required, Validators.maxLength(3)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      saldo: [{ value: '0', disabled: true }, , this.validatorsService.mountIsValid],
      codigoTipoCuentaCliente: ['', [Validators.required, Validators.maxLength(3)]],
      codigoCliente: ['', [Validators.required]],
      codigoCuentaContable: ['', [Validators.required]],
    });
  }

  cargarDatosSelectores(): void {
    this.selectorService.getAll().subscribe(res => this.handleResponseDataSelector(res));
  }
  handleResponseDataSelector({ message, success, value }: CommonResponse<Selector>): void {

    if (!success) {
      this.sms.simpleBox({ message, success });
      return;
    }
    const data = value!;
    this.banks = data.bancos;
    this.currencies = data.monedas;
    this.clientAccountForm.get('codigoMoneda')?.disable()
    this.typeClientAccount = data.tipoCuentaClientes;
    this.clients = data.clientes;
    this.cuentasContables = data.cuentaContables;

    this.isLoading = false;
  }

  loadClientAccount(): void {

    this.activatedRoute.params
      .pipe(
        switchMap(({ codigoCuentaCliente }) => {
          const codigo = Number(codigoCuentaCliente);
          return this.clientAccountService.getClientAccountById(codigo);
        }),
        switchMap(res => {
          this.handleResponse(res)
          return this.selectorService.getAll();
        })
      )
      .subscribe(res => this.handleResponseDataSelector(res))

  }

  handleResponse({ success, message, value: cuentaCliente }: CommonResponse<ClientAccountInfo>): void {
    this.isLoading = false;

    if (!(success)) {
      this.sms.simpleBox({ message, success });
      return;
    }
    this.clientAccountForm.reset({
      ...cuentaCliente,
      codigoCuentaContable: cuentaCliente!.codigoCuentaContable
    });
    return;
  }

  onBankChanged(): void {

    (this.clientAccountForm.get('codigoBanco')!.valueChanges as Observable<string>)
      .pipe(

        tap(() => this.clientAccountForm.get('codigoCuentaContable')?.setValue("")),
        tap((codigoBanco) => {

          if (!codigoBanco) {
            this.clientAccountForm.get('codigoMoneda')?.setValue('');
            return;
          }
          const monedaBanco = this.banks.find(b => b.codigoBanco === codigoBanco)?.codigoMoneda;
          this.currencies = this.selectorService.currencies.filter(m => m.codigoMoneda === monedaBanco)
          this.clientAccountForm.get('codigoMoneda')?.setValue(this.currencies[0].codigoMoneda)
        })
      )
      .subscribe((codigoBanco) => this.cuentasContables = this.selectorService.cuentasContables.filter(c => c.codigoBanco === codigoBanco))

  }



  get currentClientAccount(): CurrentClientAccount {
    const form = this.clientAccountForm;
    return {
      codigoCuentaCliente: Number(form.get('codigoCuentaCliente')?.value),
      codigoBanco: (form.get('codigoBanco')?.value as string),
      codigoMoneda: (form.get('codigoMoneda')?.value as string),
      descripcion: form.get('descripcion')?.value,
      codigoTipoCuentaCliente: form.get('codigoTipoCuentaCliente')?.value,
      codigoCliente: Number(form.get('codigoCliente')?.value),
      codigoCuentaContable: Number(form.get('codigoCuentaContable')?.value),
    }
  }


  // METODOS DE VALIDACION Y MENSAJES FORMULARIO
  isValidField(field: string) {
    return this.validatorsService.isValidField(this.clientAccountForm, field);
  }

  getFieldOfGroupError(field: string) {
    return this.sms.getFieldOfGroupError(field, this.clientAccountForm);;
  }

  onSubmit(): void {
    if (this.clientAccountForm.invalid) {
      this.clientAccountForm.markAllAsTouched();
      return;
    }


    if (this.title === "Editar") {

      this.clientAccountService.updateClientAccount(this.currentClientAccount)
        .subscribe(({ message, success }) => this.sms.simpleBox({ message, success }))
      return;
    }

    this.clientAccountService.createClientAccount(this.currentClientAccount)
      .subscribe(({ message, success }) => {
        this.sms.simpleBox({ message, success });
        if (!success) return;
        this.clientAccountForm.reset({
          codigoBanco: '',
          codigoTipoCuentaCliente: '',
          codigoCuentaContable: '',
          codigoCliente: '',
          descripcion: ''
        });
      });


  }
}



