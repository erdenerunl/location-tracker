// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';
import axios, { isAxiosError } from 'axios'
const TOKEN_KEY = 'my-jwt';

interface AuthContextData {
  authState: {
    token: string | null;
    authenticated: boolean | null;
  };
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Başlangıçta context'in undefined olabileceğini belirtiyoruz.
const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null; }>({
    token: null,
    authenticated: null, // Başlangıçta durumu bilmiyoruz
  });

  // Uygulama ilk açıldığında token'ı kontrol et
  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        setAuthState({
          token: token,
          authenticated: true,
        });
        // API istemcisine bu token'ı varsayılan olarak her istekte kullanmasını söyle
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        setAuthState({ token: null, authenticated: false });
      }
    };
    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/register', { email, password });
      const { token } = response.data;
      setAuthState({ token, authenticated: true });
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Registration failed:', error);
      // Hata mesajını kullanıcıya göstermek için burada bir state daha yönetilebilir.
      throw new Error('Registration failed');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token } = response.data;
      setAuthState({ token, authenticated: true });
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error: any) {
        if (isAxiosError(error)) {
            // Bu, Axios'tan gelen bir hata mı kontrolü.
            console.error('AXIOS ERROR:', error.message);
            if (error.response) {
              // Sunucu bir cevap verdi ama durum kodu 2xx değil (örn: 401, 404, 500)
              console.error('Response Data:', error.response.data);
              console.error('Response Status:', error.response.status);
            } else if (error.request) {
              // İstek yapıldı ama sunucudan HİÇ cevap gelmedi.
              // Genellikle ağ hatası, yanlış URL, sunucunun kapalı olması gibi durumlar.
              console.error('Request Error:', 'No response received from server.');
            } else {
              // İsteği ayarlarken bir hata oluştu
              console.error('Error:', error.message);
            }
          } else {
            // Axios'tan gelmeyen başka bir hata
            console.error('An unexpected error occurred:', error);
          }
      
          throw new Error('Login failed');
    }
  };
  
  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    apiClient.defaults.headers.common['Authorization'] = '';
    setAuthState({ token: null, authenticated: false });
  };

  const value = {
    authState,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Context'i kolayca kullanmak için bir custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};