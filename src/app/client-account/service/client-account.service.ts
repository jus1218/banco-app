import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { CommonResponse } from '../../clients/interface/client.interface';
import { ClientAccount, ClientAccountInfo } from '../interfaces/client-account.interface';
import { HelperService } from '../../shared/service/helper.service';
import { CurrentClientAccount } from '../interfaces/current-client-account';

@Injectable({
  providedIn: 'root'
})
export class ClientAccountService {

  private baseUrl: String = environments.baseUrl + '/cuenta-cliente';

  constructor(private http: HttpClient, private helperService: HelperService) { }

  getClientAccounts({ offset, limit, codigoCliente }: { offset: number, limit: number, codigoCliente: number | null }): Observable<CommonResponse<ClientAccount[]>> {

    offset = offset * limit;

    let url = `${this.baseUrl}?offset=${offset}&limit=${limit}`;

    if (codigoCliente) url = `${url}&codigoCliente=${codigoCliente}`;

    const response = this.http.get<CommonResponse<ClientAccount[]>>(url);
    return this.helperService.handleResponse(response);
  }


  getClientAccountById(id: number): Observable<CommonResponse<ClientAccountInfo>> {

    const response = this.http.get<CommonResponse<ClientAccountInfo>>(`${this.baseUrl}/${id}`);
    return this.helperService.handleResponse(response);
  }
  updateClientAccount(clientAccount: CurrentClientAccount): Observable<CommonResponse<ClientAccountInfo>> {

    const url = `${this.baseUrl}/${clientAccount.codigoCuentaCliente}`;
    const response = this.http.patch<CommonResponse<ClientAccountInfo>>(url, clientAccount);
    return this.helperService.handleResponse(response);
  }

  createClientAccount(clientAccount: CurrentClientAccount): Observable<CommonResponse<ClientAccountInfo>> {

    const url = `${this.baseUrl}/create`;
    const response = this.http.post<CommonResponse<ClientAccountInfo>>(url, clientAccount);
    return this.helperService.handleResponse(response);
  }

  deleteClientAccount(id: number): Observable<CommonResponse<ClientAccountInfo>> {

    const response = this.http.delete<CommonResponse<ClientAccountInfo>>(`${this.baseUrl}/${id}`);
    return this.helperService.handleResponse(response);
  }

}
