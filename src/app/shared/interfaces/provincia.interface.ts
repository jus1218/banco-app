export interface Provincia {
  codigoProvincia: number;
  nombre: string;
  cantones: Canton[];
}

export interface Canton {
  codigoCanton: number;
  nombre: string;
  distritos: Distrito[];
}

export interface Distrito {
  codigoDistrito: number;
  nombre: string;
}
export interface Provincia2 {
  codigoProvincia: number;
  nombre: string;
  canton: Canton2 ;
}

export interface Canton2 {
  codigoCanton: number;
  nombre: string;
  distrito: Distrito2 ;
}

export interface Distrito2 {
  codigoDistrito: number;
  nombre: string;
}
