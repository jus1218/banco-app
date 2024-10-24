import { Component, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from '../../../shared/service/pagination.service';
import { ClientService } from '../../services/client.service';
import { Client, CommonResponse } from '../../interface/client.interface';
import { of, switchMap } from 'rxjs';
import { RouterService } from '../../../shared/service/router.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { Pagination } from '../../../shared/constants/constants';

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
  public clients: Client[] = [];


  constructor(
    private router: Router,
    private fb: FormBuilder,
    protected paginationService: PaginationService,
    private clientService: ClientService,
    private routerService: RouterService,
    private sms: MessageManagerService
  ) {
    this.initFormValues();

  }
  initFormValues(): void {
    this.PaginationForm = this.fb.group({
      offset: [0, [Validators.required, Validators.min(0)]],
      limit: [5, [Validators.required, Validators.min(1)]],
      nombreCliente: [''],
    })

  }

  ngOnInit(): void {

    this.loadClients();
  }

  loadClients(): void {
    const { offset, limit, nombre } = this.currentPagination;

    this.clientService.getClientes(offset * limit, limit, nombre)
      .subscribe((res) => this.managerResponse(res))

  }

  onIncrease(): void {
    this.PaginationForm.get(Pagination.OFFSET)?.setValue(this.currentPagination.offset + 1);
    this.loadClients();
  }
  onDecrease(): void {
    this.PaginationForm.get(Pagination.OFFSET)?.setValue(this.currentPagination.offset - 1);
    this.loadClients();
  }
  onSearch(event: any): void {
    event.preventDefault();
    this.loadClients();
  }



  get currentPagination() {
    const form = this.PaginationForm;
    return {
      offset: Number(form.get(Pagination.OFFSET)?.value),
      limit: Number(form.get(Pagination.LIMIT)?.value),
      nombre: form.get('nombreCliente')?.value
    }
  }

  onDelete(codigoCliente: number): void {
    this.sms.confirmBox({})
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return of();
          this.isLoading = true;
          // Solicitud de eliminacion
          return this.clientService.deleteClient(codigoCliente);
        }),
        switchMap(({ message, success: isSuccess }) => {

          this.sms.simpleBox({ message, success: isSuccess });
          if (!isSuccess) {
            this.isLoading = false;
            return of();
          }

          const { offset, limit, nombre } = this.currentPagination;
          return this.clientService.getClientes(offset * limit, limit, nombre)
        })

      ).subscribe((res) => this.managerResponse(res));
  }


  managerResponse({ message, success: isSuccess, value: banks }: CommonResponse<Client[]>) {
    if (!isSuccess) {
      this.sms.simpleBox({ message, success: isSuccess });
      this.isLoading = false;
      return;
    }

    this.clients = banks!;
    this.canPagination = this.clients.length === this.currentPagination.limit;
    this.isLoading = false;
  }
}
