export interface BadRequestErrorJSON {
  message: 'bad request';
  errors: string[];
}

export interface InternalServerErrorJSON {
  message: string;
}

export interface UnauthorizedErrorJSON {
  message: 'unauthorized';
}
