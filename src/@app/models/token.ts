export interface Token {
  '.expires': string;
  '.issued': string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  roles: string;
  token_type: string;
  userId: string;
  username: string;
}
