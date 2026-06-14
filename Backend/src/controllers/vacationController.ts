import { Request, Response } from 'express';
import { VacationModel, CreateVacationData, UpdateVacationData } from '../models/Vacation';
import { LikeModel } from '../models/Like';
import { AuthenticatedRequest } from '../middleware/auth';

export const getVacations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const filter = req.query.filter as string || 'all';
    const userId = req.user?.userId;

    let vacations;
    let totalCount;

    switch (filter) {
      case 'liked':
        if (!userId) {
          return res.status(401).json({ message: 'Authentication required' });
        }
        vacations = await VacationModel.findLikedByUser(userId, page, limit);
        totalCount = vacations.length;
        break;
      case 'active':
        vacations = await VacationModel.findActive(page, limit, userId);
        totalCount = await VacationModel.getTotalCount();
        break;
      case 'upcoming':
        vacations = await VacationModel.findUpcoming(page, limit, userId);
        totalCount = await VacationModel.getTotalCount();
        break;
      default:
        vacations = await VacationModel.findAll(userId, page, limit);
        totalCount = await VacationModel.getTotalCount();
    }

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      vacations,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get vacations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVacationById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    const vacation = await VacationModel.findById(parseInt(id), userId);
    if (!vacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    res.json(vacation);
  } catch (error) {
    console.error('Get vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createVacation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { destination, description, start_date, end_date, price } = req.body;
    const image_filename = req.file?.filename;

    if (!destination || !description || !start_date || !end_date || price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (price < 0 || price > 10000) {
      return res.status(400).json({ message: 'Price must be between 0 and 10,000' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (endDate < startDate) {
      return res.status(400).json({ message: 'End date cannot be earlier than start date' });
    }

    const vacationData: CreateVacationData = {
      destination,
      description,
      start_date: startDate,
      end_date: endDate,
      price: parseFloat(price),
      image_filename
    };

    const vacation = await VacationModel.create(vacationData);
    res.status(201).json(vacation);
  } catch (error) {
    console.error('Create vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateVacation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { destination, description, start_date, end_date, price } = req.body;
    const image_filename = req.file?.filename;

    const existingVacation = await VacationModel.findById(parseInt(id));
    if (!existingVacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    if (price !== undefined && (price < 0 || price > 10000)) {
      return res.status(400).json({ message: 'Price must be between 0 and 10,000' });
    }

    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (endDate < startDate) {
        return res.status(400).json({ message: 'End date cannot be earlier than start date' });
      }
    }

    const updateData: UpdateVacationData = {};
    if (destination) updateData.destination = destination;
    if (description) updateData.description = description;
    if (start_date) updateData.start_date = new Date(start_date);
    if (end_date) updateData.end_date = new Date(end_date);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (image_filename) updateData.image_filename = image_filename;

    const vacation = await VacationModel.update(parseInt(id), updateData);
    res.json(vacation);
  } catch (error) {
    console.error('Update vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteVacation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingVacation = await VacationModel.findById(parseInt(id));
    if (!existingVacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    const deleted = await VacationModel.delete(parseInt(id));
    if (deleted) {
      res.json({ message: 'Vacation deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete vacation' });
    }
  } catch (error) {
    console.error('Delete vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const likeVacation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const vacation = await VacationModel.findById(parseInt(id));
    if (!vacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    const alreadyLiked = await LikeModel.exists(userId, parseInt(id));
    if (alreadyLiked) {
      return res.status(400).json({ message: 'Vacation already liked' });
    }

    await LikeModel.create(userId, parseInt(id));
    res.json({ message: 'Vacation liked successfully' });
  } catch (error) {
    console.error('Like vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unlikeVacation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const vacation = await VacationModel.findById(parseInt(id));
    if (!vacation) {
      return res.status(404).json({ message: 'Vacation not found' });
    }

    const liked = await LikeModel.exists(userId, parseInt(id));
    if (!liked) {
      return res.status(400).json({ message: 'Vacation not liked' });
    }

    await LikeModel.delete(userId, parseInt(id));
    res.json({ message: 'Vacation unliked successfully' });
  } catch (error) {
    console.error('Unlike vacation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVacationReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reportData = await VacationModel.getReportData();
    res.json(reportData);
  } catch (error) {
    console.error('Get vacation report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
