import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Client, ClienteCreateUpdate, ClienteInfo, CommonResponse } from '../interface/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl: String = environments.baseUrl + '/clientes';

  constructor(private http: HttpClient) { }

  getClientes(offset: number, limit: number, nombre: string | null): Observable<CommonResponse<Client[]>> {

    const name: string = nombre ?? '';
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('nombre', name);

    return this.http.get<CommonResponse<Client[]>>(`${this.baseUrl}`, { params })
      .pipe(

        catchError(err => {
          const message: CommonResponse<Client[]> = {
            value: [],
            message: err.error.detail,
            success: false
          }
          return of(message);
        })
      );
  }

  createCliente(cliente: ClienteCreateUpdate): Observable<CommonResponse<ClienteCreateUpdate>> {

    return this.http.post<CommonResponse<ClienteCreateUpdate>>(`${this.baseUrl}/create`, cliente)
      .pipe(
        catchError(err => {
          const message: CommonResponse<ClienteCreateUpdate> = {
            value: null,
            message: err.error.detail,
            success: false
          }
          return of(message);
        })
      );

  }
  updatCliente(cliente: ClienteCreateUpdate): Observable<CommonResponse<ClienteCreateUpdate>> {

    return this.http.patch<CommonResponse<ClienteCreateUpdate>>(`${this.baseUrl}/${cliente.codigoCliente}`, cliente)
      .pipe(
        catchError(err => {
          const message: CommonResponse<ClienteCreateUpdate> = {
            value: null,
            message: err.error.detail,
            success: false
          }
          return of(message);
        })
      );

  }



  getCliente(id: number): Observable<CommonResponse<ClienteInfo>> {

    if (!id) return this.catchErrorP("id invalido");

    return this.http.get<CommonResponse<ClienteInfo>>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(err => this.catchErrorP(err.error.detail))
      );
  }


  catchErrorP(messsage: string): Observable<CommonResponse<ClienteInfo>> {



    const message: CommonResponse<ClienteInfo> = {
      value: null,
      message: messsage,
      success: false
    }
    return of(message);
  }

}
