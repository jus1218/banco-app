import { Component, OnInit } from '@angular/core';
import { BankInfo } from '../../interfaces/bankinfo.interface';
import { BanksService } from '../../services/banks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UbicationService } from '../../../shared/service/ubication.service';
import { Telefono } from '../../interfaces/bank.interface';
import { Provincia2 } from '../../../shared/interfaces/provincia.interface';
import { MessageManagerService } from '../../../shared/service/message-manager.service';

@Component({
  selector: 'app-bank-page',
  templateUrl: './bank-page.component.html',
  styleUrl: './bank-page.component.css'
})
export class BankPageComponent implements OnInit {
  public bank?: BankInfo;
  public telefonos?: Telefono[];
  public provincia?: Provincia2 | undefined;
  public moneda?: string;

  constructor(
    private banksService: BanksService,
    private ubicationService: UbicationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageManagerService: MessageManagerService,) { }

  ngOnInit(): void {
    // this.activatedRoute.params
    //   .pipe(
    //     switchMap(({ id, moneda }) => {
    //       this.moneda = moneda;


    //       return this.banksService.getBanco(id);
    //     }),
    //     switchMap(({ message, success: isSuccess, value }) => {
    //       if (!isSuccess) {
    //         this.messageManagerService.simpleBox({ message, isSuccess })
    //         this.isLoading = false;
    //         this.router.navigate(['/provinces/list']);
    //         return;
    //       }


    //       this.provincia = this.ubicationService.getProvinciaCantonbyIdDistrito(bank.codigoDistrito);
    //       return this.banksService.getPhonesByCodeBank(bank.codigoBanco)
    //     })
    //   )
    //   .subscribe(res => {
    //     // if (!telefonos) return this.router.navigate(['/bancos/list']);
    //     // this.telefonos = res.;
    //     return;
    //   })
  }

  goBack(): void {
    this.router.navigateByUrl('bancos/list')
  }


}
