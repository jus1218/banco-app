import { Component, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientAccount } from '../../interfaces/client-account.interface';
import { ClientAccountService } from '../../service/client-account.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { CommonResponse } from '../../../clients/interface/client.interface';
import { filter, of, switchMap } from 'rxjs';
import { DEFAULT_OFFSET } from '../../../shared/constants/constants';
import { ClienteSelector, SelectorService } from '../../../shared/service/selector.service';
const OFFSET: string = 'offset';
const LIMIT: string = 'limit';
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

  // Arreglos
  public clientAccounts: ClientAccount[] = [];
  public clients: ClienteSelector[] = [];


  constructor(
    private fb: FormBuilder,
    private clientAccountService: ClientAccountService,
    private sms: MessageManagerService,
    private selectorService: SelectorService,
  ) {
    this.paginationForm = this.fb.group(
      {
        offset: [0, [Validators.required, Validators.min(0)]],
        limit: [5, [Validators.required, Validators.min(1)]],
        codigoCliente: [0, [Validators.required, Validators.min(1)]],

      }
    );

  }
  ngOnInit(): void {
    this.initValues();
    this.onChangeLimit();
    this.onChangeCodigoBanco();
  }

  initValues() {
    this.loadClientsAccounts();
  }

  loadClientsAccounts(): void {
    this.isLoading = true;

    this.clientAccountService.getClientAccounts(this.currentPagination)
      .pipe(switchMap(res => {

        this.handleResponse(res);
        return this.selectorService.getAll();
      }))
      .subscribe(({ success: isSuccess, message, value }) => {
        if (!isSuccess) {
          this.sms.simpleBox({ message, success: isSuccess })
          return;
        }
        this.clients = value?.clientes!;
      });
  }

  handleResponse({ success, message, value }: CommonResponse<ClientAccount[]>): void {
    this.isLoading = false;
    if (!success) {
      this.sms.simpleBox({ message, success })
      return;
    }
    this.canPagination = value!.length === this.currentPagination.limit;
    this.clientAccounts = value!;

  }

  get limites(): number[] {
    return [5, 8, 10]
  }


  onIncrease(): void {
    this.paginationForm.get(OFFSET)?.setValue(this.currentPagination.offset + 1);
    this.loadClientsAccounts();
  }
  onDecrease(): void {
    this.paginationForm.get(OFFSET)?.setValue(this.currentPagination.offset - 1);
    this.loadClientsAccounts();
  }

  onChangeLimit(): void {
    this.paginationForm.get(LIMIT)?.valueChanges
      .pipe(filter(value => {
        // if (!value) return false;
        this.paginationForm.get(OFFSET)?.setValue(DEFAULT_OFFSET)
        return value
      }), switchMap(() => {
        return this.clientAccountService.getClientAccounts(this.currentPagination)
      }))
      .subscribe(res => this.handleResponse(res))
  }


  get currentPagination(): { offset: number, limit: number, codigoCliente: number | null } {
    const form = this.paginationForm;
    const codigoCliente = Number(form.get('codigoCliente')?.value)
    return {
      offset: Number(form.get(OFFSET)?.value),
      limit: Number(form.get(LIMIT)?.value),
      codigoCliente: codigoCliente === 0 ? null : codigoCliente,
    }
  }

  onDelete(codeClientAccount: number) {
    this.sms.confirmBox({})
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return of();
          this.isLoading = true;
          // Solicitud de eliminacion
          return this.clientAccountService.deleteClientAccount(codeClientAccount);
        }), switchMap(({ message, success }) => {
          this.sms.simpleBox({ message, success });

          return this.clientAccountService.getClientAccounts(this.currentPagination)
        }))
      .subscribe(res => this.handleResponse(res));
  }
  onChangeCodigoBanco(): void {

    this.paginationForm.get('codigoCliente')?.valueChanges
      .subscribe(() => {
        this.paginationForm.get(OFFSET)?.setValue(DEFAULT_OFFSET)
        this.loadClientsAccounts();
      })

  }
}
