import axios from 'axios';
import { Platform } from 'react-native';
import { auth } from '../config/firebase';

// For local development, we use 10.0.2.2 for Android emulators
// and the local machine's IP for everything else.
// VITAL: Ensure the 192.168.x.x matched YOUR computer IP on your local WiFi.
const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : 'http://192.168.0.105:8000'; 

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s timeout for AI response generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Inject the latest Firebase token automatically
apiClient.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Get the current ID token, refreshing it if necessary
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Interceptor: Failed to get auth token', error);
  }
  return config;
}, (error) => Promise.reject(error));

// RESPONSE INTERCEPTOR: Global error handling and logging
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const user = auth.currentUser;
        if (user) {
          console.log('Session expired. Refreshing token...');
          const newToken = await user.getIdToken(true); // Force refresh
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest); // Retry the original request
        }
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
      }
    }

    console.error('API Error details:', {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

export default apiClient;
