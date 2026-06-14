import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../config.env' });

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
}

const config: AppConfig = {
  server: {
    port: parseInt(process.env.PORT || '3001'),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vacation_management',
    port: parseInt(process.env.DB_PORT || '3306'),
  },
};

export default config;
