import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../config.env' });

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export interface TokenPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
