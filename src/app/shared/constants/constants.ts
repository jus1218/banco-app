
export const LIMITS: number[] = [5, 8, 10]
export const DEFAULT_OFFSET: number = 0;
export const DEFAULT_LIMIT: number = 5;




export type localUrl = 'register' | 'list' | 'edit';
export const REGISTER: localUrl = 'register';
export const list: localUrl = 'list';
export const edit: localUrl = 'edit';

export enum LocalUrl {

  REGISTER = 'register',
  LIST = 'list',
  EDIT = 'edit'
}

export enum Pagination {

  OFFSET = 'offset',
  LIMIT = 'limit'
}
