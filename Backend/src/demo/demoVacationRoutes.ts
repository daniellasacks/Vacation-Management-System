import { Router, Response } from 'express';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { demoStore } from './demoStore';

const router = Router();
const today = () => new Date().toISOString().split('T')[0];

router.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const filter = (req.query.filter as string) || 'all';
    const userId = req.user?.userId;
    const currentDay = today();

    let filtered = [...demoStore.vacations];

    switch (filter) {
      case 'liked':
        if (!userId) {
          return res.status(401).json({ message: 'Authentication required' });
        }
        filtered = filtered.filter((vacation) => demoStore.isLiked(userId, vacation.vacation_id));
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
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const offset = (page - 1) * limit;
    const vacations = filtered
      .slice(offset, offset + limit)
      .map((vacation) => demoStore.enrichVacation(vacation, userId));

    res.json({
      vacations,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Demo get vacations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/report', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const reportData = demoStore.vacations
      .map((vacation) => ({
        destination: vacation.destination,
        likes_count: demoStore.getLikesCount(vacation.vacation_id),
      }))
      .sort((a, b) => b.likes_count - a.likes_count);

    res.json(reportData);
  } catch (error) {
    console.error('Demo report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const vacation = demoStore.vacations.find((entry) => entry.vacation_id === id);

    if (!vacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    res.json(demoStore.enrichVacation(vacation, req.user?.userId));
  } catch (error) {
    console.error('Demo get vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:id/like', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const vacation = demoStore.vacations.find((entry) => entry.vacation_id === id);
    if (!vacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    if (demoStore.isLiked(userId, id)) {
      return res.status(400).json({ message: 'Vacation already liked' });
    }

    demoStore.likes.push({ user_id: userId, vacation_id: id, created_at: new Date() });
    res.json({ message: 'Vacation liked successfully' });
  } catch (error) {
    console.error('Demo like error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id/like', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const vacation = demoStore.vacations.find((entry) => entry.vacation_id === id);
    if (!vacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    const likeIndex = demoStore.likes.findIndex(
      (like) => like.user_id === userId && like.vacation_id === id
    );

    if (likeIndex === -1) {
      return res.status(400).json({ message: 'Vacation not liked' });
    }

    demoStore.likes.splice(likeIndex, 1);
    res.json({ message: 'Vacation unliked successfully' });
  } catch (error) {
    console.error('Demo unlike error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { destination, description, start_date, end_date, price } = req.body;

    if (!destination || !description || !start_date || !end_date || price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedPrice = parseFloat(price);
    if (parsedPrice < 0 || parsedPrice > 10000) {
      return res.status(400).json({ message: 'Price must be between 0 and 10,000' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    if (startDate < currentDay) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (endDate < startDate) {
      return res.status(400).json({ message: 'End date cannot be earlier than start date' });
    }

    const vacation = demoStore.createVacation({
      destination,
      description,
      start_date,
      end_date,
      price: parsedPrice,
      image_filename: `https://source.unsplash.com/800x600/?${encodeURIComponent(destination)}`,
    });

    res.status(201).json(demoStore.enrichVacation(vacation, req.user?.userId));
  } catch (error) {
    console.error('Demo create vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const vacation = demoStore.vacations.find((entry) => entry.vacation_id === id);

    if (!vacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    const { destination, description, start_date, end_date, price } = req.body;

    if (price !== undefined && (parseFloat(price) < 0 || parseFloat(price) > 10000)) {
      return res.status(400).json({ message: 'Price must be between 0 and 10,000' });
    }

    if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({ message: 'End date cannot be earlier than start date' });
    }

    if (destination) vacation.destination = destination;
    if (description) vacation.description = description;
    if (start_date) vacation.start_date = start_date;
    if (end_date) vacation.end_date = end_date;
    if (price !== undefined) vacation.price = parseFloat(price);
    vacation.updated_at = new Date();

    res.json(demoStore.enrichVacation(vacation, req.user?.userId));
  } catch (error) {
    console.error('Demo update vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const index = demoStore.vacations.findIndex((entry) => entry.vacation_id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    demoStore.vacations.splice(index, 1);
    demoStore.likes = demoStore.likes.filter((like) => like.vacation_id !== id);
    res.json({ message: 'Vacation deleted successfully' });
  } catch (error) {
    console.error('Demo delete vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
