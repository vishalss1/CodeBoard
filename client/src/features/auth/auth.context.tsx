import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthContextType, AuthUser, LoginRequest, RegisterRequest } from './auth.types';
import { loginUser, registerUser, logoutUser, refreshToken } from './auth.api';

export const AuthContext = createContext<AuthContextType | null>(null);

function decodeTokenPayload(token: string): AuthUser | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return {
      user_id: payload.user_id,
      username: payload.username ?? null,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem('accessToken', newToken);
    setTokenState(newToken);
    const decoded = decodeTokenPayload(newToken);
    setUser(decoded);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('accessToken');
    setTokenState(null);
    setUser(null);
  }, []);

  // On mount: try to restore session
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('accessToken');
      if (stored) {
        const decoded = decodeTokenPayload(stored);
        if (decoded) {
          setTokenState(stored);
          setUser(decoded);
        }
        // Attempt silent refresh to keep session alive
        try {
          const data = await refreshToken();
          setToken(data.accessToken);
        } catch {
          // Refresh failed – token may be expired; keep existing if decoded ok
          if (!decoded) clearAuth();
        }
      }
      setIsLoading(false);
    };
    init();
  }, [setToken, clearAuth]);

  const login = async (data: LoginRequest) => {
    const response = await loginUser(data);
    setToken(response.accessToken);
  };

  const register = async (data: RegisterRequest) => {
    await registerUser(data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
