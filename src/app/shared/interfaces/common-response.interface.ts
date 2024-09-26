export interface CommonResponse<T> {
  value: T[];
  message: string;
  success: boolean;
}
export interface CommonResponseV<T> {
  value: T;
  message: string;
  success: boolean;
}

