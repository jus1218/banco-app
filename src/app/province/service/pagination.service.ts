import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProvinciaPaginationFilter } from '../../shared/interfaces/provincie-pagination-filter.interface';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private currentPaginationSource = new BehaviorSubject<ProvinciaPaginationFilter>({ offset: 0, limit: 5, nombre: '' });
  currentPagination$ = this.currentPaginationSource.asObservable();

  // Método para actualizar el valor de currentPagination
  updatePagination(value: ProvinciaPaginationFilter) {
    this.currentPaginationSource.next(value);
  }
  constructor() { }
}
