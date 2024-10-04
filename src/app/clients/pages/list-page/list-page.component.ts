import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../../shared/interfaces/message.interface';
import { NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from '../../../shared/service/pagination.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../interface/client.interface';
import { filter, Subscription } from 'rxjs';
import { RouterService } from '../../../shared/service/router.service';
import { Ruta } from '../../../shared/interfaces/ultima-ruta.interface';

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
  public PaginationForm: FormGroup;
  // Arreglos
  public clients: Client[] = [];
  //Suscripciones
  private clientSubscription!: Subscription;
  //Ruta
  public rutaActual: Ruta = {
    modulo: 'clients',
    seccion: 'list'
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    protected paginationService: PaginationService,
    private clientService: ClientService,
    private routerService: RouterService
  ) {
    this.PaginationForm = this.fb.group({
      offset: [paginationService.getInitOffset(this.rutaActual.modulo), [Validators.required, Validators.min(0)]],
      limit: [paginationService.getInitLimit(this.rutaActual.modulo), [Validators.required, Validators.min(1)]],
      nombreCliente: [''],
    })

  }
  ngOnDestroy(): void {

    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }

    this.routerService.ultimaRuta = this.rutaActual;
  }
  ngOnInit(): void {
    if (!this.router.url.includes('list')) return;
    this.isLoading = true;

    this.paginationService.init(this.PaginationForm, this.rutaActual.modulo);

    const { modulo, seccion } = this.routerService.ultimaRuta;
    //Si viene de la vista info o edit cliente, mantenga la palabra
    if (modulo === this.rutaActual.modulo && seccion !== this.rutaActual.seccion) {
      this.PaginationForm.get('nombreCliente')?.setValue(this.paginationService.getPalabra())
    }

    //Obtenemos los clientes
    this.getClients();
  }

  getClients(): void {

    const { offset, limit, palabra } = this.paginationService.getParameterPagination();

    this.clientSubscription = this.clientService.getClientes(offset * limit, limit, palabra)
      .subscribe(res => {
        if (!res.success) {
          this.showMessage({ isSuccess: res.success, message: res.message })
        }

        this.clients = res.value!;
        this.canPagination = this.clients.length === limit;
        this.isLoading = false;
      })

  }


  showMessage(message: Message) {

    this.message = message;

    setTimeout(() => {
      this.message = null;

    }, 4000);
  }



  increaseOffset(number: number) {
    this.paginationService.setOffset(number);
    this.getClients();

  }
  decreaseOffset(number: number) {
    this.paginationService.setOffset(number);
    this.getClients()
  }



  //==================================================================

  onSearch(event: any): void {
    event.preventDefault();
    if (this.PaginationForm.invalid) {
      this.PaginationForm.markAllAsTouched();
      return;
    }

    this.paginationService.setOffset(0);
    this.paginationService.setPalabra(this.getNombreCliente);
    this.getClients();
    const { offset, limit, palabra } = this.paginationService.getParameterPagination();

    this.PaginationForm.reset({ offset, limit, nombreCliente: palabra });
  }

  get getNombreCliente(): string {
    const value = this.PaginationForm.get('nombreCliente')?.value;
    return value as string;
  }
  // setNombreCliente(nombreCliente: string): void {
  //   this.PaginationForm.get('nombreCliente')?.setValue(nombreCliente);
  // }
  getOffset() {

    return this.paginationService.getOffsett();
  }
}
