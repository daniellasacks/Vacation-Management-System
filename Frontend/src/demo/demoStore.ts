import { User, Vacation, ReportData } from '../types';

const STORAGE_KEY = 'vacation-demo-state-v1';

const destinationImages: Record<string, string> = {
  'Paris, France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
  'Tokyo, Japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  'New York City, USA': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
  'Rome, Italy': 'https://images.unsplash.com/photo-1552830719-dad78188db7f?auto=format&fit=crop&w=800&q=80',
  'Barcelona, Spain': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
  'Sydney, Australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
  'London, England': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  'Dubai, UAE': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  'Bali, Indonesia': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
  'Amsterdam, Netherlands': 'https://images.unsplash.com/photo-1534351590666-13e3e996045a?auto=format&fit=crop&w=800&q=80',
  'Santorini, Greece': 'https://images.unsplash.com/photo-1613395877344-13d4a46178ba?auto=format&fit=crop&w=800&q=80',
  'Machu Picchu, Peru': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80',
  'Reykjavik, Iceland': 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=800&q=80',
  'Cape Town, South Africa': 'https://images.unsplash.com/photo-1580060839134-75a77027bf04?auto=format&fit=crop&w=800&q=80',
};

interface DemoUser extends User {
  password: string;
}

interface DemoVacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_filename: string | null;
  created_at: string;
  updated_at: string;
}

export interface DemoState {
  users: DemoUser[];
  vacations: DemoVacation[];
  likes: { user_id: number; vacation_id: number }[];
  nextUserId: number;
  nextVacationId: number;
}

