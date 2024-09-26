import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private myForm: FormGroup | null;
  constructor() {

    this.myForm = null;
  }


  setForm(myForm: FormGroup) {
    this.myForm = myForm;

  }
  setOffset(value: number): void {
    this.myForm?.get('offset')?.setValue(value);
  }

  setLimit(value: number): void {
    this.myForm?.get('limit')?.setValue(value);
  }

  getOffset(): number {
    return this.myForm?.get('offset')?.value as number ?? 0;

  }
  getLimit(): number {
    return this.myForm?.get('limit')?.value as number ?? 5;
  }
  getParameterPagination(): {
    offset: number;
    limit: number;
  } {
    return {
      'offset': this.getOffset(),
      'limit': this.getLimit()
    }
  }

  getDestinePage(): number {

    const offset = this.myForm?.get('offset')?.value as number ?? 0;
    const limit = this.myForm?.get('limit')?.value as number ?? 5;

    return offset * limit;
  }

  canPagination(length:number): Boolean {
    return length === this.getLimit();

  }
}
