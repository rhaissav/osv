export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}