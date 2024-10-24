import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HelperService } from '../../shared/service/helper.service';
import { HttpClient } from '@angular/common/http';
import { CommonResponse } from '../../clients/interface/client.interface';
import { LeagerAccount, LeagerAccount2, LeagerAccountFilter } from '../interfaces/leagerAccount.interface';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeagerAccountsService {
  private baseUrl: String = environments.baseUrl + '/cuenta-contable';
  constructor(private http: HttpClient, private helperService: HelperService) { }


  createLeagerAccount(leagerAccount: LeagerAccount): Observable<CommonResponse<LeagerAccount>> {
    const url = `${this.baseUrl}/create`;
    const response = this.http.post<CommonResponse<LeagerAccount>>(url, leagerAccount);
    return this.helperService.handleResponse(response);
  }

  getLeagerAccountsByPagination({ offset, limit, codigoBanco }: LeagerAccountFilter): Observable<CommonResponse<LeagerAccount2[]>> {
    let url = `${this.baseUrl}?offset=${offset}&limit=${limit}`;
    if (codigoBanco) url = `${url}&codigoBanco=${codigoBanco}`;

    const response = this.http.get<CommonResponse<LeagerAccount2[]>>(url);
    return this.helperService.handleResponse(response);
  }
  updateLeagerAccount(LeagerAccount: LeagerAccount): Observable<CommonResponse<LeagerAccount>> {
    const url = `${this.baseUrl}/${LeagerAccount.codigoCuentaContable}`;
    const response = this.http.patch<CommonResponse<LeagerAccount>>(url, LeagerAccount);
    return this.helperService.handleResponse(response);
  }
  deleteLeagerAccount(id: number): Observable<CommonResponse<LeagerAccount>> {
    const url = `${this.baseUrl}/${id}`;
    const response = this.http.delete<CommonResponse<LeagerAccount>>(url);
    return this.helperService.handleResponse(response);

  }
  getLeagerAccount(id: number): Observable<CommonResponse<LeagerAccount>> {
    const url = `${this.baseUrl}/${id}`;
    const response = this.http.get<CommonResponse<LeagerAccount>>(url);
    return this.helperService.handleResponse(response);
  }
}
