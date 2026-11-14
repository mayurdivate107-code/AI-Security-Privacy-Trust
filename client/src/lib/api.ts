import axios from 'axios';

// When deployed on Vercel, default to relative '/api' endpoint if no external URL provided
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

/**
 * Quick connectivity probe — resolves to true if the backend API is alive,
 * false otherwise. Result is cached for the page session.
 */
let _backendAlive: boolean | null = null;
export const isBackendAlive = async (): Promise<boolean> => {
  if (_backendAlive !== null) return _backendAlive;
  try {
    await axios.get(`${baseURL.replace(/\/api$/, '')}/health`, { timeout: 2000 });
    _backendAlive = true;
  } catch {
    _backendAlive = false;
  }
  return _backendAlive;
};
export const resetBackendProbe = () => { _backendAlive = null; };

// Automatic JWT Bearer Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aegis_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Error Handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);