const defaultUsers: DemoUser[] = [
  { user_id: 1, first_name: 'Admin', last_name: 'User', email: 'admin@vacation.com', password: 'admin123', role: 'admin' },
  { user_id: 2, first_name: 'John', last_name: 'Doe', email: 'john.doe@email.com', password: 'password123', role: 'user' },
  { user_id: 3, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@email.com', password: 'password123', role: 'user' },
  { user_id: 4, first_name: 'Mike', last_name: 'Johnson', email: 'mike.johnson@email.com', password: 'password123', role: 'user' },
];

const defaultVacations: DemoVacation[] = [
  { vacation_id: 1, destination: 'Paris, France', description: 'Experience the City of Light with iconic landmarks, world-class cuisine, and romantic atmosphere.', start_date: '2026-05-01', end_date: '2026-07-15', price: 2500, image_filename: destinationImages['Paris, France'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 2, destination: 'Tokyo, Japan', description: 'Discover the perfect blend of traditional culture and modern innovation across ancient temples and neon districts.', start_date: '2026-08-10', end_date: '2026-08-18', price: 3200, image_filename: destinationImages['Tokyo, Japan'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 3, destination: 'New York City, USA', description: 'Broadway shows, Central Park, world-famous museums, and incredible dining in the city that never sleeps.', start_date: '2026-06-01', end_date: '2026-06-20', price: 2800, image_filename: destinationImages['New York City, USA'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 4, destination: 'Rome, Italy', description: 'Walk through history in the Eternal City — Colosseum, Vatican City, and authentic Italian cuisine.', start_date: '2026-09-01', end_date: '2026-09-08', price: 2200, image_filename: destinationImages['Rome, Italy'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 5, destination: 'Barcelona, Spain', description: 'Explore Gaudí masterpieces, beautiful beaches, and vibrant Catalan culture.', start_date: '2026-06-10', end_date: '2026-06-25', price: 1900, image_filename: destinationImages['Barcelona, Spain'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 6, destination: 'Sydney, Australia', description: 'Iconic Opera House, beautiful harbor, and stunning beaches for outdoor adventures.', start_date: '2026-10-20', end_date: '2026-10-28', price: 3500, image_filename: destinationImages['Sydney, Australia'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 7, destination: 'London, England', description: 'Rich history and culture — Buckingham Palace, British Museum, and afternoon tea.', start_date: '2026-07-01', end_date: '2026-07-20', price: 2400, image_filename: destinationImages['London, England'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 8, destination: 'Dubai, UAE', description: 'Luxury shopping, stunning architecture, and desert adventures beneath the world\'s tallest building.', start_date: '2026-11-15', end_date: '2026-11-22', price: 2900, image_filename: destinationImages['Dubai, UAE'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 9, destination: 'Bali, Indonesia', description: 'Tropical paradise with beautiful beaches, ancient temples, and lush rice terraces.', start_date: '2026-08-01', end_date: '2026-08-18', price: 1800, image_filename: destinationImages['Bali, Indonesia'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 10, destination: 'Amsterdam, Netherlands', description: 'Charming canals, world-class museums, and cycling culture through historic streets.', start_date: '2026-09-15', end_date: '2026-09-22', price: 2100, image_filename: destinationImages['Amsterdam, Netherlands'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 11, destination: 'Santorini, Greece', description: 'Stunning sunsets, white-washed buildings, and crystal-clear waters.', start_date: '2026-10-01', end_date: '2026-10-08', price: 2300, image_filename: destinationImages['Santorini, Greece'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 12, destination: 'Machu Picchu, Peru', description: 'Ancient Incan ruins high in the Andes — a once-in-a-lifetime adventure.', start_date: '2026-12-01', end_date: '2026-12-10', price: 2600, image_filename: destinationImages['Machu Picchu, Peru'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 13, destination: 'Reykjavik, Iceland', description: 'Northern lights, geysers, and dramatic landscapes in the land of fire and ice.', start_date: '2026-04-01', end_date: '2026-04-15', price: 2700, image_filename: destinationImages['Reykjavik, Iceland'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { vacation_id: 14, destination: 'Cape Town, South Africa', description: 'Table Mountain, beautiful beaches, and rich cultural heritage at the tip of Africa.', start_date: '2026-07-10', end_date: '2026-07-18', price: 2400, image_filename: destinationImages['Cape Town, South Africa'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const defaultLikes = [
  { user_id: 2, vacation_id: 1 },
  { user_id: 2, vacation_id: 3 },
  { user_id: 2, vacation_id: 5 },
  { user_id: 2, vacation_id: 7 },
  { user_id: 3, vacation_id: 2 },
  { user_id: 3, vacation_id: 4 },
  { user_id: 3, vacation_id: 6 },
  { user_id: 3, vacation_id: 8 },
  { user_id: 4, vacation_id: 1 },
  { user_id: 4, vacation_id: 2 },
  { user_id: 4, vacation_id: 9 },
  { user_id: 4, vacation_id: 11 },
];

export function createDefaultState(): DemoState {
  return {
    users: defaultUsers.map((user) => ({ ...user })),
    vacations: defaultVacations.map((vacation) => ({ ...vacation })),
    likes: defaultLikes.map((like) => ({ ...like })),
    nextUserId: 5,
    nextVacationId: 15,
  };
}

export function loadDemoState(): DemoState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const state = createDefaultState();
    saveDemoState(state);
    return state;
  }

  try {
    return JSON.parse(raw) as DemoState;
  } catch {
    const state = createDefaultState();
    saveDemoState(state);
    return state;
  }
}

export function saveDemoState(state: DemoState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getLikesCount(state: DemoState, vacationId: number): number {
  return state.likes.filter((like) => like.vacation_id === vacationId).length;
}

export function isLiked(state: DemoState, userId: number | undefined, vacationId: number): boolean {
  if (!userId) return false;
  return state.likes.some((like) => like.user_id === userId && like.vacation_id === vacationId);
}

export function enrichVacation(state: DemoState, vacation: DemoVacation, userId?: number): Vacation {
  return {
    ...vacation,
    likes_count: getLikesCount(state, vacation.vacation_id),
    is_liked: isLiked(state, userId, vacation.vacation_id),
  };
}

export function getCurrentUserId(): number | undefined {
  const userStr = localStorage.getItem('user');
  if (!userStr) return undefined;
  try {
    const user = JSON.parse(userStr) as User;
    return user.user_id;
  } catch {
    return undefined;
  }
}

export function toPublicUser(user: DemoUser): User {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export function buildReport(state: DemoState): ReportData[] {
  return state.vacations
    .map((vacation) => ({
      destination: vacation.destination,
      likes_count: getLikesCount(state, vacation.vacation_id),
    }))
    .sort((a, b) => b.likes_count - a.likes_count);
}

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}
