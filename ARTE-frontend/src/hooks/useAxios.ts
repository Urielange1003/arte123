import { useEffect } from 'react';
import axios from 'axios';

const useAxios = () => {
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
    axios.defaults.withCredentials = true;
  }, [token]);

  return axios;
};

export default useAxios;
