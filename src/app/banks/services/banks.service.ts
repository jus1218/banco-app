import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { map, Observable, tap } from 'rxjs';
import { CommonResponse } from '../../shared/interfaces/common-response.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Bank } from '../interfaces/bank.interface';

@Injectable({
  providedIn: 'root'
})
export class BanksService {

  private baseUrl: String = environments.baseUrl;

  constructor(private http: HttpClient) { }


  getBancos(): Observable<Bank[]> {
    const params = new HttpParams()
      .set('offset', '0')
      .set('limit', '3');
      // .set('nombre', '')
      // .set('distrito', 0);
    return this.http.get<CommonResponse<Bank>>(`${this.baseUrl}/bancos`, { params })
      .pipe(
        tap(response => console.log('Datos recibidos:', response)),
        map(res => res.value),
        tap(banks => console.log(banks),
        )
      )

  }


}
