import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { catchError, delay, map, Observable, of, tap, timeout } from 'rxjs';
import { CommonResponseV } from '../../shared/interfaces/common-response.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Bank, BankCreateUpdate, Moneda, Telefono } from '../interfaces/bank.interface';
import { BankInfo } from '../interfaces/bankinfo.interface';
import { CommonResponse } from '../../clients/interface/client.interface';
import { HelperService } from '../../shared/service/helper.service';

@Injectable({
  providedIn: 'root'
})
export class BanksService {

  private baseUrl: String = environments.baseUrl + '/bancos';

  constructor(private http: HttpClient, private helperService: HelperService) { }


  getBancos(offset: number, limit: number, nombre: string | null): Observable<Bank[]> {
    const name: string = nombre ?? '';
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('nombre', name);

    return this.http.get<CommonResponse<Bank[]>>(`${this.baseUrl}`, { params })
      .pipe(
        tap(response => console.log('Datos recibidos:', response)),
        map(res => res.value!),
        tap(banks => console.log(banks),
        )
      )

  }
  getBancos2(offset: number, limit: number, nombre: string | null): Observable<CommonResponse<Bank[]>> {
    const name: string = nombre ?? '';
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('nombre', name);

    return this.http.get<CommonResponse<Bank[]>>(`${this.baseUrl}`, { params })
      .pipe(
        catchError(err => this.helperService.catchErrorP<Bank[]>(err.error.detail))
      )

  }

  getBanco(id: string): Observable<BankInfo | null> {

    const url: string = `${this.baseUrl}/search/${id}`;

    return this.http.get<CommonResponseV<BankInfo | null>>(url).pipe(
      // tap(response => console.log('Datos recibidos:', response)),
      map(res => res.value),);
  }

  getPhonesByCodeBank(codigoBanco: string): Observable<CommonResponseV<Telefono[]>> {
    const url: string = `${this.baseUrl}/phones/${codigoBanco}`;

    return this.http.get<CommonResponseV<Telefono[]>>(url).pipe(
      // tap(response => console.log('Datos recibidos:', response)),
      // timeout(4000), // Retrasa la ejecución 2 segundos
      // map(res => res),
      catchError((error) => {
        const message: CommonResponseV<Telefono[]> = {
          value: [],
          message: error.error.detail,
          success: false
        }
        return of(message)
      }));

  }


  createBanco(banco: BankCreateUpdate): Observable<CommonResponseV<BankInfo>> {

    return this.http.post<CommonResponseV<BankInfo>>(`${this.baseUrl}/create`, banco);
  }
  updateBanco(banco: BankCreateUpdate): Observable<CommonResponseV<BankInfo>> {

    return this.http.patch<CommonResponseV<BankInfo>>(`${this.baseUrl}/${banco.codigoBanco}`, banco);
  }

  getMonedas(): Observable<CommonResponseV<Moneda[]>> {


    return this.http.get<CommonResponseV<Moneda[]>>(`${environments.baseUrl}/moneda?offset=0&limit=300`).pipe(

      catchError((error) => {

        const message: CommonResponseV<Moneda[]> = {
          value: [],
          message: error.error.detail,
          success: false
        }
        return of(message)
      })
    )
  }

}
