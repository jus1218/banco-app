import { Injectable } from '@angular/core';
import { Ruta } from '../interfaces/ultima-ruta.interface';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  public ultimaRuta: Ruta;

  constructor() {
    this.ultimaRuta = {
      modulo: '',
      seccion: ''
    };
  }
}
