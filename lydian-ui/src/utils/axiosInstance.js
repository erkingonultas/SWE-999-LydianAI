import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Replace with your backend URL
  withCredentials: true, // Include credentials (cookies) in requests
});

export default axiosInstance;