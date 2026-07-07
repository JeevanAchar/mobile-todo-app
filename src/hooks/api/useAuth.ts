import { API_ROUTES } from "@/api/Routes";
import {
    apiClient,
    clearStoredAuthData,
    getStoredAuthData,
    storeAuthData,
} from "@/api/axios";
import { useCallback, useState } from "react";

interface AuthResponseData {
  user_id?: string;
  email?: string;
  token?: string;
}

interface AuthApiResponse {
  success: boolean;
  message: string;
  data?: AuthResponseData;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthApiResponse>(
        API_ROUTES.auth.signup,
        { email, password },
      );
      const payload = response.data;

      if (!payload.success || !payload.data?.token) {
        throw new Error(payload.message || "Signup failed");
      }

      await storeAuthData({
        user_id: payload.data.user_id,
        email: payload.data.email,
        token: payload.data.token,
      });

      return payload;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Signup failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthApiResponse>(
        API_ROUTES.auth.login,
        { email, password },
      );
      const payload = response.data;

      if (!payload.success || !payload.data?.token) {
        throw new Error(payload.message || "Login failed");
      }

      await storeAuthData({
        user_id: payload.data.user_id,
        email: payload.data.email,
        token: payload.data.token,
      });

      return payload;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await clearStoredAuthData();
  }, []);

  const getStoredSession = useCallback(async () => {
    return getStoredAuthData();
  }, []);

  return { signup, login, logout, getStoredSession, isLoading, error };
};
