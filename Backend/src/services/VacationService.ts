import { VacationModel } from '../models/Vacation';
import { LikeModel } from '../models/Like';

export class VacationService {
  /**
   * Get all vacations with pagination and filtering
   */
  static async getVacations(
    page: number = 1,
    limit: number = 9,
    filter: string = 'all',
    userId?: number
  ) {
    const offset = (page - 1) * limit;
    
    switch (filter) {
      case 'liked':
        return await VacationModel.findLikedByUser(userId!, page, limit);
      case 'active':
        return await VacationModel.findActive(userId, page, limit);
      case 'upcoming':
        return await VacationModel.findUpcoming(userId, page, limit);
      default:
        return await VacationModel.findAll(userId, page, limit);
    }
  }

  /**
   * Get vacation by ID with like status
   */
  static async getVacationById(id: number, userId?: number) {
    return await VacationModel.findById(id, userId);
  }

  /**
   * Create a new vacation
   */
  static async createVacation(vacationData: any) {
    return await VacationModel.create(vacationData);
  }

  /**
   * Update an existing vacation
   */
  static async updateVacation(id: number, vacationData: any) {
    return await VacationModel.update(id, vacationData);
  }

  /**
   * Delete a vacation
   */
  static async deleteVacation(id: number) {
    return await VacationModel.delete(id);
  }

  /**
   * Like a vacation
   */
  static async likeVacation(userId: number, vacationId: number) {
    return await LikeModel.create(userId, vacationId);
  }

  /**
   * Unlike a vacation
   */
  static async unlikeVacation(userId: number, vacationId: number) {
    return await LikeModel.delete(userId, vacationId);
  }

  /**
   * Get vacation report data
   */
  static async getVacationReport() {
    return await VacationModel.getReportData();
  }
}
