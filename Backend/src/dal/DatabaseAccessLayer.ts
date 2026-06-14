import mysql from 'mysql2/promise';
import config from '../config/AppConfig';

export class DatabaseAccessLayer {
  private static pool: mysql.Pool;

  /**
   * Initialize database connection pool
   */
  static initialize() {
    this.pool = mysql.createPool({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      port: config.database.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  /**
   * Get database connection pool
   */
  static getPool(): mysql.Pool {
    if (!this.pool) {
      this.initialize();
    }
    return this.pool;
  }

  /**
   * Execute a query with parameters
   */
  static async execute<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T[]> {
    const pool = this.getPool();
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  }

  /**
   * Execute a query and return the first result
   */
  static async executeOne<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T | null> {
    const results = await this.execute<T>(query, params);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Execute an insert query and return the insert ID
   */
  static async insert(query: string, params: any[] = []): Promise<number> {
    const pool = this.getPool();
    const [result] = await pool.execute(query, params);
    return (result as mysql.ResultSetHeader).insertId;
  }

  /**
   * Execute an update query and return the affected rows count
   */
  static async update(query: string, params: any[] = []): Promise<number> {
    const pool = this.getPool();
    const [result] = await pool.execute(query, params);
    return (result as mysql.ResultSetHeader).affectedRows;
  }

  /**
   * Execute a delete query and return the affected rows count
   */
  static async delete(query: string, params: any[] = []): Promise<number> {
    const pool = this.getPool();
    const [result] = await pool.execute(query, params);
    return (result as mysql.ResultSetHeader).affectedRows;
  }

  /**
   * Begin a transaction
   */
  static async beginTransaction(): Promise<mysql.PoolConnection> {
    const pool = this.getPool();
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
  }

  /**
   * Commit a transaction
   */
  static async commitTransaction(connection: mysql.PoolConnection): Promise<void> {
    await connection.commit();
    connection.release();
  }

  /**
   * Rollback a transaction
   */
  static async rollbackTransaction(connection: mysql.PoolConnection): Promise<void> {
    await connection.rollback();
    connection.release();
  }
}
