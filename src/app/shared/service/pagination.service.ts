import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Modulo, Ruta } from '../interfaces/ultima-ruta.interface';
import { RouterService } from './router.service';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private myForm: FormGroup | null;
  public palabra: string = '';

  constructor(
    private routerService: RouterService
  ) {


    this.myForm = null;
  }

  init(myForm: FormGroup, modulo: Modulo): void {
    const newP = (this.routerService.ultimaRuta.modulo === modulo ? this.palabra : '');

    this.myForm = myForm;
    this.palabra = newP;
  }


  setForm(myForm: FormGroup) {
    this.myForm = myForm;

  }
  setOffset(value: number): void {
    this.myForm?.get('offset')?.setValue(value);
  }

  setLimit(value: number): void {
    this.myForm?.get('limit')?.setValue(value);
  }

  getInitOffset(modulo: Modulo): number {

    if (this.routerService.ultimaRuta.modulo !== modulo) return 0;


    return this.myForm?.get('offset')?.value as number ?? 0;
  }
  getInitLimit(modulo: Modulo): number {

    if (this.routerService.ultimaRuta.modulo !== modulo) return 5;

    return this.myForm?.get('limit')?.value as number ?? 5;
  }
  getOffsett(): number {


    return this.myForm?.get('offset')?.value as number ?? 0;
  }
  getLimitt(): number {


    return this.myForm?.get('limit')?.value as number ?? 5;
  }
  getParameterPagination(): {
    offset: number;
    limit: number;
    palabra: string
  } {
    return {
      'offset': this.getOffsett(),
      'limit': this.getLimitt(),
      'palabra': this.palabra
    }
  }

  getDestinePage(): number {

    const offset = this.myForm?.get('offset')?.value as number ?? 0;
    const limit = this.myForm?.get('limit')?.value as number ?? 5;

    return offset * limit;
  }

  canPagination(length: number): Boolean {
    return length === this.getLimitt();

  }

  setPalabra(palabra: string) {

    this.palabra = palabra;
  }

  getPalabra(): string {
    return this.palabra;
  }
}
