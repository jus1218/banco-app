
export interface ExchangeRate {
  codigoMoneda: string;
  fecha: Date;
  tipoCambioCompra: number;
  tipoCambioVenta: number;
  codigoBanco: string;
}



export interface PaginationExchangeRate {
  offset: number;
  limit: number;
  codigoMoneda: string | null;
  fecha: string | null;
  codigoBanco: string | null;
}
