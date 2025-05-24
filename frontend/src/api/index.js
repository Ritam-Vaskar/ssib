import axios from 'axios';


const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'}/api`;

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
    // Don't automatically redirect on 401, just reject the promise
    // This allows components to handle the error themselves
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
  checkAuthStatus: () => api.get('/auth/status'),
};

// Admin endpoints
export const admin = {
  getAllGuards: () => api.get('/admin/guards'),
  assignGuard: (data) => api.post('/admin/assign-guard', data),
  generateBill: (data) => api.post('/admin/generate-bill', data),
  getAllClients: () => api.get('/admin/clients'),
  withdrawGuard: (data) => api.post('/admin/withdraw-guard', data),
  getAssignmentDetails: (id) => api.get(`/admin/assignments/${id}`),
};

// Client endpoints
export const client = {
  getProfile: () => api.get('/client/profile'),
  submitApplication: (data) => api.post('/client/submit-application', data),
  getBills: () => api.get('/client/bills'),

};

// Security endpoints
export const security = {
  getProfile: () => api.get('/security/profile'),
  updateAssignmentStatus: (data) => api.put('/security/update-assignment', data),
};

export default api;