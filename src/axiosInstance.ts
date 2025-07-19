import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://learnhub-869c.onrender.com/api',
  withCredentials: true, // Include cookies if used for auth (optional)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header automatically if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Adjust if using Context instead

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: handle global errors like 401 or 403
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can log out user or redirect to login here if token expired
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized! Please login again.');
      // For example:
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
