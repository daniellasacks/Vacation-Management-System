import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  getVacations,
  getVacationById,
  createVacation,
  updateVacation,
  deleteVacation,
  likeVacation,
  unlikeVacation,
  getVacationReport
} from '../controllers/vacationController';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes
router.get('/', authenticate, getVacations);
router.get('/report', authenticate, requireAdmin, getVacationReport);
router.get('/:id', authenticate, getVacationById);

// User routes
router.post('/:id/like', authenticate, likeVacation);
router.delete('/:id/like', authenticate, unlikeVacation);

// Admin routes
router.post('/', authenticate, requireAdmin, upload.single('image'), createVacation);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateVacation);
router.delete('/:id', authenticate, requireAdmin, deleteVacation);

export default router;
