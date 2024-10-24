import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { catchError, map, Observable, tap } from 'rxjs';
import { CommonResponse } from '../../clients/interface/client.interface';
import { Provincia } from '../interfaces/provincia.interface';

@Injectable({
  providedIn: 'root'
})
export class SelectorService {
  private baseUrl: String = environments.baseUrl + '/cuenta-cliente';

  private currenciesBase: MonedaSelector[] = [];
  private cuentasContablesBase: CuentaContableSelector[] = [];

  constructor(private http: HttpClient, private helperService: HelperService) {


    // this.getAll().subscribe(({ value }) => {
    //   this.currenciesBase = value!.monedas;
    //   this.cuentasContablesBase = value!.cuentaContables;
    // })
  }

  getAll(): Observable<CommonResponse<Selector>> {
    return this.http.get<CommonResponse<Selector>>(`${this.baseUrl}/selectores`).pipe(
      tap(({ value }) => {

        this.currenciesBase = value!.monedas;
        this.cuentasContablesBase = value!.cuentaContables;
      }),
      catchError(err => this.helperService.catchErrorP<Selector>(err.error.detail))
    );
  }

  get currencies(): MonedaSelector[] {
    return [
      ...this.currenciesBase
    ]
  }
  get cuentasContables(): CuentaContableSelector[] {
    return [
      ...this.cuentasContablesBase
    ]
  }
}



export interface Selector {
  bancos: BancoSelector[];
  monedas: MonedaSelector[];
  tipoCuentaClientes: TipoCuentaClienteSelector[];
  tipoCuentaContables: TipoCuentaContableSelector[];
  cuentaContables: CuentaContableSelector[];
  clientes: ClienteSelector[];
  provincias: Provincia[];
}

export interface BancoSelector {
  codigoBanco: string;
  codigoMoneda: string;
  nombre: string;
}

export interface ClienteSelector {
  codigoCliente: number;
  nombreCompleto: string;
}

export interface CuentaContableSelector {
  codigoCuentaContable: number;
  codigoBanco: string;
  codigoMoneda: string;
  descripcion: string;
}

export interface MonedaSelector {
  codigoMoneda: string;
  nombre: string;
}

export interface TipoCuentaClienteSelector {
  codigoTipoCuentaCliente: string;
  nombre: string;
}
export interface TipoCuentaContableSelector {
  codigoTipoCuentaContable: number;
  nombre: string;
}
