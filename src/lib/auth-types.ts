export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  account_status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;
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
  account_status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;
  created_at: string;
  last_login_at: string | null;
};

export type PublicUser = {
  id: string;
  username: string;
};

export type Token = TokenPairResponse;

export type UserProfileUpdate = {
  username?: string;
  email?: string;
};

export type PasswordResetRequest = {
  email: string;
};

export type PasswordResetRequestResponse = {
  detail: string;
  reset_token: string | null;
};

export type PasswordResetConfirm = {
  token: string;
  new_password: string;
};

export type PasswordChange = {
  current_password: string;
  new_password: string;
};

export function isUserActive(user: Pick<User, "account_status">) {
  return user.account_status === "ACTIVE";
}
