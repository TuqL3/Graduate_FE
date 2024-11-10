import axios from 'axios';
export const newRequest = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:8080',
});
