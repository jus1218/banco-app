export interface Ubication {
  codigo: number;
  nombre: string;
  idRelacion: number | null;
  type: TypeUbication;
}

export enum TypeUbication {
  Provincie = 0,
  Canton = 1,
  District = 2
}


export interface DeleteUbication { codigo: number, type: TypeUbication }
