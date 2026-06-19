import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';

export function createAxiosClient(baseURL?: string, timeout?: number | string) {
  let parsedTimeout: number | undefined;

  if (typeof timeout === 'string') {
    if(/^\d+$/.test(timeout)) {
      parsedTimeout = parseInt(timeout, 10);
    }
  } else if (typeof timeout === 'number') {
    parsedTimeout = timeout;
  }

  return axios.create({
    baseURL,
    timeout: parsedTimeout || 10000,
  });
}

export function createApiClient() {
  return createAxiosClient(process.env.EXPO_PUBLIC_API_URL, process.env.EXPO_PUBLIC_API_TIMEOUT);
}

function logRequest(config: any) {
  console.log('\nRequest Config:', `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || config.params);
  if (config.headers.Authorization) {
    console.log('Token\n', config.headers.Authorization);
  }
  return config;
}

export const http = createApiClient();

http.interceptors.request.use(
  (config) => {
    logRequest(config);
    return config;
  }, (error) => Promise.reject(error));

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

function processQueue(error: any, token?: string) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });

  failedQueue = [];
}

export const api = createApiClient();

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logRequest(config);

    return config;
  },
  (error) => Promise.reject(error)
);

/*api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;

            resolve(api.request(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await api.post('/auth/refresh');

      const newToken = response.data.data.access_token;

      console.log('New token:', newToken);

      useAuthStore
        .getState()
        .setToken(newToken);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api.request(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      useAuthStore.getState().logout();
    } finally {
      isRefreshing = false;
    }

    return Promise.reject(error);
  }
);*/