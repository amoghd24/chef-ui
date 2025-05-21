import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base API configuration
const API_URL = 'http://127.0.0.1:8000';
const TIMEOUT = 30000; // 30 seconds

/**
 * Creates and configures an axios instance for API requests
 */
export const createApiClient = (config: AxiosRequestConfig = {}): AxiosInstance => {
  // Create axios instance with default configuration
  const client = axios.create({
    baseURL: API_URL,
    timeout: TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...config,
  });

  // Request interceptor for adding auth tokens, etc.
  client.interceptors.request.use(
    (config) => {
      // Get token from store/localStorage if it exists
      const token = localStorage.getItem('chef-ui-auth')
        ? JSON.parse(localStorage.getItem('chef-ui-auth') || '{}')?.state?.token
        : null;

      // Add authorization header if token exists
      if (token && config.headers) {
        // Use Token format for DRF TokenAuthentication (not Bearer)
        config.headers.set('Authorization', `Token ${token}`);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for handling errors globally
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const { response } = error;

      // Handle authorization errors
      if (response?.status === 401) {
        // Clear auth data if unauthorized
        localStorage.removeItem('chef-ui-auth');
        // Redirect to login
        window.location.href = '/';
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create default API client instance
export const apiClient = createApiClient();

// Export convenience methods for typical API operations
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
};

export default api; 