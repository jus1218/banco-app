import { Component, OnInit } from '@angular/core';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, LIMITS } from '../../../shared/constants/constants';
import { EMPTY, of, switchMap } from 'rxjs';
import { TelefonoService } from '../../../shared/service/telefono.service';
import { BanksService } from '../../../banks/services/banks.service';
import { Telefono } from '../../../banks/interfaces/bank.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit {
  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  //Arreglos
  public telefonos: Telefono[] = [];

  // Formulario
  public paginationForm!: FormGroup;


  public codigoEntidad: any = 0;
  public entidad: string = '';

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private messageManagerService: MessageManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private telefonoService: TelefonoService,
    private banksService: BanksService
  ) {

    this.initValueForm();
  }
  ngOnInit(): void {
    this.loadPhones();

  }


  loadPhones(): void {
    this.isLoading = true;

    this.activatedRoute.params
      .pipe(
        switchMap(({ codigo, entidad }) => {

          this.codigoEntidad = codigo;
          this.entidad = entidad;
          if (entidad === 'C') {

            return this.telefonoService.getPhonesByCodeClient(Number(codigo));
          }

          return this.banksService.getPhonesByCodeBank(codigo);
        })
      )
      .subscribe(res => this.onAddPhones(res.value!));

  }

  initValueForm(): void {
    this.paginationForm = this.fb.group(
      {
        offset: [DEFAULT_OFFSET, this.validatorsService.offsetIsValid],
        limit: [DEFAULT_LIMIT, this.validatorsService.offsetIsLimit],
        numero: [EMPTY, [Validators.required,]],
        limites: [LIMITS, []]
      }
    );
  }


  onAddPhones(telefonos: Telefono[]): void {
    this.telefonos = telefonos;
    this.isLoading = false;
  }


  onDelete(numeroTelefono: string): void {

    this.messageManagerService.confirmBox({})
      .pipe(switchMap((confirmed) => {
        if (!confirmed) return of();
        if (this.isLoading) return of();
        this.isLoading = true;
        // Solicitud de eliminacion
        return this.telefonoService.deletePhone(numeroTelefono)
      }),
        switchMap(({ message, success: isSuccess }) => {

          // Muestra mensaje después de eliminar
          this.messageManagerService.simpleBox({ message, success: isSuccess });
          if (this.entidad === 'C') {

            return this.telefonoService.getPhonesByCodeClient(Number(this.codigoEntidad));
          }
          return this.banksService.getPhonesByCodeBank(this.codigoEntidad);
        }
        )).subscribe(res => this.onAddPhones(res.value!));
  }
}
