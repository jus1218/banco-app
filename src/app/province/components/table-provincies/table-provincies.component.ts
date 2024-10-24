import { Component, Input, OnInit } from '@angular/core';
import { ProvinciaDetail } from '../../../shared/interfaces/provincia-detail';
import { Message } from '../../../shared/interfaces/message.interface';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { UbicationService } from '../../../shared/service/ubication.service';
import { switchMap } from 'rxjs';
import { TypeUbication } from '../../interface/ubication.interface';
import { ProvinciaPaginationFilter } from '../../../shared/interfaces/provincie-pagination-filter.interface';
import { CommonResponse } from '../../../clients/interface/client.interface';
import { PaginationService } from '../../service/pagination.service';

@Component({
  selector: 'app-table-provincies',
  templateUrl: './table-provincies.component.html',
  styleUrl: './table-provincies.component.css'
})
export class TableProvinciesComponent implements OnInit {

  // // Variables visuales
  public isLoading: boolean = false;
  // public canPagination: boolean = false;
  // public message: Message | null = null;
  // Arreglos
  @Input()
  public provincias: ProvinciaDetail[] = [];
  @Input()
  public currentPagination!: ProvinciaPaginationFilter;
  @Input()
  public handleResponse!: (res: CommonResponse<ProvinciaDetail[]>) => void;


  constructor(
    private provinciaService: UbicationService,
    private messageManagerService: MessageManagerService) {

  }
  ngOnInit(): void {
  }


  onDelete(codigo: number): void {

    // Caja de confirmacion
    this.messageManagerService.confirmBox({}).subscribe(confirmed => {
      if (!confirmed) return;
      this.isLoading = true;
      // se procede a eliminar
      this.provinciaService.deleteUbication({ codigo, type: TypeUbication.Provincie }).pipe(
        switchMap(({ message, success: isSuccess }) => {
          //Mensaje si se elimino o no
          this.messageManagerService.simpleBox({ message, success: isSuccess })
          //Cargamos las provincias
          const { offset, limit, nombre } = this.currentPagination;
          return this.provinciaService.getProvincies({ offset: offset * limit, limit, nombre })
        })
      ).subscribe((res) => this.handleResponse(res));
    })


  }



}
