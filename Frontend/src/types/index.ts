export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Vacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_filename: string | null;
  likes_count: number;
  is_liked: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface VacationsResponse {
  vacations: Vacation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ReportData {
  destination: string;
  likes_count: number;
}

export interface CreateVacationData {
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image?: File;
}

export interface UpdateVacationData {
  destination?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  image?: File;
}
