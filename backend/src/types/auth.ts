export type UserRole = 'admin' | 'user';

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthResponseData {
  user: SafeUser;
  token: string;
}
