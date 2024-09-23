export interface Bank {
  codigoBanco: string;
  nombre: string;
  moneda: Moneda;
  distrito: Distrito;
  direccionExacta: string;
  telefono: Telefono[];
}

export interface Distrito {
  codigoDistrito: number;
  nombre: string;
}

export interface Moneda {
  codigoMoneda: string;
  nombre: string;
}

export interface Telefono {
  codigoTelefono: number;
  numero: string;
}
