import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HelperService } from '../../shared/service/helper.service';
import { catchError, Observable, throwError } from 'rxjs';
import { CommonResponse } from '../../clients/interface/client.interface';
import { Provincia } from '../../shared/interfaces/provincia.interface';
import { Ubication } from '../interface/ubication.interface';

@Injectable({
  providedIn: 'root'
})
export class ProvincieService {
  private baseUrl: String = environments.baseUrl + '/ubicacion';
  constructor(private http: HttpClient, private helperService: HelperService) { }


  getProvincie(code: number): Observable<CommonResponse<Provincia>> {

    return this.http.get<CommonResponse<Provincia>>(`${this.baseUrl}/provincia?code=${code}`)
      .pipe(
        catchError(err => this.helperService.catchErrorP2<Provincia>(err))
      );
  }

  updateUbication(ubication: Ubication): Observable<CommonResponse<Ubication>> {

    return this.http.patch<CommonResponse<Ubication>>(`${this.baseUrl}/${ubication.codigo}`, ubication)
      .pipe(
        catchError(err => this.helperService.catchErrorP<Ubication>(err)),
        // catchError(err => this.helperService.catchErrorP<Ubication>(err.error.detail)),
        // catchError(this.handleError)
      );

  }



}
