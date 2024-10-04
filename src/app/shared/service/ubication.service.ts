import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Canton, Distrito, Provincia, Provincia2 } from '../interfaces/provincia.interface';
import { environments } from '../../../environments/environments';
import { CommonResponse } from '../interfaces/common-response.interface';


@Injectable({
  providedIn: 'root'
})
export class UbicationService {

  private baseUrl: string = environments.baseUrl;
  private nameKey: string = 'provincias';
  private provincias: Provincia[] = [];

  constructor(private http: HttpClient) {



    if (!(this.getProvinciasFromLocalStorage().length)) {
      this.setProvinciasFromLocalStorage();
    }

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
    const distritos = this.getProvinciasFromLocalStorage()
      .flatMap(provincia =>
        provincia.cantones
          .filter(canton => canton.codigoCanton == idCanton)
          .flatMap(canton => canton.distritos) // Aplana los distritos
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


  private getProvinciasCantonesDistritos(): Observable<Provincia[]> {
    const url: string = `${this.baseUrl}/ubicacion`;

    return this.http.get<CommonResponse<Provincia>>(url).pipe(
      tap(response => console.log('Provincias:', response)),

      map(res => res.value),);

  }

}
