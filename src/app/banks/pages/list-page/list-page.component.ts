import { Component, Input, OnInit } from '@angular/core';
import { BanksService } from '../../services/banks.service';
import { Bank } from '../../interfaces/bank.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from '../../../shared/service/pagination/pagination.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {

  public banks: Bank[] = [];
  public myForm: FormGroup;
  constructor(
    private banksService: BanksService,
    private fb: FormBuilder,
    protected paginationService: PaginationService) {

    this.myForm = this.fb.group({
      offset: [paginationService.getOffset(), [Validators.required, Validators.min(0)]],
      limit: [paginationService.getLimit(), [Validators.required, Validators.min(1)]],
      nombre: ['', [Validators.minLength(1)]],
    })
  }


  ngOnInit(): void {
    this.paginationService.setForm(this.myForm)
    const { offset, limit } = this.paginationService.getParameterPagination();
    this.banksService.getBancos(offset, limit, null).subscribe(banks => this.banks = banks);

  }
  getBancos(offset: number, limit: number, nombre: string | null): void {
    this.banksService.getBancos(offset, limit, nombre?.length === 0 ? null : nombre).subscribe(banks => this.banks = banks);
  }

  increaseOffset(number: number) {
    this.paginationService.setOffset(number);
    this.getBancos(this.paginationService.getDestinePage(), this.paginationService.getLimit(), this.getNombre())

  }
  decreaseOffset(number: number) {
    this.paginationService.setOffset(number);
    this.getBancos(this.paginationService.getDestinePage(), this.paginationService.getLimit(), this.getNombre())
  }

  setNombre(myForm: FormGroup, value: String | null) {
    myForm.get('nombre')?.setValue(value);
  }

  getNombre(): string {
    return this.myForm.get('nombre')?.value as string;
  }




  onSave(): void {

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);
    this.getBancos(this.paginationService.getOffset(), this.paginationService.getLimit(), this.getNombre())
    this.myForm.reset({ offset: 0, limit: 5, nombre: this.getNombre() });

  }

  canPagination(): Boolean {
    return this.paginationService.canPagination(this.banks.length);

  }
}
