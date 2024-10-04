import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Telefono, TelefonoCreateUpdate } from '../../banks/interfaces/bank.interface';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { CommonResponseV } from '../interfaces/common-response.interface';
import { TelefonoInfo } from '../interfaces/telefonoInfo.interface';
import { ResponseError } from '../interfaces/response-error.interface';
import { Message } from '../interfaces/message.interface';
import { CommonResponse } from '../../clients/interface/client.interface';

@Injectable({
  providedIn: 'root'
})
export class TelefonoService {

  private baseUrl: String = environments.baseUrl + '/telefonos';

  constructor(private http: HttpClient) { }




  createPhoneBank(newPhone: TelefonoInfo): Observable<CommonResponseV<TelefonoInfo>> {
    return this.createPhone(newPhone);
  }

  createPhone(newPhone: TelefonoInfo): Observable<CommonResponseV<TelefonoInfo>> {

    return this.http.post<any>(`${this.baseUrl}/create`, newPhone).pipe(
      catchError((error) => {

        const message: CommonResponseV<TelefonoInfo> = {
          value: null,
          message: error.error.detail,
          success: false
        }
        return of(message)
      })
    );
  }

  deletePhone(numero: string): Observable<CommonResponseV<TelefonoInfo>> {

    return this.http.delete<CommonResponseV<TelefonoInfo>>(`${this.baseUrl}/${numero}`).pipe();
  }

  editPhone(telefono: TelefonoCreateUpdate): Observable<CommonResponseV<String> | ResponseError> {

    return this.http.patch<CommonResponseV<String>>(`${this.baseUrl}/${telefono.numero}`, telefono)
      .pipe(
        catchError((error: ResponseError) => of(error))
      );
  }

  getPhonesByCodeClient(id: number): Observable<CommonResponse<Telefono[]>> {
    if (!id) return this.catchErrorP("id invalido");

    return this.http.get<CommonResponse<Telefono[]>>(`${this.baseUrl}/client/${id}`)
      .pipe(
        tap(res => console.log(res)),
        catchError(err => this.catchErrorP(err.error.detail))
      );
  }

  catchErrorP(messsage: string): Observable<CommonResponse<Telefono[]>> {
    return of({
      value: null,
      message: messsage,
      success: false
    });
  }

}
