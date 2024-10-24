export interface LeagerAccount {
  codigoCuentaContable: number;
  codigoBanco: string;
  codigoMoneda: string;
  descripcion: string;
  codigoTipoCuentaContable: number;
}
export interface LeagerAccount2 {
  codigoCuentaContable: number;
  codigoBanco: string;
  codigoMoneda: string;
  descripcion: string;
  tipoCuentaContable: string;
}
export interface LeagerAccountFilter {
  offset: number;
  limit: number;
  codigoBanco: string

}
