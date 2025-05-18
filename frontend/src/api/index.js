import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.put('/auth/reset-password', data),
};

// Admin endpoints
export const admin = {
  getAllGuards: () => api.get('/admin/guards'),
  assignGuard: (data) => api.post('/admin/assign-guard', data),
  generateBill: (data) => api.post('/admin/generate-bill', data),
};

// Client endpoints
export const client = {
  getProfile: () => api.get('/client/profile'),
  requestService: (data) => api.post('/client/request-service', data),
  getBills: () => api.get('/client/bills'),
};

// Security endpoints
export const security = {
  getProfile: () => api.get('/security/profile'),
  updateAssignmentStatus: (data) => api.put('/security/update-assignment', data),
};

export default api;