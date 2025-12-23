/**
 * API client for communicating with the FastAPI backend.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired, try to refresh
            const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

            if (refreshError || !session) {
                // Refresh failed, sign out
                await supabase.auth.signOut();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // Retry the original request with new token
            const originalRequest = error.config;
            if (originalRequest) {
                originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

/**
 * Helper for handling API errors.
 */
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.detail || error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
}
