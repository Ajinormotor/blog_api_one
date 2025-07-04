export interface ApiResponse<T> {
  status: number;
  message: string;
  payload?: T;
}
