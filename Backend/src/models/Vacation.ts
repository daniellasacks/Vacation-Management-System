import pool from '../utils/database';

export interface Vacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: Date;
  end_date: Date;
  price: number;
  image_filename: string | null;
  created_at: Date;
  updated_at: Date;
  likes_count?: number;
  is_liked?: boolean;
}

export interface CreateVacationData {
  destination: string;
  description: string;
  start_date: Date;
  end_date: Date;
  price: number;
  image_filename?: string;
}

export interface UpdateVacationData {
  destination?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  price?: number;
  image_filename?: string;
}

export class VacationModel {
  static async findAll(userId?: number, page: number = 1, limit: number = 9): Promise<Vacation[]> {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT v.*, 
             COALESCE(l.likes_count, 0) as likes_count,
             CASE WHEN l2.user_id IS NOT NULL THEN 1 ELSE 0 END as is_liked
      FROM vacations v
      LEFT JOIN (
        SELECT vacation_id, COUNT(user_id) as likes_count
        FROM likes
        GROUP BY vacation_id
      ) l ON v.vacation_id = l.vacation_id
      LEFT JOIN likes l2 ON v.vacation_id = l2.vacation_id AND l2.user_id = ?
      ORDER BY v.start_date ASC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.execute(query, [userId || null, limit, offset]);
    return rows as Vacation[];
  }

  static async findById(id: number, userId?: number): Promise<Vacation | null> {
    const query = `
      SELECT v.*, 
             COALESCE(l.likes_count, 0) as likes_count,
             CASE WHEN l2.user_id IS NOT NULL THEN 1 ELSE 0 END as is_liked
      FROM vacations v
      LEFT JOIN (
        SELECT vacation_id, COUNT(user_id) as likes_count
        FROM likes
        GROUP BY vacation_id
      ) l ON v.vacation_id = l.vacation_id
      LEFT JOIN likes l2 ON v.vacation_id = l2.vacation_id AND l2.user_id = ?
      WHERE v.vacation_id = ?
    `;
    
    const [rows] = await pool.execute(query, [userId || null, id]);
    const vacations = rows as Vacation[];
    return vacations.length > 0 ? vacations[0] : null;
  }

  static async create(vacationData: CreateVacationData): Promise<Vacation> {
    const { destination, description, start_date, end_date, price, image_filename } = vacationData;
    const [result] = await pool.execute(
      'INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES (?, ?, ?, ?, ?)',
      [destination, description, start_date, end_date, price, image_filename || null]
    );
    const insertResult = result as any;
    const vacation = await this.findById(insertResult.insertId);
    if (!vacation) {
      throw new Error('Failed to create vacation');
    }
    return vacation;
  }

  static async update(id: number, vacationData: UpdateVacationData): Promise<Vacation | null> {
    const fields: string[] = [];
    const values: any[] = [];
    
    Object.entries(vacationData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    values.push(id);
    const query = `UPDATE vacations SET ${fields.join(', ')} WHERE vacation_id = ?`;
    
    await pool.execute(query, values);
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM vacations WHERE vacation_id = ?',
      [id]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  static async getTotalCount(): Promise<number> {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM vacations');
    const result = rows as any[];
    return result[0].count;
  }

  static async findLikedByUser(userId: number, page: number = 1, limit: number = 9): Promise<Vacation[]> {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT v.*, 
             COALESCE(lc.likes_count, 0) as likes_count,
             1 as is_liked
      FROM vacations v
      INNER JOIN likes l ON v.vacation_id = l.vacation_id
      LEFT JOIN (
        SELECT vacation_id, COUNT(user_id) as likes_count
        FROM likes
        GROUP BY vacation_id
      ) lc ON v.vacation_id = lc.vacation_id
      WHERE l.user_id = ?
      ORDER BY v.start_date ASC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.execute(query, [userId, Number(limit), Number(offset)]);
    return rows as Vacation[];
  }

  static async findActive(page: number = 1, limit: number = 9, userId?: number): Promise<Vacation[]> {
    const offset = (page - 1) * limit;
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT v.*, 
             COALESCE(l.likes_count, 0) as likes_count,
             CASE WHEN l2.user_id IS NOT NULL THEN 1 ELSE 0 END as is_liked
      FROM vacations v
      LEFT JOIN (
        SELECT vacation_id, COUNT(user_id) as likes_count
        FROM likes
        GROUP BY vacation_id
      ) l ON v.vacation_id = l.vacation_id
      LEFT JOIN likes l2 ON v.vacation_id = l2.vacation_id AND l2.user_id = ?
      WHERE v.start_date <= ? AND v.end_date >= ?
      ORDER BY v.start_date ASC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.execute(query, [userId || null, today, today, Number(limit), Number(offset)]);
    return rows as Vacation[];
  }

  static async findUpcoming(page: number = 1, limit: number = 9, userId?: number): Promise<Vacation[]> {
    const offset = (page - 1) * limit;
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT v.*, 
             COALESCE(l.likes_count, 0) as likes_count,
             CASE WHEN l2.user_id IS NOT NULL THEN 1 ELSE 0 END as is_liked
      FROM vacations v
      LEFT JOIN (
        SELECT vacation_id, COUNT(user_id) as likes_count
        FROM likes
        GROUP BY vacation_id
      ) l ON v.vacation_id = l.vacation_id
      LEFT JOIN likes l2 ON v.vacation_id = l2.vacation_id AND l2.user_id = ?
      WHERE v.start_date > ?
      ORDER BY v.start_date ASC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.execute(query, [userId || null, today, Number(limit), Number(offset)]);
    return rows as Vacation[];
  }

  static async getReportData(): Promise<{ destination: string; likes_count: number }[]> {
    const query = `
      SELECT v.destination, COUNT(l.user_id) as likes_count
      FROM vacations v
      LEFT JOIN likes l ON v.vacation_id = l.vacation_id
      GROUP BY v.vacation_id, v.destination
      ORDER BY likes_count DESC
    `;
    
    const [rows] = await pool.execute(query);
    return rows as { destination: string; likes_count: number }[];
  }
}
