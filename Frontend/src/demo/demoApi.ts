import { AxiosResponse } from 'axios';
import {
  AuthResponse,
  VacationsResponse,
  Vacation,
  ReportData,
  CreateVacationData,
  UpdateVacationData,
} from '../types';
import {
  buildReport,
  enrichVacation,
  getCurrentUserId,
  isLiked,
  loadDemoState,
  saveDemoState,
  toPublicUser,
  todayString,
} from './demoStore';

class DemoApiError extends Error {
  response: { data: { message: string }; status: number };

  constructor(message: string, status: number) {
    super(message);
    this.response = { data: { message }, status };
  }
}

function mockResponse<T>(data: T, status = 200): Promise<AxiosResponse<T>> {
  return Promise.resolve({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosResponse<T>['config'],
  });
}

function reject(message: string, status: number): Promise<never> {
  return Promise.reject(new DemoApiError(message, status));
}

function requireUserId(): number {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new DemoApiError('Authentication required', 401);
  }
  return userId;
}

function requireAdmin(): number {
  const state = loadDemoState();
  const userId = requireUserId();
  const user = state.users.find((entry) => entry.user_id === userId);
  if (!user || user.role !== 'admin') {
    throw new DemoApiError('Access denied. Admin role required.', 403);
  }
  return userId;
}

export const demoAuthAPI = {
  register: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> => {
    const state = loadDemoState();

    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
      return reject('All fields are required', 400);
    }

    if (userData.password.length < 4) {
      return reject('Password must be at least 4 characters long', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return reject('Invalid email format', 400);
    }

    if (state.users.some((user) => user.email === userData.email)) {
      return reject('Email already exists', 400);
    }

    const user = {
      user_id: state.nextUserId++,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      password: userData.password,
      role: 'user' as const,
    };

    state.users.push(user);
    saveDemoState(state);

    return mockResponse({
      message: 'User registered successfully',
      token: `demo-token-${user.user_id}`,
      user: toPublicUser(user),
    }, 201);
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> => {
    const state = loadDemoState();
    const user = state.users.find((entry) => entry.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      return reject('Invalid credentials', 401);
    }

    return mockResponse({
      message: 'Login successful',
      token: `demo-token-${user.user_id}`,
      user: toPublicUser(user),
    });
  },
};

export const demoVacationsAPI = {
  getVacations: async (page = 1, filter = 'all'): Promise<AxiosResponse<VacationsResponse>> => {
    const state = loadDemoState();
    const userId = getCurrentUserId();
    const currentDay = todayString();

    let filtered = [...state.vacations];

    switch (filter) {
      case 'liked':
        if (!userId) return reject('Authentication required', 401);
        filtered = filtered.filter((vacation) => isLiked(state, userId, vacation.vacation_id));
        break;
      case 'active':
        filtered = filtered.filter(
          (vacation) => vacation.start_date <= currentDay && vacation.end_date >= currentDay
        );
        break;
      case 'upcoming':
        filtered = filtered.filter((vacation) => vacation.start_date > currentDay);
        break;
      default:
        break;
    }

    filtered.sort((a, b) => a.start_date.localeCompare(b.start_date));

    const totalCount = filtered.length;
    const limit = 9;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const offset = (page - 1) * limit;
    const vacations = filtered
      .slice(offset, offset + limit)
      .map((vacation) => enrichVacation(state, vacation, userId));

    return mockResponse({
      vacations,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  },

  getVacationById: async (id: number): Promise<AxiosResponse<Vacation>> => {
    const state = loadDemoState();
    const vacation = state.vacations.find((entry) => entry.vacation_id === id);

    if (!vacation) {
      return reject('Vacation not found', 404);
    }

    return mockResponse(enrichVacation(state, vacation, getCurrentUserId()));
  },

  createVacation: async (vacationData: CreateVacationData): Promise<AxiosResponse<Vacation>> => {
    requireAdmin();
    const state = loadDemoState();

    const startDate = new Date(vacationData.start_date);
    const endDate = new Date(vacationData.end_date);
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    if (startDate < currentDay) {
      return reject('Start date cannot be in the past', 400);
    }

    if (endDate < startDate) {
      return reject('End date cannot be earlier than start date', 400);
    }

    const vacation = {
      vacation_id: state.nextVacationId++,
      destination: vacationData.destination,
      description: vacationData.description,
      start_date: vacationData.start_date,
      end_date: vacationData.end_date,
      price: vacationData.price,
      image_filename: `https://source.unsplash.com/800x600/?${encodeURIComponent(vacationData.destination)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    state.vacations.push(vacation);
    saveDemoState(state);

    return mockResponse(enrichVacation(state, vacation, getCurrentUserId()), 201);
  },

  updateVacation: async (id: number, vacationData: UpdateVacationData): Promise<AxiosResponse<Vacation>> => {
    requireAdmin();
    const state = loadDemoState();
    const vacation = state.vacations.find((entry) => entry.vacation_id === id);

    if (!vacation) {
      return reject('Vacation not found', 404);
    }

    if (vacationData.destination) vacation.destination = vacationData.destination;
    if (vacationData.description) vacation.description = vacationData.description;
    if (vacationData.start_date) vacation.start_date = vacationData.start_date;
    if (vacationData.end_date) vacation.end_date = vacationData.end_date;
    if (vacationData.price !== undefined) vacation.price = vacationData.price;
    vacation.updated_at = new Date().toISOString();

    saveDemoState(state);
    return mockResponse(enrichVacation(state, vacation, getCurrentUserId()));
  },

  deleteVacation: async (id: number): Promise<AxiosResponse<{ message: string }>> => {
    requireAdmin();
    const state = loadDemoState();
    const index = state.vacations.findIndex((entry) => entry.vacation_id === id);

    if (index === -1) {
      return reject('Vacation not found', 404);
    }

    state.vacations.splice(index, 1);
    state.likes = state.likes.filter((like) => like.vacation_id !== id);
    saveDemoState(state);

    return mockResponse({ message: 'Vacation deleted successfully' });
  },

  likeVacation: async (id: number): Promise<AxiosResponse<{ message: string }>> => {
    const state = loadDemoState();
    const userId = requireUserId();

    if (!state.vacations.some((entry) => entry.vacation_id === id)) {
      return reject('Vacation not found', 404);
    }

    if (isLiked(state, userId, id)) {
      return reject('Vacation already liked', 400);
    }

    state.likes.push({ user_id: userId, vacation_id: id });
    saveDemoState(state);
    return mockResponse({ message: 'Vacation liked successfully' });
  },

  unlikeVacation: async (id: number): Promise<AxiosResponse<{ message: string }>> => {
    const state = loadDemoState();
    const userId = requireUserId();
    const likeIndex = state.likes.findIndex(
      (like) => like.user_id === userId && like.vacation_id === id
    );

    if (likeIndex === -1) {
      return reject('Vacation not liked', 400);
    }

    state.likes.splice(likeIndex, 1);
    saveDemoState(state);
    return mockResponse({ message: 'Vacation unliked successfully' });
  },

  getVacationReport: async (): Promise<AxiosResponse<ReportData[]>> => {
    requireAdmin();
    const state = loadDemoState();
    return mockResponse(buildReport(state));
  },
};
