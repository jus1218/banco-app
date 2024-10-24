import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Bank } from '../../interfaces/bank.interface';
import { TelefonoService } from '../../../shared/service/telefono.service';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { of, switchMap } from 'rxjs';
import { BanksService } from '../../services/banks.service';

@Component({
  selector: 'bank-table-banks',
  templateUrl: './table-banks.component.html',
  styleUrl: './table-banks.component.css'
})
export class TableBanksComponent {
  @Input()
  public banks!: Bank[];

  @Output() eventoCargarBancos = new EventEmitter<void>();

  public isLoading: boolean = false;

  constructor(
    private banksService: BanksService,
    private sms: MessageManagerService
  ) {

  }

  onDelete(codigoBanco: string) {

    this.sms.confirmBox({})
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return of();
          this.isLoading = true;
          // Solicitud de eliminacion
          return this.banksService.deleteBank(codigoBanco);
        }),

      ).subscribe(({ message, success: isSuccess }) => {
        this.sms.simpleBox({ message, success: isSuccess });

        if (!isSuccess) return;
        this.eventoCargarBancos.emit();
      });
  }

}
