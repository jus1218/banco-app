import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Canton, Provincia } from '../../../shared/interfaces/provincia.interface';
import { filter, switchMap, tap } from 'rxjs';
import { BankCreateUpdate, Distrito, Moneda } from '../../interfaces/bank.interface';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BanksService } from '../../services/banks.service';
import { Message } from '../../../shared/interfaces/message.interface';
import { TitlePage } from '../../../shared/interfaces/title-page.interface';
import { SelectorService } from '../../../shared/service/selector.service';
import { CurrentBank } from '../../interfaces/current-bank.interface';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent implements OnInit {
  // Variables visuales
  public title: TitlePage = 'Información';
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  //Arreglos y obj seleccionados
  public provincias: Provincia[] = [];
  public cantones: Canton[] = [];
  public distritos: Distrito[] = [];
  public monedas: Moneda[] = [];

  // Formulario
  public bankForm!: FormGroup;

  //Otros
  public provinciaSelected?: Provincia;
  public cantonSelected?: Canton;

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private messageManagerService: MessageManagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private banksService: BanksService,
    private selectorService: SelectorService,

  ) {
    this.initValuesForm();
  }

  initValuesForm(): void {
    this.bankForm = this.fb.group({
      codigoBanco: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(1)],],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      codigoMoneda: ['', [Validators.required, Validators.min(1)],],
      codigoDistrito: [0, [Validators.required, Validators.min(1)]],
      direccionExacta: ['', [Validators.required, Validators.maxLength(254)]],
      //Adicionales
      codigoProvincia: [0, [Validators.required, Validators.min(1)]],
      codigoCanton: [0, [Validators.required, Validators.min(1)]],
      telefonos: this.fb.array([])
    });
  }


  ngOnInit(): void {
    this.configureFormByRoute();
    this.onProvinciaChanged();
    this.onCantonChanged();
  }
  configureFormByRoute(): void {
    if (this.router.url.includes('register')) {
      this.title = 'Agregar'
      this.loadDataSelector();

      return;
    }
    if (this.router.url.includes('edit')) {
      this.title = 'Editar'
      this.bankForm.get('codigoBanco')?.disable();
    } else {
      this.bankForm.disable();
    }
    this.loadBank();
  }


  loadDataSelector(): void {

    this.selectorService.getAll().subscribe(({ message, success: isSuccess, value }) => {

      if (!isSuccess) {
        this.messageManagerService.simpleBox({ message, success: isSuccess })
        this.isLoading = false;
        this.router.navigate(['/banks/list']);
      }
      this.monedas = value?.monedas!;
      this.provincias = value?.provincias!;

    });

  }

  loadBank(): void {

    this.isLoading = true;

    this.activatedRoute.params.pipe(
      switchMap((id) => this.selectorService.getAll()
        .pipe(switchMap(({ message, success: isSuccess, value }) => {

          if (!isSuccess) {
            this.messageManagerService.simpleBox({ message, success: isSuccess })
            this.isLoading = false;
            this.router.navigate(['/banks/list']);

            return this.banksService.getBanco(id['id']);
          }

          this.monedas = value?.monedas!;
          this.provincias = value?.provincias!;
          return this.banksService.getBanco(id['id']);
        }))),
    ).subscribe(({ message, success: isSuccess, value }) => {
      if (!isSuccess) {
        this.messageManagerService.simpleBox({ message, success: isSuccess })
        this.isLoading = false;
        this.router.navigate(['/banks/list']);
        return;
      }


      this.bankForm.reset({ ...value });
      const provincia = this.provincias.find(p => p.cantones.find(c => c.distritos.find(d => d.codigoDistrito === value?.codigoDistrito)));
      const canton = provincia?.cantones.find(c => c.distritos.find(d => d.codigoDistrito === value?.codigoDistrito));

      this.bankForm.get('codigoProvincia')?.setValue(provincia?.codigoProvincia);
      this.findCantons(provincia!.codigoProvincia);
      this.bankForm.get('codigoCanton')?.setValue(canton?.codigoCanton);
      this.findDistricts(canton!.codigoCanton);
      this.bankForm.get('codigoDistrito')?.setValue(value?.codigoDistrito);

      this.isLoading = false;
    })
  }


  onProvinciaChanged() {
    this.bankForm.get('codigoProvincia')!.valueChanges
      .pipe(
        tap(() => this.bankForm.get("codigoCanton")!.setValue(0)),
        tap(() => this.cantones = []),
        filter(value => {
          if (!value) return false;
          return value.length > 0
        })//evita que se haga llamados si el valor es vacio
      )
      .subscribe(idProvincia => this.findCantons(idProvincia));
  }

  findCantons(idProvincia: number): void {
    const cantones = this.provincias.find(p => p.codigoProvincia === Number(idProvincia))?.cantones;
    if (!cantones) {
      this.cantones = [];
      return;
    }
    this.cantones = cantones;

  }
  findDistricts(idCanton: number): void {
    const distritos = this.cantones.find(c => c.codigoCanton === Number(idCanton))?.distritos;
    if (!distritos) {
      this.distritos = [];
      return;
    }
    this.distritos = distritos;

  }
  onCantonChanged() {
    this.bankForm.get('codigoCanton')!.valueChanges
      .pipe(
        tap(() => this.bankForm.get('codigoDistrito')!.setValue(0)),
        tap(() => this.distritos = []),
        filter(value => {
          if (!value) return false;
          return value.length > 0
        })//evita que se haga llamados si el valor es vacio
      )
      .subscribe(idCanton => this.findDistricts(idCanton));
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.bankForm, field);
  }


  getFieldOfGroupError(field: string) {
    const message = this.messageManagerService.getFieldOfGroupError(field, this.bankForm);
    return message;
  }




  isValidFieldInArray(formArray: FormArray, index: number) {
    return this.validatorsService.isValidFieldInArray(formArray, index);
  }


  get currentBank(): CurrentBank {
    const form = this.bankForm;
    return {
      ...form.value,
      codigoBanco: String(form.get('codigoBanco')?.value).toUpperCase(),
      codigoProvincia: Number(form.get('codigoProvincia')?.value),
      codigoDistrito: Number(form.get('codigoDistrito')?.value),
      codigoCanton: Number(form.get('codigoCanton')?.value),

    };
  }
  get telefonos() {
    return this.bankForm.get('telefonos') as FormArray;
  }

  onSubmit(): void {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }

    if (this.title === "Editar") {

      this.banksService.updateBanco(this.currentBank)
        .subscribe(({ message, success: isSuccess }) => {
          this.messageManagerService.simpleBox({ message, success: isSuccess })
          this.isLoading = false;
        });
      return;
    }



    this.banksService.createBanco(this.currentBank).subscribe(({ message, success: isSuccess }) => {
      this.messageManagerService.simpleBox({ message, success: isSuccess })
      if (!isSuccess) return;
      this.bankForm.reset({
        codigoBanco: "",
        nombre: "",
        codigoMoneda: "",
        codigoDistrito: 0,
        direccionExacta: "",
        codigoProvincia: 0,
        codigoCanton: 0,
      });
    });
  }

  get banco(): BankCreateUpdate {
    const { codigoBanco, codigoDistrito, codigoMoneda, direccionExacta, nombre } = this.currentBank;
    return {
      codigoBanco, codigoDistrito, codigoMoneda, direccionExacta, nombre
    };
  }




  // onDeletePhone(index: number): void {
  //   const numero = this.telefonos.at(index).value as string;
  //   this.telefonoService.deletePhone(numero).subscribe(res => {
  //     this.telefonos.removeAt(index);
  //     // this.showMessage(res.message, res.success);

  //   })
  // }
  // onEditPhone(index: number): void {
  //   const numero = this.telefonos.at(index).value as string;
  //   this.telefonoService.editPhone(
  //     {
  //       numero,
  //       codigoBanco: this.bankForm.get('codigoBanco')!.value as String,
  //       codigoCliente: null
  //     }).subscribe((res: CommonResponseV<String> | ResponseError) => {



  //     })
  // }


  // onAddPhones(telefonos: Telefono[]): void {

  //   if (!telefonos) return;
  //   telefonos.forEach(telefono => {
  //     this.telefonos.push(new FormControl<String>(telefono.numero, this.validatorsService.phoneIsValid));
  //   });

  // }

  // onAddPhone(): void {
  //   if (this.newPhone.invalid) return;

  //   const newNumberPhone = this.newPhone.value;

  //   this.telefonoService.createPhoneBank(
  //     {
  //       numero: newNumberPhone,
  //       codigoBanco: this.bankForm.get('codigoBanco')!.value as string,
  //       codigoTelefono: null,
  //       codigoCliente: null
  //     }).subscribe(res => {
  //       // this.showMessage(res.message, res.success);
  //       if (!res.success) return;


  //       this.telefonos.push(this.fb.control(res.value!.numero, this.validatorsService.phoneIsValid));
  //       this.newPhone.reset('');
  //     })
  // }


  // isTouched(index: number): boolean {
  //   return this.validatorsService.istouchedFieldInArray(this.telefonos, index);
  // }



}


