



import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Remplacez par l'URL de votre backend
  withCredentials: true, // Permet l'envoi des cookies entre domaines
    withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
