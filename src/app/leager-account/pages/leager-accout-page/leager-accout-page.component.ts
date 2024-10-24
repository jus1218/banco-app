import { Component, OnInit } from '@angular/core';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BancoSelector, MonedaSelector, Selector, SelectorService, TipoCuentaContableSelector } from '../../../shared/service/selector.service';
import { RouterService } from '../../../shared/service/router.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { LeagerAccount } from '../../interfaces/leagerAccount.interface';
import { CommonResponse } from '../../../clients/interface/client.interface';
import { of, switchMap, tap } from 'rxjs';
import { LeagerAccountsService } from '../../services/leager-accounts.service';

@Component({
  selector: 'app-leager-accout-page',
  templateUrl: './leager-accout-page.component.html',
  styleUrl: './leager-accout-page.component.css'
})
export class LeagerAccoutPageComponent implements OnInit {
  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;
  //ARREGLOS
  public bancos: BancoSelector[] = [];
  public monedas: MonedaSelector[] = [];
  public tiposCuentaContable: TipoCuentaContableSelector[] = [];

  //Formularios
  public leagerAccoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validService: ValidatorsService,
    private sms: MessageManagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private leagerAccountsService: LeagerAccountsService,
    private selectorService: SelectorService,) { this.initFormValues(); }

  initFormValues(): void {

    this.leagerAccoutForm = this.fb.group({
      codigoCuentaContable: ['', this.validService.codigoCuentaContableIsValid],
      codigoBanco: ['', this.validService.codigoBancoIsValid],
      codigoMoneda: ['', this.validService.codigoMonedaIsValid],
      descripcion: ['', this.validService.descriptionIsValid],
      saldo: [0, this.validService.mountIsValid],
      codigoTipoCuentaContable: [0, this.validService.codigoTipoCuentaContableIsValid],
    });
  }
  ngOnInit(): void {
    this.configureFormByRoute();
  }
  configureFormByRoute(): void {
    this.isLoading = true;
    this.leagerAccoutForm.get('saldo')?.disable();
    if (this.router.url.includes('register')) {
      this.title = 'Agregar'
      this.loadDataSelector();

      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
    } else {
      this.leagerAccoutForm.disable();
    }
    this.loadLeagerAccount();
  }
  loadLeagerAccount(): void {


    this.activatedRoute.params
      .pipe(
        tap(value => console.log(value)),
        switchMap(({ codigo }) => this.leagerAccountsService.getLeagerAccount(Number(codigo))),
        switchMap(res => {
          this.handleResponseLeagerAccount(res);
          if (!res.success) return of()
          return this.selectorService.getAll();
        })).subscribe(res => this.handleResponseDataSelectors(res))
  }
  loadDataSelector(): void {
    this.selectorService.getAll().subscribe(res => this.handleResponseDataSelectors(res));
  }
  handleResponseDataSelectors({ message, success: isSuccess, value }: CommonResponse<Selector>): void {
    this.isLoading = false;
    if (!isSuccess) {
      this.sms.simpleBox({ message, success: isSuccess })
      this.router.navigate(['/leager-accounts/list']);
      return;
    }
    this.bancos = value?.bancos!;
    this.monedas = value?.monedas!;
    this.tiposCuentaContable = value?.tipoCuentaContables!;
  }
  handleResponseLeagerAccount({ message, success: isSuccess, value }: CommonResponse<LeagerAccount>): void {
    this.isLoading = false;
    if (!isSuccess) {
      this.sms.simpleBox({ message, success: isSuccess });
      this.router.navigate(['/leager-accounts/list']);
      return;
    }

    this.leagerAccoutForm.reset({ ...value });
  }


  isValidField(field: string) {
    return this.validService.isValidField(this.leagerAccoutForm, field);
  }
  getFieldOfGroupError(field: string) {
    const message = this.sms.getFieldOfGroupError(field, this.leagerAccoutForm);
    return message;
  }

  onSubmit(): void {
    if (this.leagerAccoutForm.invalid) {
      this.leagerAccoutForm.markAllAsTouched();
      return;
    }
    if (this.title === "Editar") {

      this.leagerAccountsService.updateLeagerAccount(this.currentLeagerAccount)
        .subscribe(({ message, success: isSuccess }) => this.sms.simpleBox({ message, success: isSuccess }))
      return;
    }

    this.leagerAccountsService.createLeagerAccount(this.currentLeagerAccount)
      .subscribe(({ message, success: isSuccess }) => {
        this.sms.simpleBox({ message, success: isSuccess })
        if (!isSuccess) return;

        this.leagerAccoutForm.reset({
          codigoCuentaContable: 0,
          codigoBanco: "",
          codigoMoneda: "",
          descripcion: "",
          codigoTipoCuentaContable: 0
        });
      });
  }

  get currentLeagerAccount(): LeagerAccount {
    const form = this.leagerAccoutForm;

    return {
      ...form.value,
      codigoCuentaContable: Number(form.get('codigoCuentaContable')?.value)
    }
  }
}
