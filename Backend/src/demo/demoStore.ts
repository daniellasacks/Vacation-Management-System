import bcrypt from 'bcryptjs';

export interface DemoUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
}

export interface DemoVacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_filename: string | null;
  created_at: Date;
  updated_at: Date;
}

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

const vacationSeed: Omit<DemoVacation, 'vacation_id' | 'created_at' | 'updated_at'>[] = [
  { destination: 'Paris, France', description: 'Experience the City of Light with iconic landmarks, world-class cuisine, and romantic atmosphere.', start_date: '2026-05-01', end_date: '2026-07-15', price: 2500, image_filename: destinationImages['Paris, France'] },
  { destination: 'Tokyo, Japan', description: 'Discover the perfect blend of traditional culture and modern innovation across ancient temples and neon districts.', start_date: '2026-08-10', end_date: '2026-08-18', price: 3200, image_filename: destinationImages['Tokyo, Japan'] },
  { destination: 'New York City, USA', description: 'Broadway shows, Central Park, world-famous museums, and incredible dining in the city that never sleeps.', start_date: '2026-06-01', end_date: '2026-06-20', price: 2800, image_filename: destinationImages['New York City, USA'] },
  { destination: 'Rome, Italy', description: 'Walk through history in the Eternal City — Colosseum, Vatican City, and authentic Italian cuisine.', start_date: '2026-09-01', end_date: '2026-09-08', price: 2200, image_filename: destinationImages['Rome, Italy'] },
  { destination: 'Barcelona, Spain', description: 'Explore Gaudí masterpieces, beautiful beaches, and vibrant Catalan culture.', start_date: '2026-06-10', end_date: '2026-06-25', price: 1900, image_filename: destinationImages['Barcelona, Spain'] },
  { destination: 'Sydney, Australia', description: 'Iconic Opera House, beautiful harbor, and stunning beaches for outdoor adventures.', start_date: '2026-10-20', end_date: '2026-10-28', price: 3500, image_filename: destinationImages['Sydney, Australia'] },
  { destination: 'London, England', description: 'Rich history and culture — Buckingham Palace, British Museum, and afternoon tea.', start_date: '2026-07-01', end_date: '2026-07-20', price: 2400, image_filename: destinationImages['London, England'] },
  { destination: 'Dubai, UAE', description: 'Luxury shopping, stunning architecture, and desert adventures beneath the world\'s tallest building.', start_date: '2026-11-15', end_date: '2026-11-22', price: 2900, image_filename: destinationImages['Dubai, UAE'] },
  { destination: 'Bali, Indonesia', description: 'Tropical paradise with beautiful beaches, ancient temples, and lush rice terraces.', start_date: '2026-08-01', end_date: '2026-08-18', price: 1800, image_filename: destinationImages['Bali, Indonesia'] },
  { destination: 'Amsterdam, Netherlands', description: 'Charming canals, world-class museums, and cycling culture through historic streets.', start_date: '2026-09-15', end_date: '2026-09-22', price: 2100, image_filename: destinationImages['Amsterdam, Netherlands'] },
  { destination: 'Santorini, Greece', description: 'Stunning sunsets, white-washed buildings, and crystal-clear waters.', start_date: '2026-10-01', end_date: '2026-10-08', price: 2300, image_filename: destinationImages['Santorini, Greece'] },
  { destination: 'Machu Picchu, Peru', description: 'Ancient Incan ruins high in the Andes — a once-in-a-lifetime adventure.', start_date: '2026-12-01', end_date: '2026-12-10', price: 2600, image_filename: destinationImages['Machu Picchu, Peru'] },
  { destination: 'Reykjavik, Iceland', description: 'Northern lights, geysers, and dramatic landscapes in the land of fire and ice.', start_date: '2026-04-01', end_date: '2026-04-15', price: 2700, image_filename: destinationImages['Reykjavik, Iceland'] },
  { destination: 'Cape Town, South Africa', description: 'Table Mountain, beautiful beaches, and rich cultural heritage at the tip of Africa.', start_date: '2026-07-10', end_date: '2026-07-18', price: 2400, image_filename: destinationImages['Cape Town, South Africa'] },
];

class DemoStore {
  users: DemoUser[] = [];
  vacations: DemoVacation[] = [];
  likes: { user_id: number; vacation_id: number; created_at: Date }[] = [];
  private nextUserId = 5;
  private nextVacationId = 15;

  async seed() {
    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('password123', 10);
    const now = new Date();

    this.users = [
      { user_id: 1, first_name: 'Admin', last_name: 'User', email: 'admin@vacation.com', password: adminHash, role: 'admin', created_at: now },
      { user_id: 2, first_name: 'John', last_name: 'Doe', email: 'john.doe@email.com', password: userHash, role: 'user', created_at: now },
      { user_id: 3, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@email.com', password: userHash, role: 'user', created_at: now },
      { user_id: 4, first_name: 'Mike', last_name: 'Johnson', email: 'mike.johnson@email.com', password: userHash, role: 'user', created_at: now },
    ];

    this.vacations = vacationSeed.map((vacation, index) => ({
      ...vacation,
      vacation_id: index + 1,
      created_at: now,
      updated_at: now,
    }));

    this.likes = [
      { user_id: 2, vacation_id: 1, created_at: now },
      { user_id: 2, vacation_id: 3, created_at: now },
      { user_id: 2, vacation_id: 5, created_at: now },
      { user_id: 2, vacation_id: 7, created_at: now },
      { user_id: 3, vacation_id: 2, created_at: now },
      { user_id: 3, vacation_id: 4, created_at: now },
      { user_id: 3, vacation_id: 6, created_at: now },
      { user_id: 3, vacation_id: 8, created_at: now },
      { user_id: 4, vacation_id: 1, created_at: now },
      { user_id: 4, vacation_id: 2, created_at: now },
      { user_id: 4, vacation_id: 9, created_at: now },
      { user_id: 4, vacation_id: 11, created_at: now },
    ];
  }

  getLikesCount(vacationId: number): number {
    return this.likes.filter((like) => like.vacation_id === vacationId).length;
  }

  isLiked(userId: number | undefined, vacationId: number): boolean {
    if (!userId) return false;
    return this.likes.some((like) => like.user_id === userId && like.vacation_id === vacationId);
  }

  enrichVacation(vacation: DemoVacation, userId?: number) {
    return {
      ...vacation,
      likes_count: this.getLikesCount(vacation.vacation_id),
      is_liked: this.isLiked(userId, vacation.vacation_id),
    };
  }

  createUser(data: Omit<DemoUser, 'user_id' | 'created_at'>): DemoUser {
    const user: DemoUser = {
      ...data,
      user_id: this.nextUserId++,
      created_at: new Date(),
    };
    this.users.push(user);
    return user;
  }

  createVacation(data: Omit<DemoVacation, 'vacation_id' | 'created_at' | 'updated_at'>): DemoVacation {
    const now = new Date();
    const vacation: DemoVacation = {
      ...data,
      vacation_id: this.nextVacationId++,
      created_at: now,
      updated_at: now,
    };
    this.vacations.push(vacation);
    return vacation;
  }
}

export const demoStore = new DemoStore();
