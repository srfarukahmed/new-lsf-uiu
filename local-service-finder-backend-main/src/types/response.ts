export type GenericResponse<T> = {
  success: true;
  message: string;
  data?: T;
};

export type ErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
};
