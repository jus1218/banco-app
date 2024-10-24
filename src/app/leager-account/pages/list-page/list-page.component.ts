import { Component, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { LeagerAccount, LeagerAccount2, LeagerAccountFilter } from '../../interfaces/leagerAccount.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, LIMITS } from '../../../shared/constants/constants';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { EMPTY, filter, of, switchMap } from 'rxjs';
import { LeagerAccountsService } from '../../services/leager-accounts.service';
import { CommonResponse } from '../../../clients/interface/client.interface';
import { BancoSelector, SelectorService } from '../../../shared/service/selector.service';
import { Banco } from '../../../client-account/interfaces/client-account.interface';
const OFFSET: string = 'offset';
const LIMIT: string = 'limit';
const CODIGO_BANCO: string = 'codigoBanco';
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
  // // Arreglos
  public leagerAccounts: LeagerAccount2[] = [];
  public bancos: BancoSelector[] = [];
  // // Formulario
  public paginationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sms: MessageManagerService,
    private validatorsService: ValidatorsService,
    private leagerAccountsService: LeagerAccountsService,
    private selectorService: SelectorService
  ) {
    this.initFormValues();
  }

  initFormValues(): void {
    this.paginationForm = this.fb.group(
      {
        offset: [DEFAULT_OFFSET, this.validatorsService.offsetIsValid],
        limit: [DEFAULT_LIMIT, this.validatorsService.offsetIsLimit],
        codigoBanco: ["", []],
        limites: [LIMITS, []]
      }
    );


  }


  ngOnInit(): void {
    this.loadLeagerAccountsAndBanks();
    this.onChangeLimit();
    this.onChangeCodigoBanco();
  }

  loadLeagerAccountsAndBanks(): void {
    const { offset, limit, codigoBanco } = this.currentPagination;
    this.leagerAccountsService.getLeagerAccountsByPagination({ offset: offset * limit, limit, codigoBanco })
      .pipe(
        switchMap(res => {
          this.handleResponse(res);

          return this.selectorService.getAll();
        })
      )
      .subscribe(({ success: isSuccess, message, value }) => {

        if (!isSuccess) {
          this.sms.simpleBox({ message, success: isSuccess })
          return;
        }

        this.bancos = value!.bancos;

      });

  }
  loadLeagerAccounts(): void {
    const { offset, limit, codigoBanco } = this.currentPagination;
    this.leagerAccountsService.getLeagerAccountsByPagination({ offset: offset * limit, limit, codigoBanco })
      .subscribe(res => this.handleResponse(res));


  }
  get currentPagination(): LeagerAccountFilter {
    const form = this.paginationForm;
    return {
      offset: Number(form.get(OFFSET)?.value),
      limit: Number(form.get(LIMIT)?.value),
      codigoBanco: String(form.get(CODIGO_BANCO)?.value).length === 0 ? null : form.get(CODIGO_BANCO)?.value
    }
  }

  get limites(): number[] {
    return [5, 8, 10]
  }
  handleResponse({ success: isSuccess, message, value }: CommonResponse<LeagerAccount2[]>): void {
    this.isLoading = false;
    if (!isSuccess) {
      this.sms.simpleBox({ message, success: isSuccess })
      return;
    }
    this.canPagination = value!.length === this.currentPagination.limit;
    this.leagerAccounts = value!;

  }


  onIncrease(): void {
    this.paginationForm.get(OFFSET)?.setValue(this.currentPagination.offset + 1);
    this.loadLeagerAccounts();
  }
  onDecrease(): void {
    this.paginationForm.get(OFFSET)?.setValue(this.currentPagination.offset - 1);
    this.loadLeagerAccounts();
  }
  onChangeLimit(): void {

    this.paginationForm.get(LIMIT)?.valueChanges
      .pipe(filter(value => {
        // if (!value) return false;
        this.paginationForm.get(OFFSET)?.setValue(DEFAULT_OFFSET)
        return value
      }))
      .subscribe(() => {
        this.loadLeagerAccounts();
      })

  }
  onChangeCodigoBanco(): void {

    this.paginationForm.get(CODIGO_BANCO)?.valueChanges
      .subscribe(() => {
        this.paginationForm.get(OFFSET)?.setValue(DEFAULT_OFFSET)
        this.loadLeagerAccounts();
      })

  }
  onDelete(id: number): void {
    this.sms.confirmBox({})
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return of();
          this.isLoading = true;
          return this.leagerAccountsService.deleteLeagerAccount(Number(id));
        }),
        switchMap(res => {
          this.hanleResponseDelete(res);
          if (!res.success) return of();

          const { offset, limit, codigoBanco } = this.currentPagination;
          return this.leagerAccountsService.getLeagerAccountsByPagination({ offset: offset * limit, limit, codigoBanco });
        })
      ).subscribe(res => this.handleResponse(res));
  }
  hanleResponseDelete({ message, success: isSuccess }: CommonResponse<LeagerAccount>): void {
    this.sms.simpleBox({ message, success: isSuccess });
    if (isSuccess) return;
    this.isLoading = false;
  }

}
