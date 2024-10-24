import { Component, Input } from '@angular/core';
import { ProvinciaPaginationFilter } from '../../../shared/interfaces/provincie-pagination-filter.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from '../../service/pagination.service';

@Component({
  selector: 'app-province-manager',
  templateUrl: './province-manager.component.html',
  styleUrl: './province-manager.component.css'
})
export class ProvinceManagerComponent {
  @Input()
  public canPagination: boolean = false;
  @Input()
  public loadProvincies!: () => void;
  // Formulario
  @Input()
  public paginationForm!: FormGroup;
  @Input()
  public currentPagination!: ProvinciaPaginationFilter;




  constructor(private paginationService: PaginationService) {

  }




  get limites(): number[] {


    return [...this.paginationForm.get('limites')?.value]
  }


  onIncrease(): void {
    this.paginationForm.get('offset')?.setValue(this.currentPagination.offset + 1);
    this.loadProvincies();
  }
  onDecrease(): void {
    this.paginationForm.get('offset')?.setValue(this.currentPagination.offset - 1);
    this.loadProvincies();
  }
  onSearch(event: any): void {
    event.preventDefault();
    this.loadProvincies();
  }

  onChangeLimit(): void {

    this.paginationForm.get('limit')?.valueChanges
      .subscribe(() => {
        this.paginationForm.get('offset')?.setValue(0)
        this.loadProvincies();
      })

  }

  // get currentPagination(): ProvinciaPaginationFilter {
  //   const form = this.paginationForm;

  //   const current = {
  //     offset: Number(form.get('offset')?.value),
  //     limit: Number(form.get('limit')?.value),
  //     nombre: form.get('nombre')?.value
  //   };



  //   // this.paginationService.updatePagination(current);
  //   return current;
  // }

}
