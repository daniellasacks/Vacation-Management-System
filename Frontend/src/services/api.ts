import axios, { AxiosResponse } from 'axios';
import { AuthResponse, VacationsResponse, Vacation, ReportData, CreateVacationData, UpdateVacationData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> => {
    return api.post('/auth/register', userData);
  },

  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> => {
    return api.post('/auth/login', credentials);
  },
};

// Vacations API
export const vacationsAPI = {
  getVacations: (page: number = 1, filter: string = 'all'): Promise<AxiosResponse<VacationsResponse>> => {
    return api.get(`/vacations?page=${page}&filter=${filter}`);
  },

  getVacationById: (id: number): Promise<AxiosResponse<Vacation>> => {
    return api.get(`/vacations/${id}`);
  },

  createVacation: (vacationData: CreateVacationData): Promise<AxiosResponse<Vacation>> => {
    const formData = new FormData();
    formData.append('destination', vacationData.destination);
    formData.append('description', vacationData.description);
    formData.append('start_date', vacationData.start_date);
    formData.append('end_date', vacationData.end_date);
    formData.append('price', vacationData.price.toString());
    
    if (vacationData.image) {
      formData.append('image', vacationData.image);
    }

    return api.post('/vacations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateVacation: (id: number, vacationData: UpdateVacationData): Promise<AxiosResponse<Vacation>> => {
    const formData = new FormData();
    
    if (vacationData.destination) formData.append('destination', vacationData.destination);
    if (vacationData.description) formData.append('description', vacationData.description);
    if (vacationData.start_date) formData.append('start_date', vacationData.start_date);
    if (vacationData.end_date) formData.append('end_date', vacationData.end_date);
    if (vacationData.price !== undefined) formData.append('price', vacationData.price.toString());
    
    if (vacationData.image) {
      formData.append('image', vacationData.image);
    }

    return api.put(`/vacations/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteVacation: (id: number): Promise<AxiosResponse<{ message: string }>> => {
    return api.delete(`/vacations/${id}`);
  },

  likeVacation: (id: number): Promise<AxiosResponse<{ message: string }>> => {
    return api.post(`/vacations/${id}/like`);
  },

  unlikeVacation: (id: number): Promise<AxiosResponse<{ message: string }>> => {
    return api.delete(`/vacations/${id}/like`);
  },

  getVacationReport: (): Promise<AxiosResponse<ReportData[]>> => {
    return api.get('/vacations/report');
  },
};

export { api };
export default api;
