import pool from '../utils/database';

export interface Like {
  user_id: number;
  vacation_id: number;
  created_at: Date;
}

export class LikeModel {
  static async create(userId: number, vacationId: number): Promise<Like> {
    await pool.execute(
      'INSERT INTO likes (user_id, vacation_id) VALUES (?, ?)',
      [userId, vacationId]
    );
    return { user_id: userId, vacation_id: vacationId, created_at: new Date() };
  }

  static async delete(userId: number, vacationId: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM likes WHERE user_id = ? AND vacation_id = ?',
      [userId, vacationId]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  static async exists(userId: number, vacationId: number): Promise<boolean> {
    const [rows] = await pool.execute(
      'SELECT 1 FROM likes WHERE user_id = ? AND vacation_id = ?',
      [userId, vacationId]
    );
    const result = rows as any[];
    return result.length > 0;
  }
}
