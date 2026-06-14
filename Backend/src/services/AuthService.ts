import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import config from '../config/AppConfig';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) {
    // Check if email already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Login user
   */
  static async login(email: string, password: string) {
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Generate JWT token
   */
  private static generateToken(user: any): string {
    return jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        role: user.role,
      },
      config.server.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): any {
    return jwt.verify(token, config.server.jwtSecret);
  }
}
