import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Read the backend URL from environment variables
const backendUrl: string = process.env.BACKEND_URL || 'http://localhost:4001/vignanAPI';

// Create an axios instance with a typed configuration
const instance: AxiosInstance = axios.create({
    baseURL: backendUrl,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// We'll remove the default interceptors here since they're now in RequestInterceptor.ts
// This avoids duplicate interceptors

// Log the base URL only in development
if (process.env.NODE_ENV !== 'production') {
    console.log('API Base URL:', backendUrl);
}

export default instance;