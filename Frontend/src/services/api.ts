import axios, { AxiosResponse } from 'axios';
import { AuthResponse, VacationsResponse, Vacation, ReportData, CreateVacationData, UpdateVacationData } from '../types';
import { API_BASE_URL, DEMO_MODE } from '../utils/config';
import { demoAuthAPI, demoVacationsAPI } from '../demo/demoApi';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> => {
    if (DEMO_MODE) {
      return demoAuthAPI.register(userData);
    }
    return api.post('/auth/register', userData);
  },

  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> => {
    if (DEMO_MODE) {
      return demoAuthAPI.login(credentials);
    }
    return api.post('/auth/login', credentials);
  },
};

export const vacationsAPI = {
  getVacations: (page: number = 1, filter: string = 'all'): Promise<AxiosResponse<VacationsResponse>> => {
    if (DEMO_MODE) {
      return demoVacationsAPI.getVacations(page, filter);
    }
    return api.get(`/vacations?page=${page}&filter=${filter}`);
  },

  getVacationById: (id: number): Promise<AxiosResponse<Vacation>> => {
    if (DEMO_MODE) {
      return demoVacationsAPI.getVacationById(id);
    }
    return api.get(`/vacations/${id}`);
  },

  createVacation: (vacationData: CreateVacationData): Promise<AxiosResponse<Vacation>> => {
    if (DEMO_MODE) {
      return demoVacationsAPI.createVacation(vacationData);
    }

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
    if (DEMO_MODE) {
      return demoVacationsAPI.updateVacation(id, vacationData);
    }

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
    if (DEMO_MODE) {
      return demoVacationsAPI.deleteVacation(id);
    }
    return api.delete(`/vacations/${id}`);
  },

  likeVacation: (id: number): Promise<AxiosResponse<{ message: string }>> => {
    if (DEMO_MODE) {
      return demoVacationsAPI.likeVacation(id);
    }
    return api.post(`/vacations/${id}/like`);
  },

  unlikeVacation: (id: number): Promise<AxiosResponse<{ message: string }>> => {
    if (DEMO_MODE) {
      return demoVacationsAPI.unlikeVacation(id);
    }
    return api.delete(`/vacations/${id}/like`);
  },

  getVacationReport: (): Promise<AxiosResponse<ReportData[]>> => {
    if (DEMO_MODE) {
      return demoVacationsAPI.getVacationReport();
    }
    return api.get('/vacations/report');
  },
};

export { api };
export default api;
