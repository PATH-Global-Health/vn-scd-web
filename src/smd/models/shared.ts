export interface ObjectResponse<T> {
  errorMessage: string;
  data: T;
  succeed: boolean;
  failed: string;
}

export interface CollectionResponse<T> {
  pageCount: number;
  errorMessage: string;
  data: T[];
  succeed: boolean;
  failed: string;
}

export interface ErrorResponse {
  response: {
    data: {
      data: object;
      message: string | string[];
      errorMessage: string | string[];
      failed: string[];
      succeed: boolean;
    };
  };
}
