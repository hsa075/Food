export type UserRole = 
  | 'customer'
  | 'outlet_staff'
  | 'outlet_manager'
  | 'kitchen_manager'
  | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  favoriteOutletId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface RegisterDTO {
  email: string;
  phone: string;
  name: string;
  password: string;
  favoriteOutletId?: string;
}

export interface LoginDTO {
  emailOrPhone: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  outletId?: string | null;
}
