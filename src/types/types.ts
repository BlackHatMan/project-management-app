export interface UserInfo {
  id: string;
  name: string | undefined;
}

export interface UserJWT {
  userId: string;
  login: string;
  iat: number;
}
