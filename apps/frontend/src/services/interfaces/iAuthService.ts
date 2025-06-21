export interface IAuthService {
  login: (cnpj: string, token: string) => Promise<{ user: any; token: string; refreshToken: string; expiresIn: number }>;
  refresh: (refreshToken: string) => Promise<{ accessToken: string; refreshToken: string; expiresAt: number }>;
  logout: () => void;
  getCurrentUser: () => any;
  getAuthTokens: () => { accessToken: string; refreshToken: string; expiresAt: number } | null;
  getToken: () => string | null;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isSoftwareHouse: () => boolean;
}