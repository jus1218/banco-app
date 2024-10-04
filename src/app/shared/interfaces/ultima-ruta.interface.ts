export interface Ruta {
  modulo: Modulo,
  seccion: Seccion
}


export type Modulo = 'banks' | 'clients' | 'exchange-rates' | 'currencies' | '';
export type Seccion = 'list' | 'view' | '';
