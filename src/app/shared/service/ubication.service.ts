import { Injectable, OnInit, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap } from 'rxjs';
import { Canton, Distrito, Provincia, Provincia2 } from '../interfaces/provincia.interface';
import { environments } from '../../../environments/environments';
import { CommonResponse as r } from '../interfaces/common-response.interface';
import { DeleteUbication, TypeUbication, Ubication } from '../../province/interface/ubication.interface';
import { HelperService } from './helper.service';
import { CommonResponse } from '../../clients/interface/client.interface';
import { ProvinciaDetail } from '../interfaces/provincia-detail';
import { ProvinciaPaginationFilter } from '../interfaces/provincie-pagination-filter.interface';


@Injectable({
  providedIn: 'root'
})
export class UbicationService implements OnInit {

  private baseUrl: string = environments.baseUrl;
  private nameKey: string = 'provincias';
  private provincias: Provincia[] = [];

  constructor(private http: HttpClient, private helperService: HelperService) {



    if (!(this.getProvinciasFromLocalStorage().length)) {
      this.getProvinciasCantonesDistritos().subscribe(provincias => {
        this.provincias = provincias
        localStorage.setItem(this.nameKey, JSON.stringify(this.provincias))

      });
    }

  }
  ngOnInit(): void {
    this.getProvinciasCantonesDistritos().subscribe(provincias => {
      this.provincias = provincias
      localStorage.setItem(this.nameKey, JSON.stringify(this.provincias))

    });
  }

  get getProvincias(): Provincia[] {
    const result = this.getProvinciasFromLocalStorage().map(provincia => {

      const p: Provincia = {
        codigoProvincia: provincia.codigoProvincia,
        nombre: provincia.nombre,
        cantones: []
      }

      return p;
    });
    return [...result]
  }

  getCantones(idProvincia: number): Canton[] {

    const provincia = this.getProvinciasFromLocalStorage()
      .find(provincia => provincia.codigoProvincia == idProvincia);


    return provincia?.cantones || [];
  }
  getDistritos(idCanton: number): Distrito[] {
    // const distritos = this.getProvinciasFromLocalStorage()
    //   .flatMap(provincia =>
    //     provincia.cantones
    //       .filter(canton => canton.codigoCanton == idCanton)
    //       .flatMap(canton => canton.distritos) // Aplana los distritos
    //   );

    const distritos = this.getProvinciasFromLocalStorage()
      .flatMap(provincia =>
        (provincia.cantones || []) // Verifica que existan cantones
          .filter(canton => canton.codigoCanton == idCanton)
          .flatMap(canton => (canton.distritos || [])) // Verifica que existan distritos
      );


    return distritos;
  }


  getProvinciaCantonbyIdDistrito(id: number): Provincia2 | undefined {

    const provincias = this.getProvinciasFromLocalStorage();

    const resultado = provincias
      .flatMap(provincia => provincia.cantones
        .flatMap(canton => canton.distritos
          .filter(distrito => distrito.codigoDistrito === id)
          .map(distrito => {

            const provinciaEncontrada: Provincia2 = {
              codigoProvincia: provincia.codigoProvincia,
              nombre: provincia.nombre,
              canton:
              {
                codigoCanton: canton.codigoCanton,
                nombre: canton.nombre,
                distrito:
                {
                  codigoDistrito: distrito.codigoDistrito,
                  nombre: distrito.nombre
                }
              }


            }

            return provinciaEncontrada;
          })

        )
      )
      .find(res => res !== undefined); // Obtener el primer resultado


    return resultado;
  }

  getProvinciasFromLocalStorage(): Provincia[] {

    const items = localStorage.getItem(this.nameKey);
    return items ? JSON.parse(items) as Provincia[] : [];
  }
  private setProvinciasFromLocalStorage(): void {

    this.getProvinciasCantonesDistritos().subscribe(provincias => {
      this.provincias = provincias
      localStorage.setItem(this.nameKey, JSON.stringify(this.provincias))

    });
  }


  public getProvinciasCantonesDistritos(): Observable<Provincia[]> {
    const url: string = `${this.baseUrl}/ubicacion`;

    return this.http.get<r<Provincia[]>>(url).pipe(
      tap(response => console.log('Provincias:', response)),

      map(res => res.value),);

  }

  public createUbication(ubication: Ubication)
    : Observable<CommonResponse<Ubication>> {

    return this.http.post<CommonResponse<Ubication>>(`${this.baseUrl}/ubicacion/create`, ubication)
      .pipe(

        catchError(err => this.helperService.catchErrorP<Ubication>(err.error.detail)));

  }


  getProvincies({ offset, limit, nombre }: ProvinciaPaginationFilter)
    : Observable<CommonResponse<ProvinciaDetail[]>> {

    return this.http.get<CommonResponse<ProvinciaDetail[]>>(`${this.baseUrl}/ubicacion/provincias?offset=${offset}&limit=${limit}&nombre=${nombre}`)
      .pipe(
        catchError(err => this.helperService.catchErrorP2<ProvinciaDetail[]>(err))//.error.detail
      );
  }

  deleteUbication({ codigo, type }: DeleteUbication): Observable<CommonResponse<Ubication>> {

    return this.http.delete<CommonResponse<Ubication>>(`${this.baseUrl}/ubicacion/delete?codigo=${codigo}&type=${type}`).pipe(
      catchError(err => this.helperService.catchErrorP2<Ubication>(err))//.error.detail
    );

  }

  getUbication({ codigo, type }: { codigo: number, type: TypeUbication }): Observable<CommonResponse<Ubication>> {

    return this.http.get<CommonResponse<Ubication>>(`${this.baseUrl}/ubicacion/get?codigo=${codigo}&type=${type}`)
      .pipe(
        catchError(err => this.helperService.catchErrorP2<Ubication>(err))//.error.detail
      );
  }

  updateUbicationR(ubication: Ubication): Observable<CommonResponse<Ubication>> {

    return this.http.patch<CommonResponse<Ubication>>(`${this.baseUrl}/ubicacion/${ubication.codigo}`, ubication)
      .pipe(
        catchError(err => this.helperService.catchErrorP2<Ubication>(err)),
        // catchError(err => this.helperService.catchErrorP<Ubication>(err)),
        // catchError(err => this.helperService.catchErrorP<Ubication>(err.error.detail)),
        // catchError(this.handleError)
      );

  }


}


