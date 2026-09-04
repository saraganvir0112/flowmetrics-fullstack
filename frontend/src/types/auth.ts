export type UserRole = 'admin' | 'user';

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  user: SafeUser;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
