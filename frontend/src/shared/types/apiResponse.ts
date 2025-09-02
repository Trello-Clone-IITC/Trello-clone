export interface ApiResponse<T = undefined> {
  success: boolean;
  data: T;
}
