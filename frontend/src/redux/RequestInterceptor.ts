import instance from './api';
import { ShowMessagePopup } from '../GenericFunctions';
import { store } from './store';
import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { RootState } from './store';

// Add custom property to AxiosRequestConfig
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Set up Axios request and response interceptors to handle authentication tokens,
 * token refresh, and error scenarios
 */
const SetUp = () => {
    // Request interceptor for adding auth token to all requests
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
            // Get token from localStorage if available
            const data: string | null = localStorage.getItem("LoginDetails");
            
            if (data) {
                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData && parsedData.token) {
                        // Add token to headers
                        if (typeof parsedData.token === 'string') {
                            config.headers.Authorization = `Bearer ${parsedData.token}`;
                        } else if (parsedData.token.token) {
                            config.headers.Authorization = `Bearer ${parsedData.token.token}`;
                        }
                        console.log(`Request to ${config.url} - Added auth token to headers:`, config.headers.Authorization);
                    } else {
                        console.warn(`Request to ${config.url} - No token found in login details`);
                    }
                    
                    // If we're making a request to an endpoint that requires email in the query
                    if (config.url?.includes('getuser') || 
                        config.url?.includes('certificates') ||
                        config.url?.includes('getUserByEmail')) {
                        
                        // If email param is missing but we have it in login details, add it
                        if (!config.params?.email && !config.url.includes('email=')) {
                            const email = parsedData.loginEmail || 
                                         (parsedData.data && parsedData.data.loginEmail) || 
                                         parsedData.email || 
                                         (parsedData.data && parsedData.data.email);
                            
                            if (email) {
                                // Add email parameter to the request
                                config.params = { ...config.params, email };
                                console.log(`Request to ${config.url} - Added email parameter: ${email}`);
                            } else {
                                console.error(`Request to ${config.url} - Could not find email in login details`, parsedData);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Request to ${config.url} - Error parsing login details:`, error);
                }
            } else {
                console.warn(`Request to ${config.url} - No login details found in localStorage`);
            }
            
            return config;
        },
        (error: AxiosError): Promise<AxiosError> => {
            console.error("Request interceptor error:", error);
            return Promise.reject(error);
        }
    );

    // Response interceptor for handling errors and token refresh
    instance.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => {
            return response;
        },
        async (error: AxiosError): Promise<any> => {
            const originalConfig = error.config as CustomAxiosRequestConfig;
            const basePath: string = process.env.NEXT_PUBLIC_BASE_PATH || '/vignan';
            
            // Handle 401 unauthorized errors with token refresh attempt
            if (error?.response?.status === 401 && originalConfig && !originalConfig._retry) {
                originalConfig._retry = true;
                
                try {
                    const loginData = localStorage.getItem("LoginDetails");
                    if (!loginData) {
                        handleSessionExpired();
                        return Promise.reject(error);
                    }

                    const parsedData = JSON.parse(loginData);
                    if (!parsedData || !parsedData.token) {
                        handleSessionExpired();
                        return Promise.reject(error);
                    }

                    // Attempt to refresh the token
                    const refreshResponse = await instance.get('/v1/student/refreshToken', {
                        headers: {
                            Authorization: typeof parsedData.token === 'string' 
                                ? `Bearer ${parsedData.token}`
                                : `Bearer ${parsedData.token.token}`
                        }
                    });

                    if (refreshResponse.data && refreshResponse.data.data) {
                        // Update token in localStorage
                        parsedData.token = refreshResponse.data.data;
                        localStorage.setItem("LoginDetails", JSON.stringify(parsedData));

                        // Update the authorization header for the original request
                        originalConfig.headers.Authorization = `Bearer ${refreshResponse.data.data.token}`;

                        // Retry the original request
                        return instance(originalConfig);
                    } else {
                        console.error('Token refresh failed: Invalid response', refreshResponse);
                        handleSessionExpired();
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    handleSessionExpired();
                    return Promise.reject(refreshError);
                }
            } else if (error?.response?.status === 401) {
                handleSessionExpired();
                return Promise.reject(error);
            }
            
            return Promise.reject(error);
        }
    );
};

/**
 * Helper function to handle session expired scenarios
 */
const handleSessionExpired = (): void => {
    localStorage.clear();
    const basePath: string = process.env.NEXT_PUBLIC_BASE_PATH || '/vignan';
    window.location.href = `${basePath}/StudentLoginPage`;
    ShowMessagePopup(false, 'Your session has expired. Please log in again.', '');
};

export default SetUp;
