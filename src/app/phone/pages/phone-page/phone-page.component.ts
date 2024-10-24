import { Component, OnInit } from '@angular/core';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalUrl } from '../../../shared/constants/constants';
import { BanksService } from '../../../banks/services/banks.service';
import { TelefonoService } from '../../../shared/service/telefono.service';
import { TelefonoInfo } from '../../../shared/interfaces/telefonoInfo.interface';

@Component({
  selector: 'app-phone-page',
  templateUrl: './phone-page.component.html',
  styleUrl: './phone-page.component.css'
})
export class PhonePageComponent implements OnInit {
  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;
  //Arreglos y obj seleccionados


  public codigoEntidad: any = 0;
  // Formulario
  public phoneForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private messageManagerService: MessageManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private banksService: BanksService,
    private telefonoService: TelefonoService
  ) {

    this.initValueForm();
  }
  ngOnInit(): void {
    this.configureFormByRoute();
  }

  initValueForm(): void {
    54321433
    this.phoneForm = this.fb.group({
      codigoTelefono: ['', []],
      numero: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      codigoBanco: [null],
      codigoCliente: [null]
    });

  }
  configureFormByRoute(): void {

    if (this.router.url.includes(LocalUrl.REGISTER)) {
      this.title = 'Agregar'
      this.activatedRoute.params
        .subscribe(({ codigoEntidad, entidad }) => {
          if (entidad === 'C') {
            this.phoneForm.get('codigoCliente')?.setValue(codigoEntidad)
            return;

          }
          this.phoneForm.get('codigoBanco')?.setValue(codigoEntidad)
        });
      return;
    }
    if (this.router.url.includes(LocalUrl.EDIT)) {
      this.title = 'Editar'
      this.phoneForm.get('codigoTelefono')?.disable();
    } else {
      this.phoneForm.disable();
    }
    this.loadPhone();

  }

  loadPhone(): void {

    this.activatedRoute.params
      .subscribe(({ codigo, numero, codigoEntidad }) => {

        this.phoneForm.reset({ codigoTelefono: codigo, numero  });




      }
      )

  }

  // METODOS DE VALIDACION Y MENSAJES FORMULARIO
  isValidField(field: string) {
    return this.validatorsService.isValidField(this.phoneForm, field);
  }

  getFieldOfGroupError(field: string) {
    return this.messageManagerService.getFieldOfGroupError(field, this.phoneForm);;
  }
  onSubmit(): void {

    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      return;
    }


    this.isLoading = true;


    // if (this.title === "Editar") {

    //   // this.telefonoService.editPhone(this.currentTelefono)
    //   //   .subscribe(({ message, success: isSuccess }) => {
    //   //     this.messageManagerService.simpleBox({ message, isSuccess })
    //   //     this.isLoading = false;
    //   //   });
    //   return;
    // }


    this.telefonoService.createPhoneBank(this.currentTelefono)
      .subscribe(({ message, success: isSuccess }) => {
        this.isLoading = false;
        this.messageManagerService.simpleBox({ message, success: isSuccess })
        if (!isSuccess) return;
        this.phoneForm.reset({
          codigoProvincia: '',
          nombre: '',
          codigoBanco: this.currentTelefono.codigoBanco,
          codigoCliente: this.currentTelefono.codigoCliente
        });
      });


  }


  get currentTelefono(): TelefonoInfo {
    const form = this.phoneForm;



    return {
      ...form.value,
      codigoBanco: form.get('codigoBanco')?.value,
      codigoCliente: Number(form.get('codigoCliente')?.value)
    };
  }

}
