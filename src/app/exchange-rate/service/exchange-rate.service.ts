import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { catchError, Observable, of, tap } from 'rxjs';
import { CommonResponse } from '../../clients/interface/client.interface';
import { ExchangeRate, PaginationExchangeRate } from '../interfaces/exchange-rate.interface';
import { HelperService } from '../../shared/service/helper.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private baseUrl: String = environments.baseUrl + '/tipoCambio';
  constructor(private http: HttpClient, private helperService: HelperService) { }

  updateExchangeRate(exchangeRate: ExchangeRate): Observable<CommonResponse<ExchangeRate>> {
    return this.http.patch<CommonResponse<ExchangeRate>>(`${this.baseUrl}/update`, exchangeRate)
      .pipe(
        catchError(err => this.helperService.catchErrorP<ExchangeRate>(err.error.detail))
      );
  }



  deleteExchangeRate({ codigoMoneda, fecha, codigoBanco }: any): Observable<CommonResponse<String>> {

    const url = `${this.baseUrl}/delete?codigoMoneda=${codigoMoneda}&fecha=${fecha}&codigoBanco=${codigoBanco}`;
    return this.http.delete<CommonResponse<String>>(url).pipe(
      tap(res => console.log(res)),
      catchError(err => this.helperService.catchErrorP<String>(err.error.detail))
    );
  }


  createExchangeRate(exchangeRate: ExchangeRate): Observable<CommonResponse<ExchangeRate>> {
    return this.http.post<CommonResponse<ExchangeRate>>(`${this.baseUrl}/create`, exchangeRate)
      .pipe(
        catchError(err => this.helperService.catchErrorP<ExchangeRate>(err.error.detail))
      );
  }

  getExchangeRate({ codigoMoneda, fecha, codigoBanco }: { codigoMoneda: string, fecha: string, codigoBanco: string }): Observable<CommonResponse<ExchangeRate>> {
    const url = `${this.baseUrl}/get?codigoMoneda=${codigoMoneda}&fecha=${fecha}&codigoBanco=${codigoBanco}`;

    return this.http.get<CommonResponse<ExchangeRate>>(url)
      .pipe(
        tap(res => console.log('Tipo de cambio:')),
        tap(res => console.log(res)),
        catchError(err => this.helperService.catchErrorP<ExchangeRate>(err.error.detail))
      );
  }

  getExchangeRates(
    { offset,
      limit,
      codigoMoneda,
      fecha,
      codigoBanco
    }: PaginationExchangeRate): Observable<CommonResponse<ExchangeRate[]>> {

    let url = `${this.baseUrl}?offset=${offset}&limit=${limit}`;

    if (codigoMoneda) url += `&codigoMoneda=${codigoMoneda}`;

    if (fecha) url += `&fecha=${fecha}`;

    if (codigoBanco) url += `&codigoBanco=${codigoBanco}`;

    return this.http.get<CommonResponse<ExchangeRate[]>>(url)
      .pipe(
        catchError(err => this.helperService.catchErrorP<ExchangeRate[]>(err.error.detail))
      );
  }


}
