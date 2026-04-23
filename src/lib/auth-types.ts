export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  last_login_at: string | null;
};

export type UserCreate = {
  username: string;
  email: string;
  password: string;
};

export type UserLogin = {
  identifier: string;
  password: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type TokenPairResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type TokenClaims = {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  jti: string;
  typ: string;
};

export type AuthResponse = {
  user: User;
  tokens: TokenPairResponse;
};

export type SessionRead = {
  user: User;
  token: TokenClaims;
};

export type UserIdentity = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
};

export type Token = TokenPairResponse;

