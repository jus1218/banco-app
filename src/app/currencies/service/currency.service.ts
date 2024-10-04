import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CommonResponse } from '../../clients/interface/client.interface';
import { Currency } from '../interface/currency.interface';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {


  private baseUrl: String = environments.baseUrl + '/moneda';
  constructor(private http: HttpClient) { }


  createCurrency(currency: Currency): Observable<CommonResponse<Currency>> {
    if (!currency) return this.catchErrorP<Currency>('Moneda invalida');

    return this.http.post<CommonResponse<Currency>>(`${this.baseUrl}/create`, currency)
      .pipe(
        catchError(err => this.catchErrorP<Currency>(err.error.detail))
      );
  }
  updateCurrency(currency: Currency): Observable<CommonResponse<Currency>> {
    if (!currency) return this.catchErrorP<Currency>('Moneda invalida');

    return this.http.patch<CommonResponse<Currency>>(`${this.baseUrl}/${currency.codigoMoneda}`, currency)
      .pipe(
        catchError(err => this.catchErrorP<Currency>(err.error.detail))
      );
  }


  getCurrency(codigoMoneda: string): Observable<CommonResponse<Currency>> {

    if (!codigoMoneda) return this.catchErrorP<Currency>('Codigo moneda invalido');

    return this.http.get<CommonResponse<Currency>>(`${this.baseUrl}/${codigoMoneda}`)
      .pipe(
        catchError(err => this.catchErrorP<Currency>(err.error.detail))
      );

  }


  getCurrencies(offset: number, limit: number, nombre: string | null): Observable<CommonResponse<Currency[]>> {
    const name: string = nombre ?? '';
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('nombre', name);
    return this.http.get<CommonResponse<Currency[]>>(`${this.baseUrl}`, { params })
      .pipe(
        catchError(err => this.catchErrorP<Currency[]>(err.error.detail))
      );
  }



  catchErrorP<T>(messsage: string): Observable<CommonResponse<T>> {
    const message: CommonResponse<T> = {
      value: null,
      message: messsage,
      success: false
    }
    return of(message);
  }
}
