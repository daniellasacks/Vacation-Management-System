import pool from '../utils/database';

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [id]
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  static async create(userData: CreateUserData): Promise<User> {
    const { first_name, last_name, email, password, role = 'user' } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, password, role]
    );
    const insertResult = result as any;
    const user = await this.findById(insertResult.insertId);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  static async emailExists(email: string): Promise<boolean> {
    const [rows] = await pool.execute(
      'SELECT 1 FROM users WHERE email = ?',
      [email]
    );
    const result = rows as any[];
    return result.length > 0;
  }
}
