/**
 * Database connection pool configuration
 * Uses mysql2/promise for async/await support and prepared statements (SQL injection protection)
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'questlog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: '+00:00',
});

/**
 * Test database connectivity on startup
 */
async function testConnection() {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
}

module.exports = { pool, testConnection };
