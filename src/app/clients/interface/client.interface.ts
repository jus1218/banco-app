import { Telefono } from "../../banks/interfaces/bank.interface";


export interface CommonResponse<T> {
  value: T | null;
  message: string;
  success: boolean;
}


export interface Client {
  codigoCliente: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  cedula: number;
  direccionExacta: string;
  // distrito: Distrito;
  telefono: Telefono[];
}

// export interface Distrito {
//   codigoDistrito: number;
//   nombre: string;
// }

// export interface Telefono {
//   codigoTelefono: number;
//   numero: string;
// }
export interface ClienteCreateUpdate {
  codigoCliente: number,
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  direccionExacta: string;
  distrito: number;
  cedula: number;
}
export interface ClienteInfo {
  codigoCliente: number,
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  direccionExacta: string;
  codigoDistrito: number;
  cedula: number;
}
