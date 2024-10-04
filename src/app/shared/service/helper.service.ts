import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonResponse } from '../../clients/interface/client.interface';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  formatStringToDate(fecha: string): string {

    return `${fecha.substring(0, 4)}-${fecha.substring(4, 6)}-${fecha.substring(6, 8)}T00:00`
  }

  formatDateToString(fecha: string) {
    let fecha2: string | null | string[] = null;

    if (!fecha) return '';

    if (fecha.includes('T')) {
      fecha2 = fecha.split('T');// VER ESTO fecha
      fecha2 = fecha2[0];
    } else {
      fecha2 = fecha;
    }
    const date = new Date(fecha2);
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Ajustar a la zona local

    let year = adjustedDate.getFullYear(); // Obtener el año
    let month = String(adjustedDate.getMonth() + 1).padStart(2, '0'); // Obtener el mes y agregar ceros a la izquierda
    let day = String(adjustedDate.getDate() + 1).padStart(2, '0'); // Obtener el día y agregar ceros a la izquierda
    return `${year}${month}${day}`; // Formatear como 'yyyymmdd'
  }

  formatDateToString2(date: Date) {

    const fecha = `${date.toString()}T00:00`;

    return fecha;
  }



  catchErrorP<T>(messsage: string): Observable<CommonResponse<T>> {
    const message: CommonResponse<T> = {
      value: null,
      message: messsage,
      success: false
    }
    return of(message);
  }


  formatCurrent(value: number, currency: string) {
    if (!value) return '';
    const m: { [key in string]: string } = {
      'USD': `$ ${value.toFixed(2)}`,
      'EUR': `€ ${value.toFixed(2)}`,
      'CRC': `₡ ${value.toFixed(2)}`,
      'Y': `¥ ${value.toFixed(2)}`,
      'RUB': `₽ ${value.toFixed(2)}`
    };

    return m[currency] || value.toString();

  }
}
