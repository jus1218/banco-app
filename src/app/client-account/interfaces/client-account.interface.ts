export interface ClientAccountInfo {
  codigoCuentaCliente: number;
  codigoBanco: string;
  codigoMoneda: string;
  saldo: number;
  descripcion: string;
  codigoTipoCuentaCliente: string;
  codigoCuentaContable: number;
  codigoCliente: number;
}
export interface ClientAccount {
  codigoCuentaCliente: number;
  banco: Banco;
  moneda: Moneda;
  saldo: number;
  descripcion: string;
  tipoCuentaCliente: TipoCuentaCliente;
  cuentaContable: CuentaContable;
  cliente: Cliente;
}

export interface Banco {
  codigoBanco: string;
  nombre: string;
  codigoMoneda: string;
  codigoDistrito: number;
  direccionExacta: string;
}

export interface Cliente {
  codigoCliente: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  cedula: number;
  direccionExacta: string;
  codigoDistrito: number;
}

export interface CuentaContable {
  codigoCuentaContable: number;
  codigoBanco: string;
  codigoMoneda: string;
  descripcion: string;
  saldo: number;
  codigoTipoCuentaContable: number;
}

export interface Moneda {
  codigoMoneda: string;
  nombre: string;
}

export interface TipoCuentaCliente {
  codigoTipoCuentaCliente: string;
  nombre: string;
}
