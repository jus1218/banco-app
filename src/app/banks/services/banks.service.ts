import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { map, Observable, tap } from 'rxjs';
import { CommonResponse, CommonResponseV } from '../../shared/interfaces/common-response.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Bank, Telefono } from '../interfaces/bank.interface';
import { BankInfo } from '../interfaces/bankinfo.interface';

@Injectable({
  providedIn: 'root'
})
export class BanksService {

  private baseUrl: String = environments.baseUrl;

  constructor(private http: HttpClient) { }


  getBancos(offset: number, limit: number, nombre: string | null): Observable<Bank[]> {
    const name: string = nombre ?? '';
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('nombre', name);

    return this.http.get<CommonResponse<Bank>>(`${this.baseUrl}/bancos`, { params })
      .pipe(
        tap(response => console.log('Datos recibidos:', response)),
        map(res => res.value),
        tap(banks => console.log(banks),
        )
      )

  }

  getBanco(id: string): Observable<BankInfo> {

    const url: string = `${this.baseUrl}/bancos/search/${id}`;

    return this.http.get<CommonResponseV<BankInfo>>(url).pipe(
      tap(response => console.log('Datos recibidos:', response)),
      map(res => res.value),);
  }

  getPhonesByCodeBank(codigoBanco: string): Observable<Telefono[]> {
    const url: string = `${this.baseUrl}/bancos/phones/${codigoBanco}`;

    return this.http.get<CommonResponse<Telefono>>(url).pipe(
      tap(response => console.log('Datos recibidos:', response)),
      map(res => res.value),);

  }

}
