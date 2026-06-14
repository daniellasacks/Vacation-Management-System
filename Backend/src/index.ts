import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import vacationRoutes from './routes/vacations';
import demoAuthRoutes from './demo/demoAuthRoutes';
import demoVacationRoutes from './demo/demoVacationRoutes';
import { demoStore } from './demo/demoStore';

dotenv.config({ path: path.join(__dirname, '../config.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const isDemoMode = process.env.DEMO_MODE === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const frontendDistPath = path.join(__dirname, '../../Frontend/dist');

const allowedOrigins = [
  'http://localhost:3000',
  'https://daniellasacks.github.io',
  'https://vacation-management-system.onrender.com',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      callback(null, true);
      return;
    }
    callback(null, true);
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

async function startServer() {
  if (isDemoMode) {
    await demoStore.seed();
    console.log('Running in demo mode with in-memory data');
    app.use('/api/auth', demoAuthRoutes);
    app.use('/api/vacations', demoVacationRoutes);
  } else {
    app.use('/api/auth', authRoutes);
    app.use('/api/vacations', vacationRoutes);
  }

  app.get('/api/health', (_req, res) => {
    res.json({
      message: 'Server is running',
      mode: isDemoMode ? 'demo' : 'database',
      timestamp: new Date().toISOString(),
    });
  });

  if (isProduction && fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  }

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ message: 'Route not found' });
      return;
    }
    res.status(404).json({ message: 'Route not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
