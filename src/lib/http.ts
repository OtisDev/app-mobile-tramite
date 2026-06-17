import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';

export function createApiClient() {
  return axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: process.env.EXPO_PUBLIC_API_TIMEOUT ? parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT) : 5000,
  });
}

function logRequest(config: any) {
  console.log('Request Config:', `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || config.params);
  return config;
}

export const http = createApiClient();

http.interceptors.request.use(
  (config) => {
    logRequest(config);
    return config;
  }, (error) => Promise.reject(error));

export const api = createApiClient();

api.interceptors.request.use(
  (config) => {
    logRequest(config);
    
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);