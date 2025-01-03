import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:3000/', // Backend API base URL
  baseURL: 'https://o7nmx44dkd.execute-api.ap-southeast-1.amazonaws.com/prod/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token in request interceptor:', token);  // Log token for debugging
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
