import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UbicationService } from '../../../shared/service/ubication/ubication.service';
import { Canton, Provincia, Provincia2 } from '../../../shared/interfaces/provincia.interface';
import { filter, Subscription, switchMap, tap } from 'rxjs';
import { Bank, Distrito } from '../../interfaces/bank.interface';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BanksService } from '../../services/banks.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  public myForm: FormGroup;
  private provinciaSubscription!: Subscription;
  private cantonSubscription!: Subscription;
  public cantonesByProvincia: Canton[] = [];
  public distritosByCanton: Distrito[] = [];

  public bancoEdit: Provincia2 | undefined;

  constructor(
    private fb: FormBuilder,
    private ubicationService: UbicationService,
    private validatorsService: ValidatorsService,
    private messageManagerService: MessageManagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private banksService: BanksService
  ) {
    this.myForm = this.fb.group({
      codigoBanco: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(1)],],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      direccionExacta: ['', [Validators.required, Validators.maxLength(254)]],
      provincia: [0, [Validators.required, Validators.min(1)]],
      canton: [0, [Validators.required, Validators.min(1)]],
      distrito: [0, [Validators.required, Validators.min(1)]]
    })
  }
  ngOnInit(): void {


    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.banksService.getBanco(id))
      ).subscribe(banco => {
        if (!banco) return;

        // this.myForm.get('codigoBanco')?.setValue(banco.codigoBanco);
        // this.myForm.get('nombre')?.setValue(banco.nombre);

        this.myForm.reset(banco)



        this.bancoEdit = this.ubicationService.getProvinciaCantonbyIdDistrito(banco.codigoDistrito);
        if (!this.bancoEdit) return;

        this.myForm.get('provincia')?.setValue(this.bancoEdit?.codigoProvincia);
        this.cantonesByProvincia = this.ubicationService.getCantones(this.bancoEdit!.codigoProvincia);
        this.myForm.get('canton')?.setValue(this.bancoEdit?.canton.codigoCanton);
        this.myForm.get('distrito')?.setValue(this.bancoEdit?.canton.distrito.codigoDistrito);
        this.distritosByCanton = this.ubicationService.getDistritos(this.bancoEdit!.canton.codigoCanton);


        // this.myForm.reset(banco);
        this.onProvinciaChanged();
        this.onCantonChanged();
        return;
      });



  }

  ngOnDestroy(): void {
    if (this.provinciaSubscription) {
      this.provinciaSubscription.unsubscribe();
    }
    if (this.cantonSubscription) {
      this.cantonSubscription.unsubscribe();
    }
  }

  get provincias(): Provincia[] {
    return this.ubicationService.getProvincias;
  }

  onProvinciaChanged() {
    this.provinciaSubscription = this.myForm.get('provincia')!.valueChanges
      .pipe(
        tap(() => this.myForm.get("canton")!.setValue(0)),
        tap(() => this.cantonesByProvincia = []),
        filter(value => value.length > 0)//evita que se haga llamados si el valor es vacio
      )
      .subscribe(idProvincia => {

        console.log("idprovincia: " + !idProvincia);
        console.log("idprovincia: " + idProvincia);

        const id = idProvincia as number;

        this.cantonesByProvincia = this.ubicationService.getCantones(id);
      })
  }
  onCantonChanged() {
    this.cantonSubscription = this.myForm.get('canton')!.valueChanges
      .pipe(
        tap(() => this.myForm.get("distrito")!.setValue(0)),
        tap(() => this.distritosByCanton = []),
        filter(value => value.length > 0)//evita que se haga llamados si el valor es vacio
      )
      .subscribe(idCanton => {

        console.log("idprovincia: " + !idCanton);
        const id = idCanton as number;
        this.distritosByCanton = this.ubicationService.getDistritos(id)
      })
  }
  isValidField(field: string) {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {

    const message = this.messageManagerService.getFieldError(field, this.myForm);
    return message;
  }


  get currentBank(): Bank {
    const hero = this.myForm.value as Bank;
    return hero;
  }

  onSubmit():void{}
}
